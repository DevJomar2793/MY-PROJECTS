<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar />
  <main style="min-height: calc(100vh - 140px);">
    <RouterView />
  </main>
  <Footer />
</template>
