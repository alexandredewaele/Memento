import { AuthUser, EntryCategory, JournalEntry } from './types';

// @ts-ignore - Ignore type error if vite/client types aren't loaded
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function getToken(): string | null {
  return localStorage.getItem('memento_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(email: string, username: string, password: string): Promise<AuthUser> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  });
}

export async function login(email: string, password: string): Promise<string> {
  // OAuth2 form encoding
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Login failed');
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function getMe(): Promise<AuthUser> {
  return request('/api/auth/me');
}

// ── Entries ───────────────────────────────────────────────────────────────────

export interface GetEntriesParams {
  category?: EntryCategory;
  search?: string;
  is_favorite?: boolean;
  skip?: number;
  limit?: number;
}

export interface EntryListResponse {
  entries: JournalEntry[];
  total: number;
  skip: number;
  limit: number;
}

export async function getEntries(params: GetEntriesParams = {}): Promise<EntryListResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.is_favorite !== undefined) qs.set('is_favorite', String(params.is_favorite));
  if (params.skip !== undefined) qs.set('skip', String(params.skip));
  if (params.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs}` : '';
  return request(`/api/entries${query}`);
}

export interface EntryPayload {
  title: string;
  content: string;
  category: EntryCategory;
  phonetic?: string;
  example?: string;
  is_favorite?: boolean;
}

export async function createEntry(payload: EntryPayload): Promise<JournalEntry> {
  return request('/api/entries', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateEntry(id: string, payload: Partial<EntryPayload>): Promise<JournalEntry> {
  return request(`/api/entries/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteEntry(id: string): Promise<void> {
  return request(`/api/entries/${id}`, { method: 'DELETE' });
}

export async function toggleFavorite(id: string): Promise<JournalEntry> {
  return request(`/api/entries/${id}/favorite`, { method: 'PATCH' });
}
