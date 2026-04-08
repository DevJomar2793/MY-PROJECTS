<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const email = ref('');
const submitted = ref(false);
const loading = ref(false);
const errorMsg = ref('');

const handleReset = async () => {
    errorMsg.value = '';
    loading.value = true;
    try {
        await api.post('/api/v1/forgot-password', {
            email: email.value
        });
        submitted.value = true;
    } catch (err) {
        errorMsg.value = err.response?.data?.detail || 'Something went wrong. Please try again.';
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
                  <p class="lead fw-medium text-white-50">Don't worry, we'll help you get back into your account.</p>
               </div>
               
               <div class="mt-auto">
                 <p class="small mb-0 text-white-50">&copy; 2026 SCA Sitemap. All rights reserved.</p>
               </div>
            </div>
            <!-- Background Decoration -->
            <div class="bg-decoration position-absolute top-0 start-0 w-100 h-100"></div>
          </div>

          <!-- Right Side Forgot Password Form -->
          <div class="col-md-7 col-12 bg-white">
            <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-center h-100 ps-xl-5 pe-xl-5">
              
              <div v-if="!submitted">
                <div class="mb-5">
                  <div class="d-md-none text-primary mb-3 text-center">
                      <i class="bi bi-diagram-3-fill fs-1"></i>
                      <h3 class="fw-bold mt-2">SCA Sitemap</h3>
                  </div>
                  <router-link to="/login" class="text-decoration-none text-muted mb-4 d-inline-block fw-semibold" style="transition: color 0.2s;">
                    <i class="bi bi-arrow-left me-1"></i> Back to Login
                  </router-link>
                  <h2 class="fw-bold text-dark mb-2 mt-2 fade-in-up">Forgot Password?</h2>
                  <p class="text-muted fade-in-up delay-1">Enter the email address associated with your account and we'll send you a link to reset your password.</p>
                </div>

                <form @submit.prevent="handleReset" class="fade-in-up delay-2">

                  <!-- Error Alert -->
                  <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show rounded-3 py-2 px-3 d-flex align-items-center" role="alert">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    <span class="small">{{ errorMsg }}</span>
                    <button type="button" class="btn-close btn-close-sm ms-auto" @click="errorMsg = ''" aria-label="Close" style="font-size: 0.65rem;"></button>
                  </div>
                  
                  <div class="form-floating mb-4">
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

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm login-btn py-3" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Sending...' : 'Send Reset Link' }}
                    </button>
                  </div>

                </form>
              </div>

              <!-- Success State -->
              <div v-else class="text-center fade-in-up">
                <div class="mb-4 text-success">
                  <i class="bi bi-check-circle-fill" style="font-size: 4.5rem;"></i>
                </div>
                <h3 class="fw-bold text-dark">Check your email</h3>
                <p class="text-muted mb-4">We've sent a password reset link to <br><strong>{{ email }}</strong></p>
                
                <router-link to="/login" class="btn btn-primary px-4 py-2 rounded-3 fw-medium">
                  Return to Login
                </router-link>
                
                <div class="mt-4">
                  <p class="small text-muted mb-0">Didn't receive the email? 
                    <button @click="submitted = false" class="btn btn-link p-0 text-decoration-none fw-semibold shadow-none ms-1">Try another email</button>
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

