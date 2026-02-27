<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand d-flex align-items-center gap-2">
      <i class="bi bi-grid-1x2-fill fs-5"></i>
      <h5 class="mb-0 text-white">SCA Sitemap</h5>
    </div>

    <!-- Navigation -->
    <ul class="nav flex-column">
      <li class="nav-section">Main</li>

      <li class="nav-item">
        <router-link to="/" class="nav-link">
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </router-link>
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          data-bs-toggle="collapse"
          href="#screensSubmenu"
          role="button"
          aria-expanded="false"
          aria-controls="screensSubmenu"
        >
          <i class="bi bi-display"></i>
          <span>Screens</span>
          <i class="bi bi-chevron-down ms-auto" style="font-size: 0.7rem"></i>
        </a>
        <ul class="collapse submenu" id="screensSubmenu">
          <li class="nav-item">
            <router-link to="/buyer" class="nav-link">
              <span>Buyer</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/seller" class="nav-link">
              <span>Seller</span>
            </router-link>
          </li>
           <li class="nav-item">
            <router-link to="/appraisalboss" class="nav-link">
              <span>Appraisal Boss</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin" class="nav-link">
              <span>Admin</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="nav-section">Analytics</li>

      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="bi bi-file-earmark-bar-graph"></i>
          <span>Report</span>
        </a>
      </li>
    </ul>

    <!-- Footer -->
    <div class="sidebar-footer">
      <small>SCA Sitemap v1.0</small>
    </div>
  </div>
</template>
