<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import api from "../api/axios";

const images = ref([]);
const loading = ref(false);
const search = ref("");
const showPreview = ref(false);
const previewSrc = ref(null);
const previewName = ref("");

const fetchImages = async () => {
  loading.value = true;
  try {
    const res = await api.get("/api/v1/images");
    console.log("/api/v1/images response:", res.data);
    images.value = res.data.map((i) => {
      const name = i.filename || "";
      const lower = name.toLowerCase();
      let mime = "application/octet-stream";
      if (lower.endsWith(".png")) mime = "image/png";
      else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
        mime = "image/jpeg";
      else if (lower.endsWith(".gif")) mime = "image/gif";
      else if (lower.endsWith(".webp")) mime = "image/webp";

      const src = i.data ? `data:${mime};base64,${i.data}` : null;
      const isImage = src && mime.startsWith("image/");

      // estimate bytes from base64 length
      let bytes = 0;
      if (i.data) {
        try {
          bytes = Math.round((i.data.length * 3) / 4);
        } catch (e) {
          bytes = 0;
        }
      }

      return {
        id: i.id,
        filename: i.filename,
        src,
        isImage,
        bytes,
        sizeLabel: bytes > 0 ? `${(bytes / 1024).toFixed(1)} KB` : "",
      };
    });
  } catch (err) {
    console.error("Failed to load images:", err);
    images.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredImages = computed(() => {
  if (!search.value) return images.value;
  const q = search.value.toLowerCase();
  return images.value.filter((i) =>
    (i.filename || "").toLowerCase().includes(q),
  );
});

const openPreview = (img) => {
  previewSrc.value = img.src;
  previewName.value = img.filename;
  showPreview.value = true;
  document.body.classList.add("modal-open");
};

const closePreview = () => {
  showPreview.value = false;
  previewSrc.value = null;
  previewName.value = "";
  document.body.classList.remove("modal-open");
};

const downloadImage = async (img) => {
  if (!img || !img.src) return;
  try {
    const res = await fetch(img.src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = img.filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Download failed:", e);
  }
};

onMounted(() => {
  fetchImages();
  window.addEventListener("images-updated", fetchImages);
});

onBeforeUnmount(() => {
  window.removeEventListener("images-updated", fetchImages);
});
</script>

<template>
  <div class="card shadow-sm imagetable-card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <strong>Saved Images</strong>
        <small class="text-muted ms-2">({{ images.length }})</small>
      </div>
      <div class="d-flex align-items-center">
        <input
          v-model="search"
          placeholder="Search filename..."
          class="form-control form-control-sm me-2"
          style="width: 220px"
        />
        <button class="btn btn-sm btn-outline-secondary" @click="fetchImages()">
          Refresh
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center py-4">
        <div class="skeleton-grid">
          <div class="skeleton-card" v-for="n in 6" :key="n"></div>
        </div>
      </div>

      <div v-else>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div v-for="img in filteredImages" :key="img.id" class="col">
            <div class="card h-100 image-card">
              <div class="image-wrap">
                <img
                  v-if="img.src && img.isImage"
                  :src="img.src"
                  class="card-img-top thumb"
                  :alt="img.filename"
                  loading="lazy"
                />

                <div
                  v-else
                  class="no-preview d-flex align-items-center justify-content-center"
                >
                  <span class="text-muted">No preview</span>
                </div>

                <div class="overlay">
                  <div class="overlay-actions">
                    <button
                      class="btn btn-sm btn-light me-2"
                      @click="openPreview(img)"
                      :disabled="!img.src"
                    >
                      View
                    </button>
                    <button
                      v-if="img.src"
                      class="btn btn-sm btn-outline-light"
                      @click.prevent="downloadImage(img)"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div class="card-body d-flex flex-column">
                <div
                  class="d-flex justify-content-between align-items-center mb-2"
                >
                  <h6
                    class="card-title text-truncate mb-0"
                    :title="img.filename"
                  >
                    {{ img.filename }}
                  </h6>
                  <span
                    v-if="img.sizeLabel"
                    class="badge bg-secondary ms-2 small"
                    >{{ img.sizeLabel }}</span
                  >
                </div>

                <div class="mt-auto text-end">
                  <div class="mt-auto text-end">
                    <button
                      class="btn btn-sm btn-primary me-2"
                      @click="openPreview(img)"
                      :disabled="!img.src"
                    >
                      Preview
                    </button>
                    <button
                      v-if="img.src"
                      class="btn btn-sm btn-outline-secondary"
                      @click.prevent="downloadImage(img)"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="images.length === 0" class="text-center text-muted py-4">
          No images found.
        </div>
      </div>
    </div>
  </div>

  <!-- Simple preview overlay -->
  <div
    v-if="showPreview"
    class="preview-overlay d-flex align-items-center justify-content-center"
  >
    <div class="bg-white rounded shadow-lg p-3 preview-box">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>{{ previewName }}</strong>
        <button class="btn-close" @click="closePreview()"></button>
      </div>
      <div style="max-height: 80vh; overflow: auto; text-align: center">
        <img
          v-if="previewSrc"
          :src="previewSrc"
          style="max-width: 100%; max-height: 80vh"
        />
      </div>
    </div>
  </div>
</template>
