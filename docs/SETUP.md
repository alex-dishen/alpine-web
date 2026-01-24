# Alpine Web Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

| Script                   | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run dev`            | Start development server             |
| `npm run build`          | Build for production                 |
| `npm run preview`        | Preview production build             |
| `npm run lint`           | Run ESLint                           |
| `npm run lint:fix`       | Fix ESLint issues                    |
| `npm run format`         | Format code with Prettier            |
| `npm run format:check`   | Check formatting                     |
| `npm run tsc`            | TypeScript type check                |
| `npm run test`           | Run tests                            |
| `npm run test:watch`     | Run tests in watch mode              |
| `npm run test:ui`        | Open Vitest UI                       |
| `npm run check:circular` | Check for circular dependencies      |
| `npm run generate:api`   | Generate API types from OpenAPI spec |

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Development Workflow

1. Create a feature branch from `main`
2. Make changes following the architecture patterns
3. Run tests and linting locally
4. Commit (pre-commit hooks will run automatically)
5. Create a pull request

## Pre-commit Hooks

The following checks run on every commit:

1. **lint-staged**: Formats and lints staged files
2. **TypeScript**: Type checks the entire codebase
3. **Vitest**: Runs tests on changed files
4. **Madge**: Checks for circular dependencies

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Components are added to `src/components/ui/`.

## Generating API Types

1. Place your OpenAPI spec at `./openapi.yaml`
2. Run `npm run generate:api`
3. Types will be generated to `src/shared/api/types/api.generated.ts`
