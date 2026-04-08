<template>
  <footer class="footer mt-auto py-3">
    <div class="container-fluid text-center">
      <span class="text-muted fw-bold opacity-75">
        &copy; {{ currentYear }} DevJMR. All rights reserved.
      </span>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: transparent;
}
.footer span {
  font-size: 0.85rem;
  letter-spacing: 0.05rem;
}
</style>
