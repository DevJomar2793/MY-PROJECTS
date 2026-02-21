<script setup>
import imagecapture from "../components/imagecapture.vue";
import api from "../api/axios";

import { ref } from "vue";

const images = ref([]); //Array of images
const MAX_IMAGES = 4;
const savingImage = ref(false);

const addImage = (img) => {
  if (images.value.length >= MAX_IMAGES) {
    alert("You reach the maximum images");
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

const saveImage = async (finalImageData) => {
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
    formData.append("file", blob, "photo-strip.png");
    console.log("FormData created, sending to backend...");

    // Send to backend
    const result = await api.post("/api/v1/upload-image", formData);

    alert("Image saved to database successfully!");
    console.log("Response:", result.data);

    // Clear images after successful save
    clearImages();
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    alert(
      "Error saving image: " + (error.response?.data?.detail || error.message),
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
</template>
