<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = (type) => {
    if (type === 'qa') {
        router.push('/login')
    } else {
        // Clear token for unauthenticated staff
        localStorage.removeItem('access_token');
        router.push('/dashboard')
    }
}
</script>
<template>
    <div class="landing-container d-flex justify-content-center align-items-center min-vh-100">
        <div class="overlay"></div>
        <div class="container position-relative z-1">
            <div class="text-center mb-5">
                <h1 class="display-4 fw-bold text-white mb-3 fade-in-up">Welcome to SCA Sitemap</h1>
                <p class="lead text-white-50 fade-in-up delay-1">Please select your role to continue</p>
            </div>

            <div class="row justify-content-center g-4">
                <div class="col-md-5 col-lg-4 fade-in-up delay-2">
                    <div class="role-card card border-0 h-100 text-center" @click="handleLogin('qa')">
                        <div class="card-body p-5 d-flex flex-column justify-content-center align-items-center">
                            <div class="icon-wrapper bg-primary-subtle text-primary mb-4">
                                <i class="bi bi-shield-check fs-1"></i>
                            </div>
                            <h3 class="card-title fw-bold mb-3">QA Staff</h3>
                            <p class="card-text text-secondary mb-0">Access editing tools, manage sitemaps, and oversee quality assurance.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5 col-lg-4 fade-in-up delay-3">
                    <div class="role-card card border-0 h-100 text-center" @click="handleLogin('user')">
                        <div class="card-body p-5 d-flex flex-column justify-content-center align-items-center">
                            <div class="icon-wrapper bg-success-subtle text-success mb-4">
                                <i class="bi bi-person-badge fs-1"></i>
                            </div>
                            <h3 class="card-title fw-bold mb-3">CST or Dev Staff</h3>
                            <p class="card-text text-secondary mb-0">Log in to your account to view your dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

