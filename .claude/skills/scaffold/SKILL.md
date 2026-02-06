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
src/pages/[domain]/
├── features/              # Feature folders (see Feature Folder Structure)
├── registry/              # [domain].types.ts (Zod), [domain].constants.ts
├── model/                 # Shared hooks (used by multiple features)
└── [domain].page.tsx      # Pure composition, default export
```

## Feature Folder Structure

Each feature follows this pattern:

```
[feature-name]/
├── [domain].[feature-name].tsx   # Pure UI component
├── model/                        # Hooks (FLAT, no nesting)
│   ├── use-[feature].ts          # Main hook (orchestrates logic)
│   └── use-[action].ts           # Individual API hooks
└── ui/                           # UI components (FLAT, no nesting)
    └── [component].tsx           # Extracted UI pieces
```

**Critical Rules:**

- **One component per file** — every component gets its own `.tsx` file, no exceptions
- **No complex logic in components** — if a component has state, effects, or callbacks beyond simple event handlers, extract into a hook in `model/`. Components should only call hooks and render JSX.
- `model/` and `ui/` folders are FLAT - no nested subfolders
- Main component file: `[domain].[feature-name].tsx` (e.g., `jobs.add-modal.tsx`)
- One hook per file in `model/`

## When to Use ui/ Folder

Extract into `ui/` when:

- Component has distinct, reusable UI sections
- Main component file exceeds ~150 lines
- UI pieces are logically separate (forms, cards, list items)

**Example - Column Manager Modal:**

```
column-manager-modal/
├── jobs.column-manager-modal.tsx   # Main modal (composition)
├── model/
│   └── use-column-manager-modal.ts # Form state, handlers, inlined mutations
└── ui/
    ├── add-column-form.tsx         # Form for new column
    ├── column-item.tsx             # Single column row
    └── system-columns-info.tsx     # Info section
```

Note: Simple mutations are inlined in the main hook, not separate files.

## Self-Contained Features

Features should fetch their own data. Pass only what the parent controls.

**Wrong - too many props:**

```tsx
// Parent fetches everything, passes down
<JobsTable
  jobs={jobs}
  columns={columns}
  stages={stages}
  isLoading={isLoading}
  onUpdate={handleUpdate}
  ... // 10+ props
/>
```

**Correct - minimal props:**

```tsx
// Feature fetches its own data
<JobsTable filters={filters} />
```

**The main hook fetches everything:**

```tsx
export const useJobsTable = ({ filters }: Props) => {
  const { data: columns } = useJobColumns();
  const { data: stages } = useJobStages();
  const { jobs, isLoading } = useJobsList(filters);
  // ... all logic here

  return { jobs, columns, stages, isLoading, handlers... };
};
```

## When to Extract Standalone Feature

Extract into its own feature folder when a component:

- Has its own hooks (uses API hooks directly)
- Contains significant logic beyond pure rendering
- Could be reused or tested independently

**Before (UI component with logic):**

```
table-view/
└── ui/
    └── jobs-table.tsx  # Has useQuickUpdateJob, useDeleteJob, handlers
```

**After (standalone feature):**

```
jobs-table/
├── jobs.jobs-table.tsx
├── model/
│   ├── use-jobs-table.ts      # Main hook with all logic + simple mutations
│   ├── use-jobs.ts            # Fetch jobs (query hook)
│   └── use-quick-update-job.ts  # Complex mutation (has optimistic updates)
└── ui/
    └── ... cell components
```

Note: Only complex mutations (optimistic updates, debouncing) get separate files.

## Hook Organization Rules

### Simple mutations → inline in main hook

Simple mutations (only `onSuccess` for cache invalidation) go directly in the feature's main hook:

```tsx
// In use-add-modal.ts - mutations are inlined
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

const createJob = $api.useMutation('post', '/api/jobs', {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
});
```

### Complex mutations → `[feature]/model/`

Only create separate files for complex hooks (optimistic updates, debouncing):

```
features/
├── jobs-table/model/use-quick-update-job.ts  # Has optimistic updates
└── detail-modal/model/use-update-job.ts      # Has optimistic updates
```

### Shared hooks → `pages/[domain]/model/`

Hooks used by multiple features go in the outer model folder:

```
pages/jobs/model/
├── use-job-stages.ts      # Query - used by 6 features
├── use-job-columns.ts     # Query - used by 2 features
└── use-delete-job.ts      # Mutation - used by 2 features
```

### One exported hook per file

Each exported hook gets its own file. Simple mutations inlined in main hooks don't count.

## Component Pattern

**UI Component** - Pure rendering, no logic:

```tsx
export const JobsAddModal = ({ open, onOpenChange }: JobsAddModalProps) => {
  const { formData, errors, handleSubmit } = useAddModal({ onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Render UI using hook values */}
    </Dialog>
  );
};
```

**Main Hook** - Orchestrates feature logic:

```tsx
export const useAddModal = ({ onOpenChange }: Props) => {
  const { data: stages = [] } = useJobStages();
  const createJob = useCreateJob();
  const [formData, setFormData] = useState({...});

  const handleSubmit = (e: React.FormEvent) => {
    createJob.mutate(
      {
        body: {
          id: crypto.randomUUID(),  // Generate ID at call site
          ...formData,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return { formData, stages, isPending: createJob.isPending, handleSubmit };
};
```

## Naming Conventions

| Element           | Convention             | Example                          |
| ----------------- | ---------------------- | -------------------------------- |
| Files/folders     | kebab-case             | `add-modal/`, `use-add-modal.ts` |
| Components        | PascalCase             | `JobsAddModal`                   |
| Hooks             | use + camelCase        | `useAddModal`                    |
| Main hook         | use-[feature]          | `use-add-modal.ts`               |
| Complex mutations | use-[action]           | `use-quick-update-job.ts`        |
| Main file         | [domain].[feature].tsx | `jobs.add-modal.tsx`             |
| Imports           | Absolute `@/`          | `@/pages/jobs/features/...`      |

## Before Creating Components

Check for existing shadcn components using context7 MCP before creating new UI elements.

## After Creating a Page

Add route in `src/app/routes/`:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import ExamplePage from '@/pages/example/example.page';

export const Route = createFileRoute('/_authenticated/example')({
  component: ExamplePage,
});
```

## Quick Reference

| Question                 | Answer                                                                       |
| ------------------------ | ---------------------------------------------------------------------------- |
| Where does this hook go? | One feature uses it → `[feature]/model/`. Multiple → `pages/[domain]/model/` |
| Simple mutation?         | Inline in main hook. No separate file.                                       |
| Complex mutation?        | Separate file (has optimistic updates or debouncing).                        |
| Logic in component?      | No. Move to main hook (`use-[feature].ts`).                                  |
| Props drilling?          | No. Features fetch their own data via hooks.                                 |
| Nested folders in ui/?   | No. Keep `model/` and `ui/` flat.                                            |
| When to extract to ui/?  | When main component > 150 lines or has distinct UI sections.                 |
| When is it a feature?    | When it has its own hooks and logic, not just rendering.                     |

## Related Skills

This skill covers **structure** (where to put files). For implementation patterns:

| Need                | Skill         | When to Use                                                   |
| ------------------- | ------------- | ------------------------------------------------------------- |
| Hook implementation | `/data-hooks` | Writing hooks - queries, mutations, state management, caching |
| Modal creation      | `/modals`     | Creating dialogs, sheets, or any centralized modal            |

**Typical workflow for a new feature:**

1. Use `/scaffold` to create the folder structure
2. Use `/data-hooks` to implement the hooks in `model/`
3. If feature includes a modal, use `/modals` for the modal component
