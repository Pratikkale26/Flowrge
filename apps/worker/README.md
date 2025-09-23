# Flowrge Worker

The distributed worker service that executes flow actions asynchronously using Kafka message queues.

## Features

- **Asynchronous Processing**: Consumes flow execution messages from Kafka
- **Multi-Step Flow Execution**: Executes actions in sequence
- **Action Execution**: Email and Solana actions

## Tech Stack

- Bun runtime
- Kafka with kafkajs client
- PostgreSQL with Prisma ORM

## Getting Started

```bash
bun install
bun run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flowrge
KAFKA_BROKERS=localhost:9092
```