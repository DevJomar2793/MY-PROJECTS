<script setup>
// import SideBar from "../components/sidebar.vue";
import Table from "../components/imagetable.vue";
import Footer from "../components/footer.vue";
</script>

<template>
  <!-- <SideBar /> -->
  <main class="content py-4">
    <div class="container-fluid px-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 fw-bold mb-1">Dashboard</h1>
          <p class="text-muted mb-0">Welcome to your photo booth dashboard.</p>
        </div>
      </div>
      <Table />
    </div>
  </main>
</template>
