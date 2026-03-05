<script setup>
import SideBar from "../components/sidebar.vue";
import Cards from "../components/cards.vue";
import Table from "../components/tables.vue";
import AddScreenModal from "../components/addScreenButtonModal.vue";
import SearchBar from "../components/searchbar.vue";
import Footer from "../components/footer.vue";
import Swal from 'sweetalert2';
import api from '../api/axios';
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

    const modalCloseBtn = document.querySelector('#addScreen .btn-close');
    if (modalCloseBtn) modalCloseBtn.click();

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Screen added successfully!',
      timer: 1500,
      showConfirmButton: false
    });
    getPages();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.detail || 'An error occurred while adding screen',
    });
  }
}

//Read Screen Endpoint
const pages = ref([]);
const searchQuery = ref("");

async function getPages() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/GetBuyerScreen");
  pages.value = await res.json();
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
            <h1>Buyer Screens</h1>
            <p>Manage and review buyer screen entries.</p>
          </div>
          <AddScreenModal v-if="isAuthenticated" @submit="addPage" />
        </div>
      </div>

      <!-- Stat Cards -->
      <!-- <Cards /> -->

      <!-- Search & Table -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <SearchBar v-model="searchQuery" />
      </div>
      <Table :pages="pages" :search-query="searchQuery" @updatePage="getPages" />
    </div>
  </main>
  <Footer />
</template>
