<script setup>
import SideBar from "../components/sidebar.vue";
import Cards from "../components/cards.vue";
import Table from "../components/tables.vue";
import AddScreenModal from "../components/addScreenButtonModal.vue";
import SearchBar from "../components/searchbar.vue";
import Footer from "../components/footer.vue";
import Swal from "sweetalert2";
import api from '../api/axios';

import { ref, onMounted } from "vue";

const isAuthenticated = ref(false);

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('access_token');
  getPages();
});

//Add Screen Endpoint
async function addPage(data) {
  try {
    const res = await api.post("/api/v1/PageCreate", data);

    // Dismiss via native Bootstrap button click — properly resets modal state
    document.getElementById("addScreenModalClose")?.click();

    await refreshAll();

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Screen has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.detail || "An error occurred while adding the screen.",
    });
  }
}

//Read Screen Endpoint
const cardsRef = ref(null);
const pages = ref([]);
const searchQuery = ref("");

async function getPages() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/GetSpecificScreen");
  pages.value = await res.json();
}

async function refreshAll() {
  await getPages();
  cardsRef.value?.refreshCounts();
}
</script>
<template>
  <SideBar />
  <main class="content">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your sitemap.</p>
          </div>
          <AddScreenModal v-if="isAuthenticated" @submit="addPage" />
        </div>
      </div>

      <!-- Stat Cards -->
      <Cards ref="cardsRef" />

      <!-- Search & Table -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <SearchBar v-model="searchQuery" />
      </div>
      <Table :pages="pages" :search-query="searchQuery" @updatePage="refreshAll" />
    </div>
  </main>
  <Footer />
</template>
