// Centralized query keys for cache invalidation
// Format matches openapi-react-query internal key format

export const JOBS_QUERY_KEY = ['jobs'] as const;
export const USER_QUERY_KEY = ['get', '/api/users/current'] as const;
export const STAGES_QUERY_KEY = ['get', '/api/jobs/stages'] as const;
export const COLUMNS_QUERY_KEY = ['get', '/api/jobs/columns'] as const;
export const PREFERENCES_QUERY_KEY = ['get', '/api/users/current/preferences'] as const;

export const getInterviewsQueryKey = (jobId: string) => ['get', '/api/jobs/{jobId}/interviews', { params: { path: { jobId } } }] as const;
