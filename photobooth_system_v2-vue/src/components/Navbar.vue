<template>
  <nav class="navbar navbar-expand-lg sc-nav">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="bi bi-camera-fill me-2 text-accent"></i>Snap<span>Capture</span>
      </RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#scNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="scNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              <i class="bi bi-camera me-1"></i>Capture
            </RouterLink>
          </li>
          <li class="nav-item ms-lg-2">
            <RouterLink class="nav-link btn-gallery-nav" to="/gallery">
              <i class="bi bi-images me-1"></i>Gallery
            </RouterLink>
          </li>
          <li class="nav-item ms-lg-2">
            <button @click="toggleTheme" class="nav-link btn btn-link text-decoration-none border-0 m-0" aria-label="Toggle Theme">
              <i :class="isDarkMode ? 'bi bi-sun-fill text-warning' : 'bi bi-moon-stars-fill text-primary'"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  isDarkMode.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-bs-theme', savedTheme)
})
</script>
