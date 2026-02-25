<script setup>
import SideBar from "../components/sidebar.vue";
import Cards from "../components/cards.vue";
import Table from "../components/tables.vue";
import AddScreenModal from "../components/addScreenButtonModal.vue";
import SearchBar from "../components/searchbar.vue";

import { ref, onMounted } from "vue";

//Add Screen Endpoint
async function addPage(data) {
  await fetch("http://127.0.0.1:8000/api/v1/PageCreate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

//Read Screen Endpoint

const pages = ref([]);
const searchQuery = ref("");

async function getPages() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/GetSpecificScreen");
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
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your sitemap.</p>
          </div>
          <AddScreenModal @submit="addPage" />
        </div>
      </div>

      <!-- Stat Cards -->
      <Cards />

      <!-- Search & Table -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <SearchBar v-model="searchQuery" />
      </div>
      <Table :pages="pages" :search-query="searchQuery" @updatePage="getPages" />
    </div>
  </main>
</template>
