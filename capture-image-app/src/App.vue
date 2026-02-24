<script setup>
import Footer from "../src/components/footer.vue";
</script>
<template>
  <div class="d-flex flex-column min-vh-100">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <router-view />
    <Footer />
  </div>
</template>
