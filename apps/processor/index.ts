import { prisma } from "db/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "common/common";

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092']
})

async function main() {
    const producer = kafka.producer();
    await producer.connect();

    while (1) {
        // get the zap from outbox
        const pendingRows = await prisma.zapRunOutbox.findMany({
            where: {},
            take: 10
        })

        // send to kafka
        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => ({
                value: r.zapRunId
            }))
        })

        // delete the zap entry from outbox
        await prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(r => r.id)
                }
            }
        })
    }   
}

main();