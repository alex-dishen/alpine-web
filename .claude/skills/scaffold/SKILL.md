---
name: scaffold
description: Create new pages or shared features in alpine-web. Use when user says "create a page", "create a feature", "scaffold", "add a new page", "add a new feature", or "new component".
---

# Scaffold

Determine type from context or ask:

- **Page**: Route-specific → `src/pages/`
- **Feature**: Shared module → `src/features/`

## Page Structure

```
src/pages/[domain]/[name]/
├── features/              # [name].header.tsx, [name].form.tsx, etc.
├── registry/              # [name].types.ts (Zod), [name].constants.ts
├── model/                 # use-[action].ts hooks
└── [name].page.tsx        # Pure composition, default export
```

Reference: `src/pages/auth/sign-up/`

## Feature Structure

```
src/features/[name]/
├── ui/                    # [name]-item.tsx, [name]-list.tsx, etc.
├── registry/              # [name].types.ts, [name].constants.ts
├── model/                 # use-[action].ts hooks
└── [name].tsx             # Pure composition, named export
```

Reference: `src/features/sidebar/`

## Before Creating Components

Always check for existing shadcn components before creating new UI elements. Use context7 MCP to search for available components in `src/shared/shadcn/components/`.

## Patterns

**Main component** - Pure composition, no logic:

```tsx
import { FeatureHeader } from '@/pages/example/features/example.header';
import { FeatureForm } from '@/pages/example/features/example.form';

const ExamplePage = () => (
  <div>
    <FeatureHeader />
    <FeatureForm />
  </div>
);

export default ExamplePage; // Pages use default export
```

**Hook** - Business logic with TanStack Query + Zustand:

```tsx
import { $api } from '@/configs/api/client';
import { useAuthStore } from '@/configs/zustand/auth/auth.store';

export const useExample = () => {
  const mutation = $api.useMutation('post', '/api/endpoint');
  return { isPending: mutation.isPending, submit: mutation.mutate };
};
```

**Types** - Zod schemas:

```tsx
import { z } from 'zod';

export const exampleSchema = z.object({
  name: z.string().min(1, 'Required'),
});

export type ExampleData = z.infer<typeof exampleSchema>;
```

## Conventions

| Element       | Convention      | Example              |
| ------------- | --------------- | -------------------- |
| Files/folders | kebab-case      | `user-profile.tsx`   |
| Components    | PascalCase      | `UserProfile`        |
| Hooks         | use + camelCase | `useUserProfile`     |
| Imports       | Absolute `@/`   | `@/features/sidebar` |

No barrel files. No props drilling - components get state from stores.

## After Creating a Page

Add route in `src/app/routes/`:

```tsx
// _authenticated/[name].tsx (protected) or public at root level
import { createFileRoute } from '@tanstack/react-router';
import ExamplePage from '@/pages/example/example.page';

export const Route = createFileRoute('/_authenticated/example')({
  component: ExamplePage,
});
```
