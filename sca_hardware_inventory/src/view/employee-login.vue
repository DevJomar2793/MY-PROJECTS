<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const loading = ref(false);
const errorMsg = ref("");
const showPassword = ref(false);

const form = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  errorMsg.value = "";
  if (!form.value.username || !form.value.password) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }
  loading.value = true;
  try {
    const res = await api.post("/auth/login", {
      username: form.value.username,
      password: form.value.password,
    });
    localStorage.setItem("ckt_emp_token", res.data.access_token);
    localStorage.setItem("ckt_emp_user", JSON.stringify(res.data.user));
    router.push("/employee/dashboard");
  } catch (e) {
    errorMsg.value =
      e.response?.data?.detail || "Login failed. Please check your credentials.";
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
          <i class="bi bi-person-badge-fill text-white fs-3"></i>
        </div>
        <h4 class="text-white fw-bold mb-1">Employee Portal</h4>
        <p class="text-white-50 small">Sign in to access your assigned hardware</p>
      </div>

      <!-- Card -->
      <div class="card border-0 rounded-4 shadow-lg" style="background:rgba(255,255,255,0.96);backdrop-filter:blur(20px);">
        <div class="card-body p-4 p-md-5">
          <h5 class="fw-bold text-dark mb-1">Welcome back</h5>
          <p class="text-muted small mb-4">Enter your employee credentials to continue</p>

          <!-- Error Alert -->
          <div v-if="errorMsg" class="alert alert-danger rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="mb-3">
              <label class="form-label fw-semibold small text-dark">Username</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted">
                  <i class="bi bi-person-fill"></i>
                </span>
                <input
                  v-model="form.username"
                  type="text"
                  class="form-control border-start-0 rounded-end-3 bg-light"
                  placeholder="Enter your username"
                  style="box-shadow:none;"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <label class="form-label fw-semibold small text-dark">Password</label>
                <router-link to="/employee/forgot-password" class="small text-decoration-none" style="color:#0891b2;">Forgot password?</router-link>
              </div>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control border-start-0 border-end-0 bg-light"
                  placeholder="Enter your password"
                  style="box-shadow:none;"
                  :disabled="loading"
                />
                <span
                  class="input-group-text bg-light rounded-end-3 border border-start-0 text-muted"
                  style="cursor:pointer;"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </span>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              class="btn w-100 rounded-pill fw-bold py-2 shadow-sm"
              style="background: linear-gradient(135deg, #0e7490, #0891b2); color: white; border:none;"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ loading ? "Signing in..." : "Sign In" }}
            </button>
          </form>

          <hr class="my-4" />

          <p class="text-center text-muted small mb-0">
            Don't have an account?
            <router-link to="/employee/signup" class="fw-semibold text-decoration-none" style="color:#0891b2;">Create one</router-link>
          </p>
        </div>
      </div>

      <div class="text-center mt-3">
        <button
          class="btn btn-link text-white-50 small text-decoration-none"
          @click="router.push('/')"
        >
          <i class="bi bi-arrow-left me-1"></i>Back to Role Selection
        </button>
      </div>

      <p class="text-center text-white-50 small mt-3">
        &copy; {{ new Date().getFullYear() }} CKT Hardware Inventory &mdash; DevJMR
      </p>
    </div>
  </div>
</template>
