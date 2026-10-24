/**
 * Ateevibes Storefront API Client
 * Interfaces with the Ateevibes Backend (NestJS / PostgreSQL)
 * Handles silent token refresh with a single shared in-flight promise and falls back offline if unreachable.
 */

import { API_ROUTES } from "../config/contract";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const AUTH_TOKEN_KEY = "atv:v1:auth_token";
const REFRESH_TOKEN_KEY = "atv:v1:refresh_token";

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return false;
    }

    try {
      const url = `${API_BASE_URL}${API_ROUTES.auth.refresh}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return false;
      }

      const data = await res.json();
      if (data && data.accessToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        return true;
      }

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return false;
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const rawAuth = localStorage.getItem(AUTH_TOKEN_KEY);
    if (rawAuth) {
      headers["Authorization"] = `Bearer ${rawAuth}`;
    }
  } catch {
    // ignore
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const isExcludedFromRefresh =
      endpoint === API_ROUTES.auth.refresh ||
      endpoint.endsWith(API_ROUTES.auth.refresh) ||
      endpoint === API_ROUTES.auth.customerLogin ||
      endpoint.endsWith(API_ROUTES.auth.customerLogin) ||
      endpoint === API_ROUTES.auth.customerSignup ||
      endpoint.endsWith(API_ROUTES.auth.customerSignup);

    if (response.status === 401 && !isRetry && !isExcludedFromRefresh) {
      const refreshed = await attemptTokenRefresh();
      if (refreshed) {
        return apiRequest<T>(endpoint, options, true);
      }
    }

    if (!response.ok) {
      let errBody: any;
      try {
        errBody = await response.json();
      } catch {
        errBody = { message: response.statusText };
      }
      throw new ApiError(response.status, errBody.message || "API request failed", errBody);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, error.message || "Network error or backend offline");
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => apiRequest<T>(endpoint, { method: "GET", ...options }),
  post: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T = any>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
