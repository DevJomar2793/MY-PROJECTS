<script setup>
import { ref } from "vue";

const isDarkMode = ref(localStorage.getItem("theme") === "dark");

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  window.dispatchEvent(new CustomEvent("theme-changed"));
}
</script>
<template>
  <button
    @click="toggleTheme"
    class="btn btn-outline-secondary d-flex align-items-center gap-2"
    style="padding: 0.5rem 1rem; border-radius: 0.5rem"
  >
    <i :class="isDarkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
    <span>{{ isDarkMode ? "Light Mode" : "Dark Mode" }}</span>
  </button>
</template>
