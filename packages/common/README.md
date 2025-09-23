# Flowrge Common Package

Shared utilities, types, and constants used across all Flowrge services.

## Features

- **Validation Schemas**: Zod schemas for API request/response validation
- **Shared Constants**: Kafka topic names and API endpoint definitions
- **Utility Functions**: Shared helper functions and data transformation utilities

## Tech Stack

- TypeScript
- Zod validation

## Getting Started

```bash
npm install
npm run build
```

## Usage

```typescript
import { SignupSchema, ZapCreateSchema, TOPIC_NAME } from 'common/common'

// Validate data
const result = SignupSchema.safeParse(userData)

// Use constants
await producer.send({ topic: TOPIC_NAME, messages: [...] })
```