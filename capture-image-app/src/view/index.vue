<script setup>
import imagecapture from "../components/imagecapture.vue";

import { ref } from "vue";

const images = ref([]); //Array of images
const MAX_IMAGES = 6;

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
</script>

<template>
  <imagecapture
    :imageList="images"
    @remove="removeImage"
    @add="addImage"
    @clear="clearImages"
  />
</template>
