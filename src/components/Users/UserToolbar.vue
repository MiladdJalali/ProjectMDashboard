<script setup>
import { ref } from 'vue'
import { fa } from '../../locales/fa.js'
import BaseToolbar from '../BaseToolbar.vue'

const search = defineModel({ type: String, default: '' })
const emit = defineEmits(['add'])

const baseToolbarRef = ref(null)

defineExpose({ focusSearch: () => baseToolbarRef.value?.focusSearch() })
</script>

<template>
  <BaseToolbar
    ref="baseToolbarRef"
    v-model="search"
    :search-placeholder="fa?.toolbar?.searchPlaceholder || 'جستجو...'"
    :add-button-label="fa?.toolbar?.addUser || 'افزودن کاربر جدید'"
    @add="emit('add')"
  />
</template>