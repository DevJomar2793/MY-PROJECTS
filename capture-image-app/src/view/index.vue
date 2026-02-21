<script setup>
import imagecapture from "../components/imagecapture.vue";
import api from "../api/axios";

import { ref } from "vue";

const images = ref([]); //Array of images
const MAX_IMAGES = 4;
const savingImage = ref(false);

// Toast notification system
const toastMessage = ref("");
const toastType = ref("info");
const showToast = ref(false);

const showNotification = (message, type = "info", duration = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  if (duration > 0) {
    setTimeout(() => {
      showToast.value = false;
    }, duration);
  }
};

const addImage = (img) => {
  if (images.value.length >= MAX_IMAGES) {
    showNotification("You reached the maximum number of images", "warning");
    return;
  }

  images.value.push(img);
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const clearImages = () => {
  images.value = [];
};

const saveImage = async (finalImageData, filename = "photo-strip.png") => {
  savingImage.value = true;

  try {
    console.log("Starting image save...");
    console.log("Backend URL:", api.defaults.baseURL);

    // Convert base64 to Blob
    const response = await fetch(finalImageData);
    const blob = await response.blob();
    console.log("Image blob created:", blob.size, "bytes");

    // Create FormData
    const formData = new FormData();
    const safeName = (filename || "photo-strip.png").toString().slice(0, 200);
    formData.append("file", blob, safeName);
    console.log("FormData created, sending to backend...");

    // Send to backend
    const result = await api.post("/api/v1/upload-image", formData);

    showNotification("Image saved to database successfully!", "success");
    console.log("Response:", result.data);

    // Clear images after successful save
    clearImages();
    // Notify other components to refresh image list
    window.dispatchEvent(new CustomEvent("images-updated"));
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    showNotification(
      "Error saving image: " + (error.response?.data?.detail || error.message),
      "error",
    );
  } finally {
    savingImage.value = false;
  }
};
</script>

<template>
  <imagecapture
    :imageList="images"
    @remove="removeImage"
    @add="addImage"
    @clear="clearImages"
    @save-image="saveImage"
  />

  <!-- Toast Notification -->
  <div
    v-if="showToast"
    class="position-fixed top-0 start-50 translate-middle-x p-3"
    style="z-index: 9999; margin-top: 20px"
  >
    <div
      :class="[
        'alert alert-dismissible fade show',
        toastType === 'error'
          ? 'alert-danger'
          : toastType === 'warning'
            ? 'alert-warning'
            : toastType === 'success'
              ? 'alert-success'
              : 'alert-info',
      ]"
      role="alert"
      style="
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 300px;
        font-weight: 500;
        border: none;
        animation: slideDown 0.3s ease-out;
      "
    >
      <span>{{ toastMessage }}</span>
      <button
        type="button"
        class="btn-close"
        @click="showToast = false"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>
