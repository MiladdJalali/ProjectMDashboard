import { apiRequest, unwrapValue, unwrapUserList } from './client'

export async function fetchUsers(params = {}) {
  const query = new URLSearchParams()

  if (params.pageIndex != null) query.set('PageIndex', String(params.pageIndex))
  if (params.pageSize != null) query.set('PageSize', String(params.pageSize))
  if (params.username) query.set('Username', params.username)
  if (params.id) query.set('Id', params.id)

  const qs = query.toString()
  const path = qs ? `/Users?${qs}` : '/Users'

  const data = await apiRequest(path)
  return {
    users: unwrapUserList(data),
    totalCount: data?.totalCount ?? unwrapUserList(data).length,
  }
}

export async function fetchUser(username) {
  const data = await apiRequest(`/Users/${encodeURIComponent(username)}`)
  return unwrapValue(data)
}

export async function createUser(payload) {
  const data = await apiRequest('/Users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return unwrapValue(data)
}

export async function updateUser(username, payload) {
  await apiRequest(`/Users/${encodeURIComponent(username)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(username) {
  await apiRequest(`/Users/${encodeURIComponent(username)}`, {
    method: 'DELETE',
  })
}

export function toUserRequest(form, { requirePassword = true } = {}) {
  const payload = {
    username: form.username.trim(),
    address: form.address?.trim() || null,
    description: form.description?.trim() || null,
  }

  if (requirePassword || form.password) {
    payload.password = form.password
    payload.confirmPassword = form.confirmPassword
  }

  return payload
}
