# Flowrge UI Package

A shared UI component library built with Radix UI and Tailwind CSS for consistent design across the Flowrge platform.

## Features

- **Component Library**: Button variants, cards, code display components
- **Design System**: Consistent styling and behavior
- **TypeScript Support**: Full type safety with IntelliSense

## Tech Stack

- React 19
- Radix UI primitives
- Tailwind CSS
- TypeScript

## Getting Started

```bash
npm install
npm run build
```

## Usage

```typescript
import { Button, Card, Code } from '@repo/ui'

<Card>
  <Button variant="primary">Click me</Button>
  <Code language="typescript">console.log('Hello')</Code>
</Card>
```