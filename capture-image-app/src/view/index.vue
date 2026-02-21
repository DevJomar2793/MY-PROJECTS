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

    alert("Image saved to database successfully!");
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
