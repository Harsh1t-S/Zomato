// Central place for the API base URL so it's not copy-pasted across
// every page. Override with VITE_API_URL in a .env file for local dev
// against a local backend.
export const API_URL =
  (import.meta as any).env?.VITE_API_URL || 'https://zomato-production-1f03.up.railway.app';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('zomato_auth');
    if (!raw) return null;
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

/**
 * fetch wrapper that automatically attaches the JWT (if present) and the
 * API base URL. Pass a path like '/api/orders/all', not a full URL.
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  return response;
}

/**
 * Same as apiFetch but throws with the server's error message on non-2xx
 * responses and returns parsed JSON on success. Convenient for most calls.
 */
export async function apiJson<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data as T;
}
