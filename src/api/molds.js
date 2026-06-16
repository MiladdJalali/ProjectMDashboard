import { apiRequest, unwrapValue } from './client'

function appendIfPresent(query, key, value) {
  if (value === null || value === undefined || value === '') return
  query.set(key, String(value))
}

export function unwrapMoldList(data) {
  const values = data?.values
  if (!values) return []
  if (Array.isArray(values) && Array.isArray(values[0])) {
    return values.flat()
  }
  return Array.isArray(values) ? values : []
}

export async function fetchMolds(params = {}) {
  const query = new URLSearchParams()

  appendIfPresent(query, 'PageIndex', params.pageIndex)
  appendIfPresent(query, 'PageSize', params.pageSize)
  appendIfPresent(query, 'Id', params.id)
  appendIfPresent(query, 'Name', params.name)
  appendIfPresent(query, 'Status', params.status)
  appendIfPresent(query, 'Location', params.location)
  appendIfPresent(query, 'Code', params.code)
  appendIfPresent(query, 'PartNumber', params.partNumber)
  appendIfPresent(query, 'IsActive', params.isActive)

  const qs = query.toString()
  const path = qs ? `/Molds?${qs}` : '/Molds'

  const data = await apiRequest(path)
  const molds = unwrapMoldList(data)
  return {
    molds,
    totalCount: data?.totalCount ?? molds.length,
  }
}

export async function createMold(payload) {
  const data = await apiRequest('/Molds', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return unwrapValue(data)
}

export async function fetchMold(id) {
  const data = await apiRequest(`/Molds/${encodeURIComponent(id)}`)
  return unwrapValue(data)
}

export async function updateMold(id, payload) {
  await apiRequest(`/Molds/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteMold(id) {
  await apiRequest(`/Molds/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

function toLocationValue(value) {
  if (value === 'Warehouse') return 0
  if (value === 'Production') return 1

  const numberValue = Number(value ?? 0)
  return Number.isNaN(numberValue) ? 0 : numberValue
}

export function toMoldRequest(form) {
  return {
    name: form.name.trim(),
    code: Number(form.code),
    description: form.description?.trim() || null,
    shotCount: Number(form.shotCount || 0),
    maxShotsBeforeMaintenance:
      form.maxShotsBeforeMaintenance === '' || form.maxShotsBeforeMaintenance == null
        ? null
        : Number(form.maxShotsBeforeMaintenance),
    partNumber:
      form.partNumber === '' || form.partNumber == null ? null : Number(form.partNumber),
    location: toLocationValue(form.location),
    isActive: Boolean(form.isActive),
  }
}
