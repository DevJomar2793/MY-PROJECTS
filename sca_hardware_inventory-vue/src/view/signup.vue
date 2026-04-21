<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleSignup = async () => {
  errorMsg.value = "";
  successMsg.value = "";

  if (
    !form.value.username ||
    !form.value.email ||
    !form.value.password ||
    !form.value.confirmPassword
  ) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }
  if (form.value.password.length < 6) {
    errorMsg.value = "Password must be at least 6 characters.";
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMsg.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  try {
    await api.post("/api/v1/auth/register", {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    });
    successMsg.value = "Account created successfully! Redirecting to login...";
    setTimeout(() => router.push("/login"), 1800);
  } catch (e) {
    errorMsg.value =
      e.response?.data?.detail || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center"
    style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
  >
    <div class="w-100" style="max-width: 460px; padding: 0 20px">
      <!-- Brand -->
      <div class="text-center mb-4">
        <div
          class="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
          style="
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          "
        >
          <i class="bi bi-box-seam-fill text-white fs-3"></i>
        </div>
        <h4 class="text-white fw-bold mb-1">CKT Hardware Inventory</h4>
        <p class="text-white-50 small">Create your account to get started</p>
      </div>

      <!-- Card -->
      <div
        class="card border-0 rounded-4 shadow-lg"
        style="
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
        "
      >
        <div class="card-body p-4 p-md-5">
          <h5 class="fw-bold text-dark mb-1">Create an account</h5>
          <p class="text-muted small mb-4">Fill in your details below</p>

          <div
            v-if="errorMsg"
            class="alert alert-danger rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2"
          >
            <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMsg }}
          </div>
          <div
            v-if="successMsg"
            class="alert alert-success rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2"
          >
            <i class="bi bi-check-circle-fill"></i> {{ successMsg }}
          </div>

          <form @submit.prevent="handleSignup">
            <!-- Username -->
            <div class="mb-3">
              <label class="form-label fw-semibold small text-dark"
                >Username</label
              >
              <div class="input-group">
                <span
                  class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"
                >
                  <i class="bi bi-person-fill"></i>
                </span>
                <input
                  v-model="form.username"
                  type="text"
                  class="form-control border-start-0 rounded-end-3 bg-light"
                  placeholder="Choose a username"
                  style="box-shadow: none"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label fw-semibold small text-dark"
                >Email Address</label
              >
              <div class="input-group">
                <span
                  class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"
                >
                  <i class="bi bi-envelope-fill"></i>
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control border-start-0 rounded-end-3 bg-light"
                  placeholder="Enter your email"
                  style="box-shadow: none"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label class="form-label fw-semibold small text-dark"
                >Password</label
              >
              <div class="input-group">
                <span
                  class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"
                >
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control border-start-0 border-end-0 bg-light"
                  placeholder="Min. 6 characters"
                  style="box-shadow: none"
                  :disabled="loading"
                />
                <span
                  class="input-group-text bg-light rounded-end-3 border border-start-0 text-muted"
                  style="cursor: pointer"
                  @click="showPassword = !showPassword"
                >
                  <i
                    :class="
                      showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                    "
                  ></i>
                </span>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="form-label fw-semibold small text-dark"
                >Confirm Password</label
              >
              <div class="input-group">
                <span
                  class="input-group-text bg-light border-end-0 rounded-start-3 border text-muted"
                >
                  <i class="bi bi-shield-lock-fill"></i>
                </span>
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  class="form-control border-start-0 border-end-0 bg-light"
                  placeholder="Re-enter your password"
                  style="box-shadow: none"
                  :disabled="loading"
                />
                <span
                  class="input-group-text bg-light rounded-end-3 border border-start-0 text-muted"
                  style="cursor: pointer"
                  @click="showConfirm = !showConfirm"
                >
                  <i
                    :class="
                      showConfirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                    "
                  ></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              class="btn w-100 rounded-pill fw-bold py-2 shadow-sm"
              style="
                background: linear-gradient(135deg, #302b63, #24243e);
                color: white;
                border: none;
              "
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              {{ loading ? "Creating account..." : "Create Account" }}
            </button>
          </form>

          <hr class="my-4" />

          <p class="text-center text-muted small mb-0">
            Already have an account?
            <router-link
              to="/login"
              class="text-primary fw-semibold text-decoration-none"
              >Sign in</router-link
            >
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

      <p class="text-center text-white-50 small mt-4">
        &copy; {{ new Date().getFullYear() }} CKT Hardware Inventory &mdash;
        DevJMR
      </p>
    </div>
  </div>
</template>
