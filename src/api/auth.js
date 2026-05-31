import { apiRequest, unwrapValue, setToken } from './client'

export async function login(username, password) {
  const data = await apiRequest('/Auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify({ username, password }),
  })

  const result = unwrapValue(data)
  const token = result?.token

  if (!token) {
    throw new Error('توکن دریافت نشد')
  }

  setToken(token)
  return { token, username }
}

export function logout() {
  setToken(null)
}
