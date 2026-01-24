import createClient from 'openapi-fetch';
// import type { Middleware } from 'openapi-fetch';
// import type { paths } from './types/api.generated';

// =============================================================================
// Middleware Examples (uncomment and adapt as needed)
// =============================================================================
//
// import type { Middleware } from 'openapi-fetch';
//
// /**
//  * Auth middleware - adds Authorization header to all requests
//  * Use this when you have JWT/Bearer token authentication
//  */
// const authMiddleware: Middleware = {
//   async onRequest({ request }) {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       request.headers.set('Authorization', `Bearer ${token}`);
//     }
//     return request;
//   },
// };
//
// /**
//  * Error handling middleware - handles common HTTP errors globally
//  * Useful for 401 redirects, error logging, etc.
//  */
// const errorMiddleware: Middleware = {
//   async onResponse({ response }) {
//     if (response.status === 401) {
//       // Token expired or invalid - redirect to login
//       localStorage.removeItem('auth_token');
//       window.location.href = '/login';
//     }
//
//     if (!response.ok) {
//       // Log errors in development
//       if (import.meta.env.DEV) {
//         console.error(`API Error: ${response.status} ${response.url}`);
//       }
//     }
//
//     return response;
//   },
// };
//
// /**
//  * Logging middleware - logs all requests/responses in development
//  */
// const loggingMiddleware: Middleware = {
//   async onRequest({ request }) {
//     if (import.meta.env.DEV) {
//       console.log(`[API] ${request.method} ${request.url}`);
//     }
//     return request;
//   },
//   async onResponse({ response }) {
//     if (import.meta.env.DEV) {
//       console.log(`[API] ${response.status} ${response.url}`);
//     }
//     return response;
//   },
// };

// =============================================================================
// API Client
// =============================================================================

// TODO: Uncomment when OpenAPI spec is available
// export const apiClient = createClient<paths>({
//   baseUrl: import.meta.env.VITE_API_BASE_URL,
// });

// Placeholder client until API spec is generated
export const apiClient = createClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
});

// =============================================================================
// Register Middleware (uncomment as needed)
// =============================================================================
// apiClient.use(authMiddleware);
// apiClient.use(errorMiddleware);
// apiClient.use(loggingMiddleware);
