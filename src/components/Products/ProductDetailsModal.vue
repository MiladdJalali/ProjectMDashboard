<script setup>
import { computed } from 'vue'
import { API_ROOT } from '../../api/client'

const props = defineProps({
  show: Boolean,
  product: Object
})

const emit = defineEmits(['close'])

function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url}`
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      
      <div class="modal-header">
        <h3>جزئیات محصول: {{ product?.name }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="modal-body" v-if="product">
        <div class="main-info">
          <img v-if="product.imageUrl" :src="getImageUrl(product.imageUrl)" class="detail-img" alt="Product Image" />
          <div class="info-text">
            <p><strong>کد محصول:</strong> <span class="badge">{{ product.code }}</span></p>
            <p><strong>سازنده:</strong> {{ product.creator }}</p>
            <p><strong>توضیحات:</strong> {{ product.description || 'ندارد' }}</p>
          </div>
        </div>

        <hr class="divider" />
        <h4>لیست قطعات ({{ product.parts?.length || 0 }} مورد)</h4>
        
        <div v-if="product.parts?.length" class="parts-container">
          <div v-for="part in product.parts" :key="part.id" class="part-card">
            <div class="part-header">
              <strong>{{ part.name }}</strong>
              <span class="badge part-badge">کد: {{ part.code }}</span>
            </div>
            
            <p class="part-desc" v-if="part.description">{{ part.description }}</p>
            <div class="molds-list" v-if="part.moldIds?.length">
              <span class="mold-title">قالب‌ها:</span>
              <span v-for="moldId in part.moldIds" :key="moldId" class="mold-badge">
                {{ moldId.substring(0, 8) }}...
              </span>
            </div>
          </div>
        </div>
        <div v-else class="no-parts">
          هیچ قطعه‌ای برای این محصول ثبت نشده است.
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  color: #e2e8f0;
  width: 90%; max-width: 600px;
  border-radius: 12px;
  border: 1px solid #334155;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.5rem; border-bottom: 1px solid #334155;
}

.close-btn {
  background: transparent; border: none; color: #94a3b8;
  font-size: 1.2rem; cursor: pointer;
}

.close-btn:hover { color: #f87171; }

.modal-body { padding: 1.5rem; }

.main-info { display: flex; gap: 1.5rem; margin-bottom: 1rem; }

.detail-img {
  width: 100px; height: 100px; border-radius: 8px; object-fit: cover;
  border: 2px solid #334155;
}

.info-text p { margin: 0.5rem 0; color: #cbd5e1; }

.badge {
  background: #334155; color: #60a5fa; padding: 0.2rem 0.6rem;
  border-radius: 9999px; font-size: 0.85rem;
}

.divider { border-color: #334155; margin: 1.5rem 0; opacity: 0.5; }

.parts-container { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }

.part-card {
  background: #0f172a; padding: 1rem; border-radius: 8px; border: 1px solid #1e293b;
}

.part-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }

.part-badge { background: #1e3a5f; color: #93c5fd; }

.part-desc { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.8rem; }

.molds-list { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }

.mold-title { font-size: 0.8rem; color: #64748b; }

.mold-badge {
  background: #475569; color: #e2e8f0; padding: 0.15rem 0.5rem;
  border-radius: 4px; font-size: 0.75rem; font-family: monospace;
}

.no-parts { text-align: center; color: #64748b; padding: 2rem 0; }
</style>