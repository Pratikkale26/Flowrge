# Flowrge Processor

The outbox processor service that bridges database operations with the message queue system for reliable flow execution.

## Features

- **Outbox Pattern**: Polls database for pending flow executions
- **Message Publishing**: Publishes messages to Kafka for reliable delivery
- **Continuous Processing**: Background polling with configurable intervals

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