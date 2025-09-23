# Flowrge Hooks Service

A lightweight webhook service that receives external triggers and initiates flow executions.

## Features

- **Webhook Endpoints**: RESTful webhook endpoints for external services
- **Flow Initiation**: Converts webhook payloads into flow execution requests
- **Secure Processing**: User and flow validation

## Tech Stack

- Bun runtime
- Express.js
- PostgreSQL with Prisma ORM

## Getting Started

```bash
bun install
bun run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flowrge
```

## API Endpoints

- `POST /hooks/catch/:userId/:zapId` - Receive webhook and trigger flow