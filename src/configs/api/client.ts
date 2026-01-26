import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { Middleware } from 'openapi-fetch';
import type { paths } from '@/configs/api/types/api.generated';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
};

const authMiddleware: Middleware = {
  async onResponse({ response, request }) {
    if (response.status === 401 && !request.url.includes('/auth/')) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const success = await refreshPromise;

      if (success) {
        return fetch(request, { credentials: 'include' });
      }
    }

    return response;
  },
};

export const publicFetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

export const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
});

fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);
export const $publicApi = createClient(publicFetchClient);
