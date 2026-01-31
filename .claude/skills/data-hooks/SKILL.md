---
name: data-hooks
description: Guide for creating data hooks in alpine-web. Use when creating data fetching hooks, mutations, caching patterns, or any hook that manages server state. Triggers include "create hook", "add API call", "fetch data", "mutation", "useQuery", "useMutation", "infinite scroll", "pagination", or when creating new model/ hooks.
---

# Data Hooks

Use `$api` from `@/configs/api/client` for all API calls. Never use plain `fetch` with TanStack Query directly.

## Queries

```tsx
import { $api } from '@/configs/api/client';

// Basic query
export const useExample = () => {
  return $api.useQuery('get', '/api/example');
};

// Query with parameters
export const useExampleById = (id: string) => {
  return $api.useQuery(
    'get',
    '/api/example/{id}',
    {
      params: { path: { id } },
    },
    {
      enabled: !!id,
    }
  );
};

// Query with filters
export const useExamples = (filters: { search?: string; status?: string }) => {
  return $api.useQuery('get', '/api/examples', {
    params: { query: filters },
  });
};
```

## Mutations

**Simple mutations** (only `onSuccess` for cache invalidation) should be inlined directly in the feature's main hook:

```tsx
// In the feature's main hook (e.g., use-add-modal.ts)
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

export const useAddModal = ({ onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const createJob = $api.useMutation('post', '/api/jobs', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });

  // ... rest of hook logic
};
```

**Create separate hook files only when:**

- Hook has optimistic updates (`onMutate` + `onError` rollback)
- Hook has debouncing or other complex logic
- Hook is used by multiple features (shared in `pages/[domain]/model/`)

```tsx
// Separate file only for complex hooks (e.g., use-quick-update-job.ts)
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

type MutationContext = { previousJobs: unknown };

export const useQuickUpdateJob = () => {
  const queryClient = useQueryClient();

  return $api.useMutation('put', '/api/jobs/{id}', {
    onMutate: async (variables) => {
      // Optimistic update logic...
      return { previousJobs };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as MutationContext | undefined;
      if (ctx?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, ctx.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
};
```

## Infinite Queries

Use `useInfiniteQuery` from TanStack Query with `fetchClient` for paginated lists:

```tsx
import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchClient } from '@/configs/api/client';
import { getExamplesQueryKey } from '@/configs/api/query-keys';

export const useExamples = (filters: Filters) => {
  const query = useInfiniteQuery({
    queryKey: getExamplesQueryKey(filters),
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.POST('/api/examples/list', {
        body: {
          filters,
          pagination: {
            take: 50,
            cursor: pageParam ?? null,
          },
        },
      });

      if (!data) throw new Error('Failed to fetch');
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.hasNextPage ? lastPage.pagination.cursor : undefined,
    initialPageParam: null as string | null,
  });

  // Flatten pages into single array
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [query.data?.pages]
  );

  return { ...query, items };
};
```

**Scroll detection handler** (in the table/list hook):

```tsx
const handleScroll = useCallback(
  (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Fetch next page when near bottom (700px threshold)
    if (distanceFromBottom < 700 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  [hasNextPage, isFetchingNextPage, fetchNextPage]
);
```

## Query Keys

**CRITICAL: `openapi-react-query` does NOT allow custom `queryKey` in `$api.useQuery`.** The library explicitly omits it from allowed options and manages keys internally. Attempting to pass `queryKey` will cause queries to silently fail.

The library's auto-generated key format:

- `['get', '/api/path']` (no params)
- `['get', '/api/path', { params: {...} }]` (with params)

**All query keys are centralized in `@/configs/api/query-keys.ts`:**

```tsx
// configs/api/query-keys.ts
export const JOBS_QUERY_KEY = ['jobs'] as const;
export const USER_QUERY_KEY = ['get', '/api/users/current'] as const;
export const STAGES_QUERY_KEY = ['get', '/api/jobs/stages'] as const;
export const COLUMNS_QUERY_KEY = ['get', '/api/jobs/columns'] as const;

// Dynamic keys (with parameters) - factory functions
export const getJobsQueryKey = (filters: JobFilters) =>
  ['jobs', filters] as const;
export const getInterviewsQueryKey = (jobId: string) =>
  [
    'get',
    '/api/jobs/{jobId}/interviews',
    { params: { path: { jobId } } },
  ] as const;
```

### Query Key Factory Functions

For queries that vary by parameters (filters, IDs), use factory functions:

**Benefits:**

- Type-safe key generation
- Consistent structure across the codebase
- Enables partial invalidation with base key

```tsx
// Invalidate ALL job queries (any filter combination)
queryClient.invalidateQueries({ queryKey: ['jobs'] });

// Invalidate only specific filter combination
queryClient.invalidateQueries({
  queryKey: getJobsQueryKey({ stage_id: '123' }),
});
```

**Usage - always import from query-keys.ts:**

```tsx
import { STAGES_QUERY_KEY } from '@/configs/api/query-keys';

const createStage = $api.useMutation('post', '/api/jobs/stages', {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: STAGES_QUERY_KEY });
  },
});
```

## Global Configuration

Query defaults are configured in `@/configs/query-client/query-client.ts`:

- `staleTime: 10 minutes` - Do NOT add staleTime to individual queries
- `gcTime: 5 minutes`
- `retry: 1`
- `refetchOnWindowFocus: false`

## Global Error Handling

Errors are handled globally via `QueryCache` and `MutationCache` in the QueryClient config. Errors automatically display via sonner toasts (top-center). **Do NOT add `onError` handlers for toast notifications**—they're automatic.

```tsx
// Wrong - redundant error handling
$api.useMutation('post', '/api/jobs', {
  onError: (error) => toast.error(error.message), // Don't do this!
});

// Correct - errors handled globally, use centralized query key
$api.useMutation('post', '/api/jobs', {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
});
```

**Exception**: Keep `onError` for optimistic update rollbacks:

```tsx
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

type MutationContext = { previous: unknown };

$api.useMutation('put', '/api/jobs/{id}', {
  onMutate: async (variables) => {
    const previous = queryClient.getQueryData(JOBS_QUERY_KEY);
    // ... optimistic update
    return { previous };
  },
  onError: (_error, _variables, context) => {
    const ctx = context as MutationContext | undefined;
    if (ctx?.previous) {
      queryClient.setQueryData(JOBS_QUERY_KEY, ctx.previous); // Rollback only
    }
    // Toast is handled globally, don't add toast.error here
  },
});
```

## Cache-First Data Access

Read from existing cache instead of fetching when data is already loaded elsewhere (e.g., detail modal reading from list cache):

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

type JobsQueryData = {
  pages?: { data?: Job[] }[];
};

export const useDetailModal = ({ jobId }: Props) => {
  const queryClient = useQueryClient();

  // Read from all cached job queries
  const jobsData = queryClient.getQueriesData<JobsQueryData>({
    queryKey: JOBS_QUERY_KEY,
  });

  // Find the specific job across all cached pages
  const job =
    jobsData
      .flatMap(([, data]) => data?.pages ?? [])
      .flatMap((page) => page.data ?? [])
      .find((j) => j.id === jobId) ?? null;

  return { job };
};
```

**When to use:**

- Detail views that show data from a list
- Avoiding duplicate requests when data is already cached
- Quick lookups without network requests

**Note:** Cache may be stale. Consider fetching fresh data for critical operations.

## Debounced Mutations

For mutations triggered frequently (typing, dragging), debounce to reduce server load:

```tsx
import { useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '@/configs/api/client';
import { PREFERENCES_QUERY_KEY } from '@/configs/api/query-keys';

type MutationContext = { previous: unknown };

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = $api.useMutation('put', '/api/users/current/preferences', {
    // Optimistic update for instant feedback
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: PREFERENCES_QUERY_KEY });
      const previous = queryClient.getQueryData(PREFERENCES_QUERY_KEY);

      queryClient.setQueryData(PREFERENCES_QUERY_KEY, (old: unknown) => ({
        ...old,
        ...variables.body,
      }));

      return { previous };
    },
    onError: (_error, _variables, context) => {
      const ctx = context as MutationContext | undefined;
      if (ctx?.previous) {
        queryClient.setQueryData(PREFERENCES_QUERY_KEY, ctx.previous);
      }
    },
  });

  // Debounced update (500ms delay)
  const debouncedUpdate = useCallback(
    (data: UpdateDto) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        mutation.mutate({ body: data });
      }, 500);
    },
    [mutation]
  );

  return { ...mutation, debouncedUpdate };
};
```

**Use cases:**

- User preferences (column order, theme)
- Search-as-you-type
- Drag-and-drop reordering
- Inline cell editing

## ID Generation

Generate IDs at the call site (in mutation handlers), not in mutation definitions:

```tsx
import { JOBS_QUERY_KEY } from '@/configs/api/query-keys';

// In the feature's main hook
const createJob = $api.useMutation('post', '/api/jobs', {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
});

const handleSubmit = () => {
  createJob.mutate({
    body: {
      id: crypto.randomUUID(), // ID generated where data is formed
      company_name: formData.company,
      job_title: formData.title,
    },
  });
};
```

## Common Mistakes

| Wrong                                                | Correct                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `$api.useQuery(..., { staleTime: ... })`             | Use global staleTime (10min default)                                   |
| `$api.useQuery(..., { queryKey: [...] })`            | Let library manage queryKey (not allowed)                              |
| `useQuery` from `@tanstack/react-query` + `fetch`    | `$api.useQuery`                                                        |
| `useMutation` from `@tanstack/react-query` + `fetch` | `$api.useMutation`                                                     |
| `useInfiniteQuery` + plain `fetch`                   | `useInfiniteQuery` + `fetchClient`                                     |
| Manual `API_BASE_URL` constant                       | Handled by `$api`                                                      |
| Manual `credentials: 'include'`                      | Handled by `$api`                                                      |
| Manual error checking `if (!response.ok)`            | Handled by `$api`                                                      |
| `onError: () => toast.error(...)`                    | Remove—errors handled globally                                         |
| `if (error) throw...` with fetchClient               | `if (!data) throw...` (error is typed as `never`)                      |
| Generate ID in hook                                  | Generate ID at call site: `{ body: { id: crypto.randomUUID(), ... } }` |
| Separate file for simple mutation                    | Inline in feature's main hook                                          |
| Inline query keys `['jobs']`                         | Import from `@/configs/api/query-keys`                                 |

## When Endpoint Missing from Types

If an endpoint exists in API but not in generated types, regenerate types:

```bash
cd alpine-web && npm run generate:api
```

This requires the API server to be running at `http://localhost:3001`.

## Using fetchClient Directly

For mutations needing custom logic or when `$api.useMutation` doesn't fit:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClient } from '@/configs/api/client';
import { ITEMS_QUERY_KEY } from '@/configs/api/query-keys';

export const useReorderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { data } = await fetchClient.PUT('/api/items/reorder', {
        body: { item_ids: ids },
      });
      // Check !data, not error (openapi-fetch types error as 'never')
      if (!data) {
        throw new Error('Failed to reorder items');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
};
```

**Important**: Use `if (!data)` instead of `if (error)` because openapi-fetch types `error` as `never` when error responses aren't defined in the OpenAPI spec.

Always prefer `$api` methods when possible for better type inference.
