# Flowrge Backend API

The core backend service for Flowrge, providing RESTful APIs for flow management, user authentication, and system operations.

## Features

- **Authentication**: JWT-based user authentication
- **Flow Management**: Create, read, update, and delete flows
- **Integration APIs**: Available triggers and actions discovery

## Tech Stack

- Bun runtime
- Express.js
- PostgreSQL with Prisma ORM
- JWT authentication
- Zod validation

## Getting Started

```bash
bun install
bun run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flowrge
JWT_SECRET=your-jwt-secret-key
```