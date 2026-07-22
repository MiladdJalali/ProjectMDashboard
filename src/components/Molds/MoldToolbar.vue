<script setup>
import { fa } from '../../locales/fa.js'
import BaseToolbar from '../BaseToolbar.vue'

const search = defineModel('search', { type: String, default: '' })
const filters = defineModel('filters', {
  type: Object,
  default: () => ({ status: '', location: '', isActive: '' }),
})

const emit = defineEmits(['add', 'apply', 'reset'])

function resetFilters() {
  search.value = ''
  filters.value = { status: '', location: '', isActive: '' }
  emit('reset')
}
</script>

<template>
  <BaseToolbar
    v-model="search"
    :search-placeholder="fa?.molds?.toolbar?.searchPlaceholder || 'جستجو در قالب‌ها...'"
    :add-button-label="fa?.molds?.toolbar?.add || 'افزودن قالب'"
    @add="emit('add')"
    @apply="emit('apply')"
  >
    <template #filters>
      <select v-model="filters.isActive" class="toolbar__select">
        <option value="">{{ fa?.molds?.toolbar?.allActivity || 'همه' }}</option>
        <option value="true">{{ fa?.molds?.active || 'فعال' }}</option>
        <option value="false">{{ fa?.molds?.inactive || 'غیرفعال' }}</option>
      </select>

      <select v-model="filters.status" class="toolbar__select">
        <option value="">{{ fa?.molds?.toolbar?.statusFilter || 'وضعیت' }}</option>
        <option value="1">{{ fa?.molds?.statusValues?.['1'] || 'آماده' }}</option>
        <option value="2">{{ fa?.molds?.statusValues?.['2'] || 'در حال استفاده' }}</option>
        <option value="3">{{ fa?.molds?.statusValues?.['3'] || 'نیاز به تعمیرات' }}</option>
        <option value="4">{{ fa?.molds?.statusValues?.['4'] || 'در حال تعمیر' }}</option>
        <option value="5">{{ fa?.molds?.statusValues?.['5'] || 'بازنشسته' }}</option>
      </select>

      <select v-model="filters.location" class="toolbar__select">
        <option value="">{{ fa?.molds?.toolbar?.locationFilter || 'محل' }}</option>
        <option value="1">{{ fa?.molds?.locationValues?.['1'] || 'انبار' }}</option>
        <option value="2">{{ fa?.molds?.locationValues?.['2'] || 'دستگاه' }}</option>
        <option value="3">{{ fa?.molds?.locationValues?.['3'] || 'تعمیرگاه' }}</option>
      </select>

      <button type="button" class="toolbar__ghost" @click="emit('apply')">
        {{ fa?.molds?.toolbar?.apply || 'اعمال' }}
      </button>      
      <button type="button" class="toolbar__ghost" @click="resetFilters">
        {{ fa?.molds?.toolbar?.reset || 'ریست' }}
      </button>
    </template>
  </BaseToolbar>
</template>