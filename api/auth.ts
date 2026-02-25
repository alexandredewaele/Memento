import { AuthUser } from '../types'
import { request, BASE_URL } from '../api'

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthUser> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  })
}

export async function login(email: string, password: string): Promise<string> {
  // OAuth2 form encoding
  const body = new URLSearchParams({ username: email, password })
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string }
    throw new Error(err.detail ?? 'Login failed')
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export async function getMe(): Promise<AuthUser> {
  return request('/api/auth/me')
}
