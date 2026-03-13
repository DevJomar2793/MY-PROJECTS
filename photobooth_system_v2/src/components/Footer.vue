<template>
  <footer class="sc-footer">
    <div class="container">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div class="brand"><i class="bi bi-camera-fill me-1 text-accent"></i>Snap<span>Capture</span></div>
        <p>Premium webcam image capture &amp; gallery system &copy; {{ year }}</p>
        <div class="d-flex gap-3" style="font-size:.82rem;">
          <RouterLink to="/" class="text-muted">Capture</RouterLink>
          <RouterLink to="/gallery" class="text-muted">Gallery</RouterLink>
          <a href="/api/docs" target="_blank" class="text-muted">API Docs</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
const year = new Date().getFullYear()
</script>
