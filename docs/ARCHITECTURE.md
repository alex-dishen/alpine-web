# Alpine Web Architecture

## Folder Structure

```
alpine-web/
├── .husky/              # Git hooks
├── docs/                # Documentation
├── src/
│   ├── app/             # Application shell
│   │   ├── providers/   # React context providers composition
│   │   └── routes/      # TanStack Router file-based routes
│   ├── pages/           # Page components (one per route)
│   ├── features/        # Feature modules (domain-specific business logic)
│   ├── components/      # Shared UI components
│   │   ├── ui/          # shadcn/ui primitives
│   │   ├── layout/      # Layout components (sidebar, header, etc.)
│   │   └── common/      # Common reusable components
│   ├── shared/          # Shared utilities (pure functions, no side effects)
│   │   ├── hooks/       # Shared custom hooks (including shadcn hooks)
│   │   ├── lib/         # Utility functions (including shadcn utils)
│   │   ├── types/       # Shared TypeScript types
│   │   ├── constants/   # Application constants
│   │   └── schemas/     # Zod validation schemas
│   ├── configs/         # Application-level infrastructure configurations
│   │   ├── api/         # API client, query client, generated types
│   │   └── theme/       # Theme store and provider
│   └── test/            # Test utilities and setup
```

## Folder Responsibilities

### `configs/` - Application Infrastructure

The `configs/` folder contains **application-level infrastructure and global configurations**. These are singletons and services that the entire application depends on.

**What belongs in `configs/`:**

- API client configuration (base URL, interceptors/middleware)
- Theme configuration (store, provider, colors)
- Internationalization (i18n) setup
- Global state stores (app-wide singletons)
- WebSocket configuration
- Storage service configuration
- Environment variables helpers

**Examples:**

```
configs/
├── api/
│   ├── client.ts           # OpenAPI fetch client with middleware
│   ├── query-client.ts     # TanStack Query client wrapper
│   └── types/
│       └── api.generated.ts
└── theme/
    ├── theme.store.ts      # Zustand store for theme state
    └── theme-provider.tsx  # React provider that applies theme
```

### `features/` - Business Domain Logic

The `features/` folder contains **domain-specific business logic** - the actual features that users interact with.

**What belongs in `features/`:**

- Job tracking feature (job CRUD, filters, search)
- Resume builder feature
- Authentication feature (login, logout, session)
- User profile feature
- Any feature that represents a business domain

**Structure:**

```
features/
└── jobs/
    ├── api/         # API hooks (useJobs, useCreateJob, etc.)
    ├── model/       # Business logic, local stores if needed
    └── ui/          # Feature-specific components
```

### `shared/` - Pure Utilities

The `shared/` folder contains **pure utilities with no side effects** - helper functions, types, and hooks that don't depend on application state.

**What belongs in `shared/`:**

- Utility functions (`cn()`, `formatDate()`, etc.)
- Shared TypeScript types and interfaces
- Zod validation schemas
- Generic custom hooks (not app-specific)
- Constants and enums

**What does NOT belong in `shared/`:**

- API clients (use `configs/api/`)
- Global stores (use `configs/`)
- Feature-specific code (use `features/`)

## Architecture Patterns

### Feature-Sliced Design (Adapted)

Each feature module follows a consistent structure:

```
features/
└── feature-name/
    ├── api/         # API hooks using TanStack Query + openapi-react-query
    ├── model/       # Business logic and feature-specific stores
    └── ui/          # React components specific to this feature
```

### State Management

- **Server State**: TanStack Query handles all data fetching, caching, and mutations
- **Client State**: Zustand for global UI state (theme, sidebar, modals) in `configs/`
- **Local State**: React's useState/useReducer for component-level state

### API Integration

We use the OpenAPI stack for type-safe API calls:

1. `openapi-typescript` generates types from OpenAPI spec
2. `openapi-fetch` provides a type-safe fetch client
3. `openapi-react-query` creates TanStack Query hooks

API hooks live in feature folders:

```typescript
// features/jobs/api/use-jobs.ts
import { $api } from '@configs/api/query-client';

export function useJobs() {
  return $api.useQuery('get', '/api/jobs');
}
```

### Routing

TanStack Router with file-based routing:

- Routes are defined in `src/app/routes/`
- Route tree is auto-generated to `src/app/routeTree.gen.ts`
- Each route file exports a `Route` object

## Path Aliases

| Alias          | Path                |
| -------------- | ------------------- |
| `@/`           | `./src/`            |
| `@app/`        | `./src/app/`        |
| `@pages/`      | `./src/pages/`      |
| `@features/`   | `./src/features/`   |
| `@components/` | `./src/components/` |
| `@shared/`     | `./src/shared/`     |
| `@configs/`    | `./src/configs/`    |

## Code Conventions

### No Barrel Files

**Do not create barrel files (`index.ts` files that only re-export from other files).**

Barrel files cause issues with:

- Tree-shaking and bundle size
- Circular dependencies
- IDE auto-import confusion
- Slower TypeScript compilation

Instead, import directly from the source file:

```typescript
// Good - direct import
import { useThemeStore } from '@configs/theme/theme.store';
import { HomePage } from '@pages/home/home';

// Bad - barrel file import
import { useThemeStore } from '@configs/theme';
import { HomePage } from '@pages/home';
```

### Imports

- Use path aliases for cross-module imports
- Use relative imports within the same module
- Type imports use `import type { ... }`
- Always import directly from source files, not barrel files

### Components

- Use function declarations for components
- Co-locate tests with components

### Naming

- Files: kebab-case (`theme-toggle.tsx`)
- Components: PascalCase (`ThemeToggle`)
- Hooks: camelCase with `use` prefix (`useThemeStore`)
- Types: PascalCase (`Theme`, `ThemeState`)
