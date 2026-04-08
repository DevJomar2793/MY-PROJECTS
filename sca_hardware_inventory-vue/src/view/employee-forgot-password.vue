<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const step = ref(1);
const showNew = ref(false);
const showConfirm = ref(false);

const form = ref({
  email: "",
  token: "",
  newPassword: "",
  confirmPassword: "",
});

const handleRequest = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  if (!form.value.email) {
    errorMsg.value = "Please enter your email address.";
    return;
  }
  loading.value = true;
  try {
    await api.post("/auth/forgot-password", { email: form.value.email });
    successMsg.value = "If that email exists, a password reset token has been generated.";
    step.value = 2;
  } catch (e) {
    errorMsg.value = e.response?.data?.detail || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};

const handleReset = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  if (!form.value.token || !form.value.newPassword || !form.value.confirmPassword) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }
  if (form.value.newPassword.length < 6) {
    errorMsg.value = "New password must be at least 6 characters.";
    return;
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    errorMsg.value = "Passwords do not match.";
    return;
  }
  loading.value = true;
  try {
    await api.post("/auth/reset-password", {
      token: form.value.token,
      new_password: form.value.newPassword,
    });
    successMsg.value = "Password reset successfully! Redirecting to login...";
    setTimeout(() => router.push("/employee/login"), 1800);
  } catch (e) {
    errorMsg.value = e.response?.data?.detail || "Reset failed. The token may be invalid or expired.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center"
    style="background: linear-gradient(135deg, #083344, #0e7490, #155e75); position: relative; overflow: hidden;"
  >
    <!-- Background blobs -->
    <div style="position:absolute;top:-100px;left:-80px;width:300px;height:300px;background:rgba(6,182,212,0.15);border-radius:50%;filter:blur(70px);"></div>
    <div style="position:absolute;bottom:-80px;right:-80px;width:350px;height:350px;background:rgba(8,145,178,0.12);border-radius:50%;filter:blur(80px);"></div>

    <div class="w-100" style="max-width: 420px; padding: 0 20px; z-index:1;">

      <!-- Brand -->
      <div class="text-center mb-4">
        <div
          class="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
          style="width:60px;height:60px;background:rgba(255,255,255,0.12);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);"
        >
          <i class="bi bi-shield-lock-fill text-white fs-3"></i>
        </div>
        <h4 class="text-white fw-bold mb-1">Password Recovery</h4>
        <p class="text-white-50 small">Reset your Employee Portal account password</p>
      </div>

      <!-- Card -->
      <div class="card border-0 rounded-4 shadow-lg" style="background:rgba(255,255,255,0.96);">
        <div class="card-body p-4 p-md-5">

          <!-- Step indicator -->
          <div class="d-flex align-items-center gap-2 mb-4">
            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              :style="'width:28px;height:28px;font-size:12px;background:' + (step >= 1 ? '#0891b2' : '#dee2e6')">1</div>
            <div class="flex-grow-1" style="height:2px;background:#dee2e6;">
              <div :style="'height:100%;background:#0891b2;transition:width 0.4s;width:' + (step >= 2 ? '100%' : '0%')"></div>
            </div>
            <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              :style="'width:28px;height:28px;font-size:12px;background:' + (step >= 2 ? '#0891b2' : '#dee2e6')">2</div>
          </div>

          <div v-if="errorMsg" class="alert alert-danger rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMsg }}
          </div>
          <div v-if="successMsg" class="alert alert-success rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill"></i> {{ successMsg }}
          </div>

          <!-- Step 1: Email -->
          <div v-if="step === 1">
            <h5 class="fw-bold text-dark mb-1">Find your account</h5>
            <p class="text-muted small mb-4">Enter your registered email address</p>
            <form @submit.prevent="handleRequest">
              <div class="mb-4">
                <label class="form-label fw-semibold small text-dark">Email Address</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted">
                    <i class="bi bi-envelope-fill"></i>
                  </span>
                  <input v-model="form.email" type="email" class="form-control border-start-0 rounded-end-3 bg-light" placeholder="Enter your email" style="box-shadow:none;" :disabled="loading" />
                </div>
              </div>
              <button type="submit" class="btn w-100 rounded-pill fw-bold py-2 shadow-sm" style="background: linear-gradient(135deg, #0e7490, #0891b2); color: white; border:none;" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ loading ? "Sending..." : "Send Reset Token" }}
              </button>
            </form>
          </div>

          <!-- Step 2: Token + New Password -->
          <div v-if="step === 2">
            <h5 class="fw-bold text-dark mb-1">Set new password</h5>
            <p class="text-muted small mb-4">Paste your reset token and enter a new password</p>
            <form @submit.prevent="handleReset">
              <div class="mb-3">
                <label class="form-label fw-semibold small text-dark">Reset Token</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"><i class="bi bi-key-fill"></i></span>
                  <input v-model="form.token" type="text" class="form-control border-start-0 rounded-end-3 bg-light" placeholder="Paste reset token" style="box-shadow:none;font-size:12px;" :disabled="loading" />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold small text-dark">New Password</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"><i class="bi bi-lock-fill"></i></span>
                  <input v-model="form.newPassword" :type="showNew ? 'text' : 'password'" class="form-control border-start-0 border-end-0 bg-light" placeholder="New password" style="box-shadow:none;" :disabled="loading" />
                  <span class="input-group-text bg-light rounded-end-3 border border-start-0 text-muted" style="cursor:pointer;" @click="showNew = !showNew">
                    <i :class="showNew ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                  </span>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold small text-dark">Confirm New Password</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"><i class="bi bi-shield-lock-fill"></i></span>
                  <input v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" class="form-control border-start-0 border-end-0 bg-light" placeholder="Confirm new password" style="box-shadow:none;" :disabled="loading" />
                  <span class="input-group-text bg-light rounded-end-3 border border-start-0 text-muted" style="cursor:pointer;" @click="showConfirm = !showConfirm">
                    <i :class="showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                  </span>
                </div>
              </div>
              <button type="submit" class="btn w-100 rounded-pill fw-bold py-2 shadow-sm" style="background: linear-gradient(135deg, #0e7490, #0891b2); color: white; border:none;" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ loading ? "Resetting..." : "Reset Password" }}
              </button>
            </form>
          </div>

          <hr class="my-4" />
          <p class="text-center text-muted small mb-0">
            Remember your password?
            <router-link to="/employee/login" class="fw-semibold text-decoration-none" style="color:#0891b2;">Back to login</router-link>
          </p>
        </div>
      </div>

      <div class="text-center mt-3">
        <button class="btn btn-link text-white-50 small text-decoration-none" @click="router.push('/')">
          <i class="bi bi-arrow-left me-1"></i>Back to Role Selection
        </button>
      </div>

      <p class="text-center text-white-50 small mt-3">
        &copy; {{ new Date().getFullYear() }} CKT Hardware Inventory &mdash; DevJMR
      </p>
    </div>
  </div>
</template>
