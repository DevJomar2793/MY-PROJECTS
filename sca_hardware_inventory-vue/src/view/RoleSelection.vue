<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToAdmin = () => router.push("/login");
const goToEmployee = () => router.push("/employee/login");
</script>

<template>
  <div
    class="min-vh-100 d-flex flex-column align-items-center justify-content-center"
    style="
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      position: relative;
      overflow: hidden;
    "
  >
    <!-- Background decorative blobs -->
    <div
      style="
        position: absolute;
        top: -80px;
        left: -80px;
        width: 300px;
        height: 300px;
        background: rgba(99, 102, 241, 0.15);
        border-radius: 50%;
        filter: blur(60px);
      "
    ></div>
    <div
      style="
        position: absolute;
        bottom: -80px;
        right: -80px;
        width: 350px;
        height: 350px;
        background: rgba(139, 92, 246, 0.12);
        border-radius: 50%;
        filter: blur(80px);
      "
    ></div>

    <!-- Header -->
    <div class="text-center mb-5" style="z-index: 1">
      <div
        class="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
        style="
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        "
      >
        <i class="bi bi-box-seam-fill text-white fs-2"></i>
      </div>
      <h2 class="text-white fw-bold mb-1" style="letter-spacing: -0.5px">
        CKT Hardware Inventory
      </h2>
      <p class="text-white-50 small mb-0">
        Select your access level to continue
      </p>
    </div>

    <!-- Role Cards -->
    <div
      class="d-flex gap-4 flex-wrap justify-content-center px-4"
      style="z-index: 1"
    >
      <!-- Admin Card -->
      <div
        class="role-card"
        @click="goToAdmin"
        role="button"
        tabindex="0"
        @keydown.enter="goToAdmin"
      >
        <div class="role-icon-wrap admin-icon">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h5 class="fw-bold text-dark mb-1 mt-3">Admin Access</h5>
        <p class="text-muted small mb-4">
          Manage inventory, deployments, and system reports.
        </p>
        <div class="role-chip admin-chip">
          <i class="bi bi-arrow-right-circle-fill me-2"></i>Login as Admin
        </div>
      </div>

      <!-- Employee Card -->
      <div
        class="role-card"
        @click="goToEmployee"
        role="button"
        tabindex="0"
        @keydown.enter="goToEmployee"
      >
        <div class="role-icon-wrap employee-icon">
          <i class="bi bi-person-badge-fill"></i>
        </div>
        <h5 class="fw-bold text-dark mb-1 mt-3">Employee Portal</h5>
        <p class="text-muted small mb-4">
          View your assigned equipment and hardware details.
        </p>
        <div class="role-chip employee-chip">
          <i class="bi bi-arrow-right-circle-fill me-2"></i>Enter as Employee
        </div>
      </div>
    </div>

    <p class="text-white-50 small mt-5" style="z-index: 1">
      &copy; {{ new Date().getFullYear() }} CKT Hardware Inventory &mdash;
      DevJMR
    </p>
  </div>
</template>
