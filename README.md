# Alpine Web

Welcome to the Alpine web application repository. This is a React project built with TypeScript and Vite, providing a comprehensive job search assistance tool with job tracking, resume builder, knowledge base, and analytics.

## Documentation

This repository contains comprehensive documentation to help you understand and work with the project:

- **[Architecture](docs/ARCHITECTURE.md)** - Detailed explanation of the application architecture, folder structure, and patterns based on Feature-Sliced Design methodology
- **[Setup Guide](docs/SETUP.md)** - Step-by-step installation and development environment setup instructions
- **[Contributing](docs/CONTRIBUTING.md)** - Code standards, git workflow, and pull request guidelines

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run tsc

# Run tests
npm run test

# Build for production
npm run build
```

## Tech Stack

| Category      | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | React 18 + TypeScript                |
| Build Tool    | Vite                                 |
| Routing       | TanStack Router (file-based)         |
| Server State  | TanStack Query + openapi-react-query |
| Client State  | Zustand                              |
| Validation    | Zod                                  |
| UI Components | shadcn/ui                            |
| Styling       | Tailwind CSS                         |
| Testing       | Vitest + React Testing Library       |
| Linting       | ESLint + Prettier                    |
| Git Hooks     | Husky + lint-staged                  |
