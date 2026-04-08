<template>
  <!-- Page Hero -->
  <section class="page-hero">
    <div class="container position-relative" style="z-index:1;">
      <p class="section-label afu"><i class="bi bi-images me-2"></i>Image Gallery</p>
      <h1 class="section-title afu-1">Your <span>Captured Photos</span></h1>
      <div class="section-divider afu-1"></div>
      <p style="color:var(--text-muted);max-width:480px;font-size:.95rem;" class="afu-2">
        All photos saved via the capture studio. Download or delete any image.
      </p>
    </div>
  </section>

  <section class="section-pad">
    <div class="container">

      <!-- Toolbar -->
      <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between mb-4">
        <div class="d-flex gap-2 align-items-center flex-wrap">
          <!-- Search -->
          <div class="position-relative">
            <i class="bi bi-search position-absolute" style="top:50%;left:.75rem;transform:translateY(-50%);color:var(--text-muted);font-size:.85rem;"></i>
            <input v-model="search" type="text" placeholder="Search by name or user…"
              style="background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--text-light);border-radius:8px;padding:.5rem .9rem .5rem 2.1rem;font-size:.87rem;width:230px;transition:all .3s;"
              @focus="$event.target.style.borderColor='var(--accent)'" @blur="$event.target.style.borderColor='var(--border)'" />
          </div>
          <!-- Sort -->
          <select v-model="sortBy" style="background:rgba(255,255,255,.05);border:1px solid var(--border);color:var(--text-light);border-radius:8px;padding:.5rem .9rem;font-size:.87rem;">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="user">By User</option>
          </select>
          <span style="font-size:.82rem;color:var(--text-muted);">{{ filteredImages.length }} photo{{ filteredImages.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn-ghost" @click="fetchImages" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
          <RouterLink to="/" class="btn-accent">
            <i class="bi bi-camera me-1"></i>New Capture
          </RouterLink>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
        <p style="color:var(--text-muted);font-size:.9rem;margin-top:.75rem;">Loading gallery…</p>
      </div>

      <!-- Error -->
      <div v-else-if="fetchError" class="sc-error d-flex align-items-center gap-2 mb-4">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <span>{{ fetchError }}</span>
        <button class="ctrl-btn ms-auto" @click="fetchImages">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredImages.length === 0 && !loading" class="text-center py-5">
        <i class="bi bi-images" style="font-size:5rem;color:rgba(245,166,35,.2);display:block;margin-bottom:1rem;"></i>
        <h5 style="color:var(--text-muted);">{{ search ? 'No matching photos' : 'No photos yet' }}</h5>
        <p style="color:var(--text-muted);font-size:.88rem;">{{ search ? 'Try a different search term.' : 'Head to the capture studio to take your first photo!' }}</p>
        <RouterLink v-if="!search" to="/" class="btn-accent mt-2">
          <i class="bi bi-camera me-2"></i>Go Capture
        </RouterLink>
      </div>

      <!-- Gallery Grid -->
      <div v-else class="gallery-grid">
        <div v-for="img in paginatedImages" :key="img.id" class="gal-card afu">
          <!-- Image -->
          <div class="gal-img-wrap" @click="openLightbox(img)">
            <img :src="img.url" :alt="img.original_name" loading="lazy" />
            <div class="gal-overlay">
              <button class="ctrl-btn" style="font-size:.85rem;" @click.stop="openLightbox(img)">
                <i class="bi bi-zoom-in"></i>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="gal-body">
            <div class="fw-600 mb-1" style="font-size:.88rem;color:var(--text-light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ img.original_name || 'Untitled' }}
            </div>
            <div class="gal-meta d-flex flex-column gap-1">
              <span><i class="bi bi-person me-1 text-accent"></i>{{ img.user || 'Anonymous' }}</span>
              <span><i class="bi bi-calendar3 me-1 text-accent"></i>{{ formatDate(img.captured_at) }}</span>
              <span><i class="bi bi-file-earmark-image me-1 text-accent"></i>{{ img.width }}×{{ img.height }} • {{ img.file_size }} KB</span>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2 mt-2">
              <a :href="'/api/images/' + img.id + '/download'" class="btn-ghost flex-grow-1 text-center" style="padding:.4rem;font-size:.8rem;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:.4rem;">
                <i class="bi bi-download"></i>Download
              </a>
              <button class="ctrl-btn" style="padding:.4rem .7rem;font-size:.8rem;" @click="promptDelete(img)" title="Delete">
                <i class="bi bi-trash text-danger"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <nav>
          <ul class="pagination sc-page mb-0">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="page--">‹</button>
            </li>
            <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: page === p }">
              <button class="page-link" @click="page = p">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="page++">›</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>

  <!-- Lightbox Modal -->
  <div class="modal fade sc-modal" id="lightboxModal" tabindex="-1" ref="lightboxEl">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title text-accent">
            <i class="bi bi-zoom-in me-2"></i>{{ selectedImg?.original_name || 'Photo' }}
          </h6>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-2 text-center" v-if="selectedImg">
          <img :src="selectedImg.url" :alt="selectedImg.original_name" class="img-fluid rounded-3" style="max-height:75vh;object-fit:contain;" />
        </div>
        <div class="modal-footer" v-if="selectedImg">
          <span class="user-badge"><i class="bi bi-person me-1"></i>{{ selectedImg.user }}</span>
          <span style="font-size:.82rem;color:var(--text-muted);margin-left:.5rem;">{{ formatDate(selectedImg.captured_at) }}</span>
          <a :href="'/api/images/' + selectedImg.id + '/download'" class="btn-accent ms-auto" style="padding:.4rem 1.1rem;font-size:.85rem;">
            <i class="bi bi-download me-1"></i>Download
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirm Modal -->
  <div class="modal fade sc-modal" id="deleteModal" tabindex="-1" ref="deleteModalEl">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content text-center p-4">
        <i class="bi bi-trash-fill text-danger mb-3" style="font-size:2.5rem;"></i>
        <h6 class="text-light mb-1">Delete Photo?</h6>
        <p style="font-size:.82rem;color:var(--text-muted);">
          "<strong>{{ deleteTarget?.original_name }}</strong>" will be permanently removed.
        </p>
        <div class="d-flex gap-2 justify-content-center mt-3">
          <button class="btn-ghost px-3" data-bs-dismiss="modal" style="font-size:.85rem;">Cancel</button>
          <button class="btn btn-danger btn-sm px-3" @click="confirmDelete" :disabled="deleting">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
            {{ deleting ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Modal } from 'bootstrap'
import { api } from '../services/api.js'

const images = ref([])
const loading = ref(true)
const fetchError = ref('')
const search = ref('')
const sortBy = ref('newest')
const page = ref(1)
const perPage = 12
const selectedImg = ref(null)
const deleteTarget = ref(null)
const deleting = ref(false)

const lightboxEl = ref(null)
const deleteModalEl = ref(null)
let lightboxModal = null
let deleteModal = null

// ── Fetch ──
async function fetchImages() {
  loading.value = true
  fetchError.value = ''
  try {
    images.value = await api.listImages()
  } catch (err) {
    fetchError.value = `Could not load gallery: ${err.message}. Make sure the backend is running on port 8000.`
  } finally {
    loading.value = false
  }
}

// ── Filter & Sort ──
const filteredImages = computed(() => {
  let imgs = [...images.value]
  if (search.value) {
    const q = search.value.toLowerCase()
    imgs = imgs.filter(i => (i.original_name || '').toLowerCase().includes(q) || (i.user || '').toLowerCase().includes(q))
  }
  if (sortBy.value === 'oldest') imgs.sort((a, b) => new Date(a.captured_at) - new Date(b.captured_at))
  else if (sortBy.value === 'user') imgs.sort((a, b) => (a.user || '').localeCompare(b.user || ''))
  else imgs.sort((a, b) => new Date(b.captured_at) - new Date(a.captured_at))
  return imgs
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredImages.value.length / perPage)))
const paginatedImages = computed(() => filteredImages.value.slice((page.value - 1) * perPage, page.value * perPage))

watch([search, sortBy], () => { page.value = 1 })

// ── Lightbox ──
function openLightbox(img) {
  selectedImg.value = img
  lightboxModal?.show()
}

// ── Delete ──
function promptDelete(img) {
  deleteTarget.value = img
  deleteModal?.show()
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.deleteImage(deleteTarget.value.id)
    images.value = images.value.filter(i => i.id !== deleteTarget.value.id)
    deleteModal?.hide()
  } catch (err) {
    alert(`Delete failed: ${err.message}`)
  } finally {
    deleting.value = false
  }
}

// ── Helpers ──
function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchImages()
  lightboxModal = new Modal(lightboxEl.value)
  deleteModal = new Modal(deleteModalEl.value)
})
</script>
