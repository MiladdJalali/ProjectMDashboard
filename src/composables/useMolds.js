import { ref, computed } from 'vue'
import {
  fetchMolds,
  fetchMold as apiFetchMold,
  createMold as apiCreateMold,
  updateMold as apiUpdateMold,
  deleteMold as apiDeleteMold,
  toMoldRequest,
} from '../api/molds'
import { ApiError, clearToken } from '../api/client'

export function useMolds() {
  const molds = ref([])
  const totalCount = ref(0)
  const search = ref('')
  const filters = ref({
    status: '',
    location: '',
    isActive: '',
  })
  const loading = ref(false)
  const error = ref('')

  const filteredMolds = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return molds.value

    return molds.value.filter((mold) => {
      const haystack = [
        mold.name,
        mold.description,
        mold.code,
        mold.partNumber,
        mold.status,
        mold.location,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  })

  const moldCount = computed(() => totalCount.value || molds.value.length)

  async function loadMolds() {
    loading.value = true
    error.value = ''
    try {
      const params = {
        pageIndex: 0,
        pageSize: 100,
        name: search.value.trim(),
        status: filters.value.status,
        location: filters.value.location,
        isActive: filters.value.isActive,
      }
      const result = await fetchMolds(params)
      molds.value = result.molds
      totalCount.value = result.totalCount
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken()
        window.location.href = '/login'
        return
      }
      error.value = err instanceof ApiError ? err.message : 'بارگذاری قالب‌ها ناموفق بود.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getMold(id) {
    try {
      const mold = await apiFetchMold(id)
      return { ok: true, mold }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'دریافت اطلاعات قالب ناموفق بود.',
      }
    }
  }

  async function createMold(form) {
    try {
      const payload = toMoldRequest(form)
      const created = await apiCreateMold(payload)
      await loadMolds()
      return { ok: true, mold: created }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'ایجاد قالب ناموفق بود.',
      }
    }
  }

  async function updateMold(id, form) {
    try {
      const payload = toMoldRequest(form)
      await apiUpdateMold(id, payload)
      await loadMolds()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'ویرایش قالب ناموفق بود.',
      }
    }
  }

  async function deleteMold(id) {
    try {
      await apiDeleteMold(id)
      await loadMolds()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'حذف قالب ناموفق بود.',
      }
    }
  }

  return {
    molds,
    search,
    filters,
    filteredMolds,
    moldCount,
    loading,
    error,
    loadMolds,
    getMold,
    createMold,
    updateMold,
    deleteMold,
  }
}
