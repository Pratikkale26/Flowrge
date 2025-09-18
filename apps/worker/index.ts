import { prisma } from "db/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "common/common";

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' });
    await consumer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })
            // stops the consumer for 5s
            await new Promise(r => setTimeout(r, 5000))

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: message.offset + 1
            }])
        },
    })
}

main();