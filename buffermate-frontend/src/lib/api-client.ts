/**
 * Centralized API Client for BufferMate
 * 
 * Handles cross-origin requests between Next.js (Vercel) and Laravel (Render),
 * automatic Bearer token injection from Supabase sessions, workspace tenant headers,
 * request timeout enforcement, and standardized error parsing.
 */

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Resolves the API Base URL based on environment configuration.
 * When NEXT_PUBLIC_API_URL is configured (production cross-origin), it uses that.
 * Otherwise, falls back to relative '/api' or the local Next.js proxy.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  // When running client-side without NEXT_PUBLIC_API_URL, use same-origin proxy
  return '';
}

/**
 * Retrieves the current Supabase session access token for API Authorization.
 */
function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // 1. Check direct localStorage auth cache if present
    const sbKey = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (sbKey) {
      const parsed = JSON.parse(localStorage.getItem(sbKey) || '{}');
      if (parsed?.access_token) return parsed.access_token;
    }

    // 2. Fallback to generic token storage
    const token = localStorage.getItem('buffermate_access_token');
    if (token) return token;
  } catch {
    // Ignore storage read errors
  }
  return null;
}

/**
 * Retrieves the active workspace ID for tenant scoping.
 */
function getActiveWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const ws = localStorage.getItem('buffermate_active_workspace_id');
    if (ws) return ws;
  } catch {
    // Ignore storage read errors
  }
  return null;
}

/**
 * Unified request executor
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { timeoutMs = 30000, params, ...customConfig } = options;

  // Format endpoint and query parameters
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Prepend base URL if not already present
  const baseUrl = getApiBaseUrl();
  let fullUrl = baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Setup default headers
  const headers = new Headers(customConfig.headers || {});
  
  if (!headers.has('Content-Type') && !(customConfig.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  // Inject Authorization header if not explicitly overridden
  if (!headers.has('Authorization')) {
    const token = getStoredAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Inject Tenant Scope Header
  if (!headers.has('X-Workspace-Id')) {
    const wsId = getActiveWorkspaceId();
    if (wsId) {
      headers.set('X-Workspace-Id', wsId);
    }
  }

  // Setup abort controller for timeout enforcement
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...customConfig,
      headers,
      signal: customConfig.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Safely parse JSON via text reader to avoid Safari syntax errors
    const rawText = await response.text();
    let data: any = {};
    if (rawText && rawText.trim()) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = rawText;
      }
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data?.message || data?.error)) ||
        `API request failed with HTTP ${response.status}: ${response.statusText}`;
      
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`, 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message || 'Network request failed', 0, error);
  }
}

// Convenience helper methods
export const api = {
  get: <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  
  put: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  
  patch: <T = any>(endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  
  delete: <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

