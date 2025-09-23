# Flowrge Database Package

The shared database package providing Prisma ORM integration and database schema management for the Flowrge platform.

## Features

- **Database Schema**: Complete Prisma schema for all Flowrge entities
- **Prisma Integration**: Generated Prisma client for type-safe database operations
- **Data Models**: User accounts, flow definitions, execution tracking

## Tech Stack

- Prisma ORM
- PostgreSQL
- TypeScript

## Getting Started

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flowrge
```