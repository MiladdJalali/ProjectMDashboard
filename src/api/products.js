import { apiRequest, unwrapValue } from './client'

function appendIfPresent(query, key, value) {
  if (value === null || value === undefined || value === '') return
  query.set(key, String(value))
}

export function unwrapProductList(data) {
  const values = data?.values
  if (!values) return []
  if (Array.isArray(values) && Array.isArray(values[0])) {
    return values.flat()
  }
  return Array.isArray(values) ? values : []
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams()

  appendIfPresent(query, 'PageIndex', params.pageIndex)
  appendIfPresent(query, 'PageSize', params.pageSize)
  appendIfPresent(query, 'Id', params.id)
  appendIfPresent(query, 'Name', params.name)
  appendIfPresent(query, 'Code', params.code)
  appendIfPresent(query, 'PartName', params.partName)
  appendIfPresent(query, 'PartCode', params.partCode)

  const qs = query.toString()
  const path = qs ? `/Products?${qs}` : '/Products'

  const data = await apiRequest(path)
  const products = unwrapProductList(data)
  return {
    products,
    totalCount: data?.totalCount ?? products.length,
  }
}

export async function uploadProductImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const data = await apiRequest('/Media/upload', {
    method: 'POST',
    body: formData,
  })
  
  return data
}

export async function createProduct(payload) {
  const data = await apiRequest('/Products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return unwrapValue(data)
}

export async function fetchProduct(id) {
  const data = await apiRequest(`/Products/${encodeURIComponent(id)}`)
  return unwrapValue(data)
}

export async function updateProduct(id, payload) {
  await apiRequest(`/Products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteProduct(id) {
  await apiRequest(`/Products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

function toPartRequest(part) {
  /** @type {import('../types/products.js').PartRequest} */
  const request = {
    name: part.name.trim(),
    code: Number(part.code),
    description: part.description?.trim() || undefined,
    moldIds: Array.isArray(part.moldIds) ? part.moldIds.map(String) : [],
  }

  if (part.id) {
    request.id = String(part.id)
  }

  return request
}

export function toProductRequest(form) {
  return {
    name: form.name.trim(),
    code: Number(form.code),
    description: form.description?.trim() || undefined,
    imageUrl: form.imageUrl || undefined,
    parts: (form.parts || []).map(toPartRequest),
  }
}
