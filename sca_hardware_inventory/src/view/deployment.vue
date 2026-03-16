<script setup>
import Sidebar from "../components/sidebar.vue";
import Navbar from "../components/navbar.vue";
import DeploymentTable from "../components/deployment-table.vue";
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <Sidebar />
      <main class="col-md-10 ms-sm-auto px-4 py-4">
        <Navbar />
        <DeploymentTable />
      </main>
    </div>
  </div>
</template>
