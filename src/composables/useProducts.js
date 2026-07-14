import { ref, computed } from 'vue'
import {
  fetchProducts,
  fetchProduct as apiFetchProduct,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  uploadProductImage,
  toProductRequest,
} from '../api/products'
import { ApiError, clearToken } from '../api/client'

export function useProducts() {
  const products = ref([])
  const totalCount = ref(0)
  const search = ref('')
  const filters = ref({
    id: '',
    name: '',
    code: '',
    partName: '',
    partCode: '',
  })
  const loading = ref(false)
  const error = ref('')

  const filteredProducts = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return products.value

    return products.value.filter((product) => {
      const partNames = (product.parts || []).map((p) => p.name).join(' ')
      const haystack = [
        product.name,
        product.description,
        product.code,
        partNames,
      ]
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  })

  const productCount = computed(() => totalCount.value || products.value.length)

  async function loadProducts() {
    loading.value = true
    error.value = ''
    try {
      const params = {
        pageIndex: 0,
        pageSize: 100,
        id: filters.value.id.trim(),
        name: filters.value.name.trim() || search.value.trim(),
        code: filters.value.code,
        partName: filters.value.partName.trim(),
        partCode: filters.value.partCode,
      }
      const result = await fetchProducts(params)
      products.value = result.products
      totalCount.value = result.totalCount
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken()
        window.location.href = '/login'
        return
      }
      error.value = err instanceof ApiError ? err.message : 'بارگذاری محصولات ناموفق بود.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getProduct(id) {
    try {
      const product = await apiFetchProduct(id)
      return { ok: true, product }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'دریافت اطلاعات محصول ناموفق بود.',
      }
    }
  }

  async function createProduct(form) {
    try {      
      console.log("=== Starting Product Creation ===");
      
      if (form.imageFile) {
        console.log("Uploading image...");
        const uploadResult = await uploadProductImage(form.imageFile);
        console.log("Image uploaded successfully:", uploadResult);
        form.imageUrl = uploadResult.imageUrl;
      } else {
        console.log("No image to upload");
      }
      
      const payload = toProductRequest(form);
      console.log("Sending product payload:", payload);
      
      const created = await apiCreateProduct(payload);
      console.log("Product created successfully:", created);
      
      await loadProducts();
      return { ok: true, product: created };
    } catch (err) {
      console.error("=== Create Product Error ===", err);
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'ایجاد محصول ناموفق بود.',
      };
    }
  }

  async function updateProduct(id, form) {
    try {
      console.log("=== Starting Product Update ===");

      if (form.imageFile) {
        console.log("Uploading new image for update...");
        const uploadResult = await uploadProductImage(form.imageFile)
        console.log("Image uploaded successfully for update:", uploadResult);
        form.imageUrl = uploadResult.imageUrl
      } else {
        console.log("No new image to upload. Using existing image URL:", form.imageUrl);
      }
    
      const payload = toProductRequest(form)
      console.log("Sending updated product payload:", payload);

      await apiUpdateProduct(id, payload)
      console.log("Product updated successfully!");

      await loadProducts()
      return { ok: true }
    } catch (err) {
      console.error("=== Update Product Error ===", err);
      return {
        ok: false,
        error: err.message || 'ویرایش محصول ناموفق بود.',
      }
    }
  }

  async function deleteProduct(id) {
    try {
      await apiDeleteProduct(id)
      await loadProducts()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : 'حذف محصول ناموفق بود.',
      }
    }
  }

  return {
    products,
    search,
    filters,
    filteredProducts,
    productCount,
    loading,
    error,
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
