import { prisma } from "db/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "common/common";
import { parseAction } from "./utils/parser";
import { sendEmail } from "./utils/email";
import { sendSol } from "./utils/sendSol";

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
                    text: parsed.data.body
                })
            }

            if(parsed.type === "sol") {
                console.log("Sending SOL...");
                await sendSol(
                    parsed.data.address, 
                    String(parsed.data.amount)
                );
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
}

main();