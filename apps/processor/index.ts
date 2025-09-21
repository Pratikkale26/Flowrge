import { prisma } from "db/prisma";
import { Kafka } from "kafkajs";
import { TOPIC_NAME } from "common/common";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (true) {
    const pendingRows = await prisma.zapRunOutbox.findMany({
      where: {},
      take: 10,
    });

    if (!pendingRows.length) {
      await new Promise((r) => setTimeout(r, 500)); // small backoff
      continue;
    }

    const messages = pendingRows.map((r) => ({
      key: r.id.toString(),          // good for partitioning
      value: r.zapRunId,
    }));

    try {
      const result = await producer.send({
        topic: TOPIC_NAME,
        messages,
      });

      // Log when tasks are actually acknowledged by Kafka
      result.forEach(r =>
        console.log(
          `Sent ${messages.length} messages to topic ${r.topicName}, partition ${r.partition}, baseOffset ${r.baseOffset}`
        )
      );

      await prisma.zapRunOutbox.deleteMany({
        where: {
            id: {
                in: pendingRows.map((r) => r.id)
            }
        }
      });
    } catch (err) {
      console.error("Kafka send failed", err);
    }
  }
}

main().catch(console.error);
