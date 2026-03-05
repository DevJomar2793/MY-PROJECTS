<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import api from '../api/axios';

// const route = useRoute();
const router = useRouter();
const fullname = ref("QA Account");

const isAuthenticated = ref(false);

onMounted(async () => {
  isAuthenticated.value = !!localStorage.getItem('access_token');
  
  if (isAuthenticated.value) {
    try {
      const response = await api.get('/api/v1/users/me');
      fullname.value = response.data.full_name;
    } catch (error) {
      console.error("Failed to load user info:", error);
    }
  }
});

const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
};
</script>

<template>
  <div class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand d-flex flex-column align-items-center gap-2 py-4">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-grid-1x2-fill fs-5"></i>
        <h5 class="mb-0 text-white">SCA Sitemap</h5>
      </div>
      <!-- Profile Info (QA Logged In) -->
      <div v-if="isAuthenticated" class="mt-3 text-center">
        <div class="bg-primary bg-opacity-25 rounded-circle d-inline-flex justify-content-center align-items-center mb-2" style="width: 48px; height: 48px;">
          <i class="bi bi-person-fill fs-3 text-primary"></i>
        </div>
        <div class="text-white fw-semibold small">{{ fullname }}</div>
        <div class="text-white-50" style="font-size: 0.75rem;">Quality Assurance</div>
      </div>
    </div>

    <!-- Navigation -->
    <ul class="nav flex-column">
      <li class="nav-section">Main</li>

      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link">
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
          <li class="nav-item">
            <router-link to="/mobileworkerapp" class="nav-link">
              <span>Mobile Worker App</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/marketplace" class="nav-link">
              <span>Marketplace</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/readmodule" class="nav-link">
              <span>Read Module</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/controllermodule" class="nav-link">
              <span>Controller Module</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="nav-section">Analytics</li>

      <!-- <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="bi bi-file-earmark-bar-graph"></i>
          <span>Report</span>
        </a>
      </li> -->
    </ul>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div v-if="isAuthenticated" class="mb-3 d-grid">
         <button @click="handleLogout" class="btn btn-outline-light btn-sm w-100 d-flex justify-content-center align-items-center gap-2">
           <i class="bi bi-box-arrow-left"></i> Logout
         </button>
      </div>
      <div class="text-center">
        <small class="text-white-50">SCA Sitemap v1.0</small>
      </div>
    </div>
  </div>
</template>
