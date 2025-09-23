# Flowrge Indexer

The blockchain indexing service for monitoring Solana on-chain events and triggering flows based on blockchain activity.

## Features

- **Blockchain Monitoring**: Real-time monitoring of Solana blockchain events
- **Event Processing**: Parse and validate blockchain transactions
- **Flow Integration**: Automatic flow triggering based on on-chain events

## Tech Stack

- Bun runtime
- Solana RPC integration
- PostgreSQL with Prisma ORM

## Getting Started

```bash
bun install
bun run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://username:password@localhost:5432/flowrge
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
HOOKS_SERVICE_URL=http://localhost:3002
```