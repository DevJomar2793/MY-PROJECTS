<script setup>
const year = new Date().getFullYear();
</script>

<style scoped>
.footer a:hover {
  text-decoration: underline;
}
</style>
<template>
  <footer class="footer mt-auto py-3 bg-dark text-light">
    <div class="container">
      <div class="row align-items-center">
        <!-- Left -->
        <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
          © {{ year }} DevJMR.
        </div>

        <!-- Right -->
        <div class="col-md-6 text-center text-md-end">All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>