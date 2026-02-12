<script setup>
import SideBar from "../components/sidebar.vue";
// import Cards from "../components/cards.vue";
import Table from "../components/tables.vue";
// import AddScreenModal from "../components/addScreenButtonModal.vue";
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

async function getPages() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/GetSpecificScreen");
  pages.value = await res.json();
}

onMounted(getPages);
</script>
<template>
  <SideBar />
  <main class="content">
    <div class="container-fluid position-relative">
      <h1 class="h2">Dashboard</h1>
      <p class="text-muted">Welcome to your dashboard.</p>
      <Cards />
      <div class="d-flex justify-content-between align-items-center mb-2">
        <SearchBar />
        <AddScreenModal @submit="addPage" />
      </div>
      <Table :pages="pages" />
    </div>
  </main>
</template>
