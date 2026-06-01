import { request } from './client'

export type AuthUser = {
  id?: string
  email?: string
  phoneNumber?: string
}

export type AuthSession = {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export async function login(email: string, password: string) {
  return request<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(email: string, password: string, phoneNumber: string) {
  return request<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, phoneNumber }),
  })
}

export async function getCurrentUser(accessToken: string) {
  const data = await request<{ user: AuthUser }>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return data.user
}
