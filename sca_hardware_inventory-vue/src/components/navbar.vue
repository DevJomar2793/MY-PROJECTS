<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const route = useRoute();
const user = ref(null);

// Load user from localStorage
const loadUser = () => {
  const stored = localStorage.getItem("ckt_user");
  if (stored) {
    try { user.value = JSON.parse(stored); } catch {}
  }
};

onMounted(loadUser);

// Map route path to a readable page title
const pageTitle = {
  "/": "Dashboard",
  "/equipment": "Equipment List",
  "/deployment": "Deployment",
  "/reports": "Reports & Analytics",
};

const title = () => pageTitle[route.path] || "CKT Inventory";

const handleLogout = async () => {
  const token = localStorage.getItem("ckt_token");
  if (token) {
    try {
      await api.post("/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  localStorage.removeItem("ckt_token");
  localStorage.removeItem("ckt_user");
  router.push("/login");
};

const avatarUrl = () => {
  const name = user.value?.username || "Admin";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=302b63&color=fff`;
};
</script>

<template>
  <nav class="navbar navbar-expand-lg glass-panel rounded-4 mb-4 px-4 py-3 shadow-sm border-0">
    <div class="container-fluid px-0">
      <span class="navbar-brand mb-0 h5 fw-bold text-dark">{{ title() }}</span>
      <div class="d-flex align-items-center gap-3">
        <div class="position-relative cursor-pointer" role="button">
          <i class="bi bi-bell fs-5 text-muted hover-lift d-inline-block"></i>
          <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span class="visually-hidden">New alerts</span>
          </span>
        </div>

        <!-- User info + logout dropdown -->
        <div class="d-flex align-items-center gap-2 border-start ps-3 ms-2">
          <img
            :src="avatarUrl()"
            alt="Profile"
            class="rounded-circle shadow-sm"
            width="36"
            height="36"
          />
          <div class="d-none d-md-block me-2">
            <p class="mb-0 fw-semibold fs-6 lh-1" style="color: var(--text-main)">
              {{ user?.username || "Admin" }}
            </p>
            <small class="text-muted d-block text-truncate" style="max-width: 120px; font-size: 0.75rem">
              {{ user?.email || "" }}
            </small>
          </div>
          <button
            @click="handleLogout"
            class="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-none d-flex align-items-center gap-1"
            style="font-size:12px;"
            title="Logout"
          >
            <i class="bi bi-box-arrow-right"></i>
            <span class="d-none d-md-inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
