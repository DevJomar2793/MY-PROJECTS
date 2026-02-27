<script setup>
import SideBar from "../components/sidebar.vue";
import Cards from "../components/cards.vue";
import Table from "../components/tables.vue";
import AddScreenModal from "../components/addScreenButtonModal.vue";
import SearchBar from "../components/searchbar.vue";
import Footer from "../components/footer.vue";
import Swal from 'sweetalert2';

import { ref, onMounted } from "vue";

//Add Screen Endpoint
//Add Screen Endpoint
async function addPage(data) {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/PageCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add screen',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while adding screen',
    });
  }
}

//Read Screen Endpoint
const pages = ref([]);
const searchQuery = ref("");

async function getPages() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/GetSellerScreen");
  pages.value = await res.json();
}

onMounted(getPages);
</script>
<template>
  <SideBar />
  <main class="content">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1>Seller Screens</h1>
            <p>Manage and review seller screen entries.</p>
          </div>
          <!-- <AddScreenModal @submit="addPage" /> -->
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
