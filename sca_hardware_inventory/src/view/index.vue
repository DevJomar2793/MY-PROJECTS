<script setup>
import Sidebar from "../components/sidebar.vue";
import Navbar from "../components/navbar.vue";
import DashboardTable from "../components/dashboard-table.vue";
import Footer from "../components/footer.vue";
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <Sidebar />
      <main class="col-md-10 ms-sm-auto px-4 py-4">
        <Navbar />
        <DashboardTable />
        <Footer />
      </main>
    </div>
  </div>
</template>
