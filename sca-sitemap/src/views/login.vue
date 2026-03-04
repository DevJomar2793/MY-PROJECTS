<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import Swal from 'sweetalert2';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = () => {
    // Basic mock login action for demo
    if (email.value && password.value) {
        // e.g. router.push('/dashboard');
        console.log('Logging in with', email.value);
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
                  <p class="lead fw-medium text-white-50">Manage and organize your site structure seamlessly.</p>
               </div>
               
               <div class="mt-auto">
                 <p class="small mb-0 text-white-50">&copy; 2026 SCA Sitemap. All rights reserved.</p>
               </div>
            </div>
            <!-- Background Decoration -->
            <div class="bg-decoration position-absolute top-0 start-0 w-100 h-100"></div>
          </div>

          <!-- Right Side Login Form -->
          <div class="col-md-7 col-12 bg-white">
            <div class="card-body p-4 p-sm-5 d-flex flex-column justify-content-center h-100 ps-xl-5 pe-xl-5">
              
              <div class="mb-5">
                <div class="d-md-none text-primary mb-3 text-center">
                    <i class="bi bi-diagram-3-fill fs-1"></i>
                    <h3 class="fw-bold mt-2">SCA Sitemap</h3>
                </div>
                <h2 class="fw-bold text-dark mb-2">Welcome back!</h2>
                <p class="text-muted">Please enter your details to sign in.</p>
              </div>

              <form @submit.prevent="handleLogin">
                
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
                
                <div class="form-floating mb-3 position-relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control bg-light border-0 shadow-none"
                    id="floatingInputPassword"
                    placeholder="Password"
                    required
                  />
                  <label for="floatingInputPassword" class="text-muted">Password</label>
                  <button 
                    type="button" 
                    class="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none text-muted"
                    @click="showPassword = !showPassword"
                    tabindex="-1"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                  </button>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="form-check">
                    <input class="form-check-input shadow-sm" type="checkbox" id="rememberMe" />
                    <label class="form-check-label text-muted small user-select-none" for="rememberMe">
                      Remember for 30 days
                    </label>
                  </div>
                  <router-link to="/forgot-password" class="text-primary small text-decoration-none fw-semibold">Forgot Password?</router-link>
                </div>

                <div class="d-grid mb-4">
                  <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm login-btn py-3">
                    Sign In
                  </button>
                </div>

                <!-- <div class="position-relative mb-4 text-center mt-4">
                   <hr class="text-muted">
                   <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted text-uppercase fw-semibold" style="letter-spacing: 0.5px;">Or continue with</span>
                </div> -->

                <!-- <div class="d-grid">
                    <button type="button" class="btn border-light-subtle btn-lg rounded-3 shadow-sm text-dark d-flex align-items-center justify-content-center bg-white google-btn py-2">
                        <i class="bi bi-google text-danger me-2"></i> <span class="fw-medium text-secondary">Sign in with Google</span>
                    </button>
                </div> -->
                
                <div class="text-center mt-5">
                  <p class="text-muted small mb-0">Don't have an account? <router-link to="/signup" class="text-primary fw-semibold text-decoration-none">Sign up</router-link></p>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

