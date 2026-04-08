<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const handleSignup = async () => {
    errorMsg.value = '';
    successMsg.value = '';

    // Client-side validation
    if (password.value.length < 8) {
        errorMsg.value = 'Password must be at least 8 characters';
        return;
    }
    if (password.value !== confirmPassword.value) {
        errorMsg.value = 'Passwords do not match';
        return;
    }

    loading.value = true;
    try {
        await api.post('/api/v1/register', {
            full_name: fullName.value,
            email: email.value,
            password: password.value,
            confirm_password: confirmPassword.value
        });
        successMsg.value = 'Account created successfully! Redirecting to login...';
        setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
        errorMsg.value = err.response?.data?.detail || 'Registration failed. Please try again.';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <div class="login-page">
    <div class="container min-vh-100 d-flex justify-content-center align-items-center py-5">
      <div class="card login-card shadow-lg border-0 rounded-4 w-100 overflow-hidden" style="max-width: 900px;">
        <div class="row g-0">
          
          <!-- Left Side Branding / Graphic -->
          <div class="col-md-5 d-none d-md-block login-sidebar position-relative">
            <div class="d-flex flex-column h-100 justify-content-between p-5 text-white position-relative z-1">
               <div>
                  <h3 class="fw-bold mb-4 d-flex align-items-center text-white">
                    <i class="bi bi-diagram-3-fill fs-2 me-2"></i>
                    SCA Sitemap
                  </h3>
                  <p class="lead fw-medium text-white-50">Join us to manage and organize your site structure seamlessly.</p>
               </div>
               
               <div class="mt-auto">
                 <p class="small mb-0 text-white-50">&copy; 2026 SCA Sitemap. All rights reserved.</p>
               </div>
            </div>
            <!-- Background Decoration -->
            <div class="bg-decoration position-absolute top-0 start-0 w-100 h-100"></div>
          </div>

          <!-- Right Side Signup Form -->
          <div class="col-md-7 col-12 bg-white">
            <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-center h-100 ps-xl-5 pe-xl-5">
              
              <div class="mb-4">
                <div class="d-md-none text-primary mb-3 text-center">
                    <i class="bi bi-diagram-3-fill fs-1"></i>
                    <h3 class="fw-bold mt-2">SCA Sitemap</h3>
                </div>
                <router-link to="/login" class="text-decoration-none text-muted mb-4 d-inline-block fw-semibold" style="transition: color 0.2s;">
                    <i class="bi bi-arrow-left me-1"></i> Back to Login
                  </router-link>
                <h2 class="fw-bold text-dark mb-2 fade-in-up">Create Account</h2>
                <p class="text-muted fade-in-up delay-1">Please enter your details to sign up.</p>
              </div>

              <form @submit.prevent="handleSignup" class="fade-in-up delay-2">

                <!-- Alerts -->
                <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show rounded-3 py-2 px-3 d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-circle me-2"></i>
                  <span class="small">{{ errorMsg }}</span>
                  <button type="button" class="btn-close btn-close-sm ms-auto" @click="errorMsg = ''" aria-label="Close" style="font-size: 0.65rem;"></button>
                </div>
                <div v-if="successMsg" class="alert alert-success rounded-3 py-2 px-3 d-flex align-items-center" role="alert">
                  <i class="bi bi-check-circle me-2"></i>
                  <span class="small">{{ successMsg }}</span>
                </div>
                
                <div class="form-floating mb-3">
                  <input
                    v-model="fullName"
                    type="text"
                    class="form-control bg-light border-0 shadow-none"
                    id="floatingInputName"
                    placeholder="John Doe"
                    required
                  />
                  <label for="floatingInputName" class="text-muted">Full Name</label>
                </div>

                <div class="form-floating mb-3">
                  <input
                    v-model="email"
                    type="email"
                    class="form-control bg-light border-0 shadow-none"
                    id="floatingInputEmail"
                    placeholder="name@example.com"
                    required
                  />
                  <label for="floatingInputEmail" class="text-muted">Email address</label>
                </div>
                
                <div class="row g-3">
                    <div class="col-sm-6 mb-3">
                        <div class="form-floating position-relative">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control bg-light border-0 shadow-none"
                            id="floatingPassword"
                            placeholder="Password"
                            required
                        />
                        <label for="floatingPassword" class="text-muted">Password</label>
                        </div>
                    </div>
                    <div class="col-sm-6 mb-3">
                        <div class="form-floating position-relative">
                        <input
                            v-model="confirmPassword"
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control bg-light border-0 shadow-none"
                            id="floatingConfirmPassword"
                            placeholder="Confirm"
                            required
                        />
                        <label for="floatingConfirmPassword" class="text-muted">Confirm</label>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end mb-4 px-1" style="margin-top: -10px;">
                    <button 
                        type="button" 
                        class="btn btn-sm btn-link text-decoration-none text-muted p-0"
                        @click="showPassword = !showPassword"
                    >
                        <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i> {{ showPassword ? 'Hide Passwords' : 'Show Passwords' }}
                    </button>
                </div>


                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm login-btn py-3" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Creating Account...' : 'Sign Up' }}
                  </button>
                </div>
                
                <div class="text-center mt-3">
                  <p class="text-muted small mb-0">Already have an account? <router-link to="/login" class="text-primary fw-semibold text-decoration-none">Sign in</router-link></p>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

