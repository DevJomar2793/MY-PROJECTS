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
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
