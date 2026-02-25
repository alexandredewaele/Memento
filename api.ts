export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://memento-backend-production.up.railway.app'

export function getToken(): string | null {
  return localStorage.getItem('memento_token')
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { detail?: string }
      detail = body.detail ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }

  // 204 No Content
  if (res.status === 204) return undefined as T
  return res.json()
}
