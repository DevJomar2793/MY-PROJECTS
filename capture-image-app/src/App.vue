<script setup>
import Footer from "../src/components/footer.vue";
</script>
<template>
  <div class="d-flex flex-column min-vh-100">
    <router-link to="/dashboard">Dashboard</router-link>
    <router-view />
    <Footer />
  </div>
</template>
