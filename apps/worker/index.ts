import { prisma } from "db/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "common/common";
import { parseAction } from "./utils/parser";
import { sendEmail } from "./utils/email";
import { submitDurableForZapFlow } from "./utils/sendDurable";
import { cleanupUsedNonceAccounts } from "./utils/cleanupNonces";
import { sendXPost } from "./utils/sendXPost";

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })
            if(!message.value?.toString()) {
                return;
            }

            const parcedValue = JSON.parse(message.value.toString());
            const { zapRunId, stage } = parcedValue;

            // here we are getting the zaprun details like - zap, trigger
            const zapRunDetails = await prisma.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                // get the zap from zapRunId, then get the actions, then get the type of the action(send email, send sol)
                include:{
                    zap: {
                        include: {
                            actions: {
                                include : {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });
            if(!zapRunDetails) {
                return;
            }

            // here we are getting the current action, if it is email or sol
            const currentAction = zapRunDetails?.zap.actions.find(a => a.sortingOrder === stage);
            if(!currentAction) {
                console.log("No current stage found");
                return;
            }

            const parsed = parseAction(currentAction);
            // console.log(parsed);

            if(parsed.type === "email") {
                console.log("Sending email...");
                await sendEmail({
                    to: parsed.data.email,
                    subject: parsed.data.subject,
                    text: parsed.data.body,
                    connected: parsed.data.connected,
                    provider: parsed.data.provider,
                    userId: zapRunDetails.zap.userId
                })
                console.log("Email sent successfully");
            }

            if(parsed.type === "sol") {
                console.log("Submitting durable SOL transaction...");
                const ok = await submitDurableForZapFlow(zapRunDetails.zap.id, "zap");
                if (!ok) {
                    console.error("No pending durable transaction found or submission failed");
                } else {
                    console.log("Durable SOL submitted successfully");
                }
            }

            if(parsed.type === "x-post") {
                console.log("Posting to X...");
                try {
                    await sendXPost({
                        content: parsed.data.content,
                        connected: parsed.data.connected,
                        userId: zapRunDetails.zap.userId,
                    });
                    console.log("X post sent successfully");
                } catch (error) {
                    console.error("Failed to send X post:", error);
                }
            }

            // stops the consumer for 500ms
            await new Promise(r => setTimeout(r, 500))

            const zapId = message.value?.toString();
            if(!zapId) {
                return;
            }

            const messages = [{
                value: JSON.stringify({ zapRunId, stage: stage + 1 })
            }]; 
            const lastStage = (zapRunDetails.zap.actions.length || 1) - 1; // this is the last action of the zap
            if (lastStage !== stage) {
                try {
                    const result = await producer.send({
                        topic: TOPIC_NAME,
                        messages
                    })

                    // Log when tasks are actually acknowledged by Kafka
                    result.forEach(r =>
                      console.log(
                        `Worker: Sent ${messages.length} messages to topic ${r.topicName}, partition ${r.partition}, baseOffset ${r.baseOffset}`
                      )
                    );
                } catch (error) {
                    console.error(error);
                }
            }


            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: message.offset + 1
            }])
        },
    })

    // Periodic cleanup loop (runs in background)
    setInterval(() => {
        cleanupUsedNonceAccounts(5).catch((e) => console.error("Cleanup job error", e));
    }, 60_000);
}

main();