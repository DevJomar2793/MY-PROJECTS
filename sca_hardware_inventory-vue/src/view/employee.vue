<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div
    class="min-vh-100 d-flex flex-column align-items-center justify-content-center"
    style="background: linear-gradient(135deg, #0e7490, #0891b2, #164e63); position: relative; overflow: hidden;"
  >
    <!-- Background blobs -->
    <div style="position:absolute;top:-100px;right:-100px;width:350px;height:350px;background:rgba(6,182,212,0.15);border-radius:50%;filter:blur(80px);"></div>
    <div style="position:absolute;bottom:-100px;left:-100px;width:300px;height:300px;background:rgba(14,116,144,0.2);border-radius:50%;filter:blur(60px);"></div>

    <!-- Content -->
    <div style="z-index:1;" class="text-center px-4">
      <div
        class="d-inline-flex align-items-center justify-content-center rounded-4 mb-4"
        style="width:80px;height:80px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);"
      >
        <i class="bi bi-person-badge-fill text-white fs-1"></i>
      </div>

      <h2 class="text-white fw-bold mb-2">Employee Portal</h2>
      <p class="text-white-50 mb-5" style="max-width:420px;margin:0 auto;">
        This portal is under development. Employee-facing features will be available here soon.
      </p>

      <div
        class="d-inline-block rounded-4 px-4 py-4 mb-4"
        style="background:rgba(255,255,255,0.1);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.15);"
      >
        <div class="d-flex align-items-center gap-3 text-white">
          <i class="bi bi-hourglass-split fs-3 text-warning"></i>
          <div class="text-start">
            <div class="fw-semibold">Coming Soon</div>
            <div class="small text-white-50">Employee dashboard is being built.</div>
          </div>
        </div>
      </div>

      <br />

      <button
        class="btn rounded-pill px-4 py-2 fw-semibold mt-3"
        style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3);backdrop-filter:blur(10px);"
        @click="router.push('/')"
      >
        <i class="bi bi-arrow-left me-2"></i>Back to Role Selection
      </button>
    </div>

    <p class="text-white-50 small mt-5" style="z-index:1;">
      &copy; {{ new Date().getFullYear() }} CKT Hardware Inventory &mdash; DevJMR
    </p>
  </div>
</template>
