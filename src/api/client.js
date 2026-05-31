const API_VERSION = '1'
export const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? ''

export function apiUrl(path) {
  return `${API_ROOT}/rest/api/v${API_VERSION}${path}`
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getToken() {
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function clearToken() {
  localStorage.removeItem('auth_token')
}

export function isAuthenticated() {
  return !!getToken()
}

async function parseError(response) {
  try {
    const data = await response.json()
    return data.detail || data.title || data.message || response.statusText
  } catch {
    return response.statusText || 'خطای ناشناخته'
  }
}

export async function apiRequest(path, options = {}) {
  const { auth = true, ...fetchOptions } = options
  const headers = {
    Accept: 'application/json',
    ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
    ...fetchOptions.headers,
  }

  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(apiUrl(path), {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const message = await parseError(response)
    if (response.status === 401 && auth) {
      clearToken()
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return null
}

export function unwrapValue(data) {
  return data?.values ?? data
}

export function unwrapUserList(data) {
  const values = data?.values
  if (!values) return []
  if (Array.isArray(values) && Array.isArray(values[0])) {
    return values.flat()
  }
  return Array.isArray(values) ? values : []
}
