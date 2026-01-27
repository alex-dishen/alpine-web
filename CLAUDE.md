# Alpine Web

React frontend with TanStack Router, TanStack Query, Zustand, and shadcn/ui.

## Commands

```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Production build
npm run generate:api     # Generate API types (requires API running)
npm run test             # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
```

## Code Patterns

- **No props drilling** — Components get state directly from hooks/stores
- **No barrel files** — Import directly from source, not index.ts
- **Absolute imports only** — Use `@/` prefix, no relative imports
- **Pages are composition only** — All logic lives in `model/` hooks

## Structure

```
src/
├── app/routes/          # TanStack Router file-based routes
├── pages/[name]/        # Route pages (features/, registry/, model/)
├── features/[name]/     # Shared features (ui/, registry/, model/)
├── configs/             # API client, stores, query client
└── shared/shadcn/       # shadcn components (don't edit manually)
```

## shadcn Components

Available: button, card, input, label, separator, badge, dropdown-menu, sidebar, tooltip, sonner

Before creating new UI components, use **context7 MCP** to check shadcn/ui docs for existing components. Then add with: `npx shadcn@latest add <component>`

## API Integration

```typescript
// Public endpoints (no auth)
$publicApi.useMutation('post', '/api/auth/sign-in', { ... })

// Protected endpoints (with auth middleware)
$api.useQuery('get', '/api/users/current')
```

## State Management

- **Server state**: TanStack Query via `$api` / `$publicApi`
- **Client state**: Zustand stores in `configs/zustand/`
- **Local state**: React useState

## Testing

```bash
npm run test -- auth.store    # Run specific test
npm run test:e2e -- --grep "login"  # Run specific E2E
```
