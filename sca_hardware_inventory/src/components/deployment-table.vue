<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import Swal from "sweetalert2";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const deployments = ref([]);
const loading = ref(false);

const fetchDeployments = async () => {
  loading.value = true;
  try {
    const response = await api.get("/deployments");
    deployments.value = response.data;
  } catch (error) {
    console.error("Error fetching deployments:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load deployment data.",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDeployments();
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value * -1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
};

const getSortIcon = (key) => {
  if (sortKey.value !== key)
    return "bi bi-arrow-down-up text-black-50 ms-1 opacity-50";
  return sortOrder.value === 1
    ? "bi bi-sort-alpha-down text-primary ms-1 fw-bold"
    : "bi bi-sort-alpha-up text-primary ms-1 fw-bold";
};

const filteredAndSortedDeployments = computed(() => {
  let result = [...deployments.value];

  // 1. Search Filtering
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter((item) => {
      return (
        item.ckt_item_number.toLowerCase().includes(q) ||
        item.deployed_to.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.history && item.history.toLowerCase().includes(q))
      );
    });
  }

  // 2. Sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      let aVal = a[sortKey.value] || "";
      let bVal = b[sortKey.value] || "";

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return -1 * sortOrder.value;
      if (aVal > bVal) return 1 * sortOrder.value;
      return 0;
    });
  }

  return result;
});
</script>

<template>
  <div class="card border-0 rounded-4 shadow-sm mb-4">
    <div
      class="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center"
    >
      <h5 class="mb-0 fw-bold text-dark">Deployment List</h5>
      <div
        class="d-flex align-items-center px-3 py-1"
        style="
          background-color: var(--secondary-color);
          border-radius: 20px;
          width: 250px;
        "
      >
        <i class="bi bi-search text-muted me-2"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm border-0 bg-transparent p-0 shadow-none text-dark"
          placeholder="Search deployments..."
        />
      </div>
    </div>
    <div class="card-body p-4 pt-2">
      <div class="table-responsive">
        <table class="table table-hover align-middle border-bottom mb-0">
          <thead>
            <tr>
              <th
                @click="sortBy('ckt_item_number')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                CKT Item #
                <i :class="getSortIcon('ckt_item_number')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('deployed_to')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Deployed To
                <i :class="getSortIcon('deployed_to')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('location')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Location
                <i
                  :class="getSortIcon('location')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
              <th
                @click="sortBy('quantity')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                QTY
                <i :class="getSortIcon('quantity')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('history')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                History
                <i
                  :class="getSortIcon('history')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
              <th
                @click="sortBy('received_date')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-end custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Received Date
                <i
                  :class="getSortIcon('received_date')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="py-5 text-center text-muted">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Loading deployments...
              </td>
            </tr>
            <tr v-else v-for="item in filteredAndSortedDeployments" :key="item.id">
              <td class="py-3 text-muted">{{ item.ckt_item_number }}</td>
              <td class="py-3">
                <div class="d-flex align-items-center">
                  <img
                    :src="'https://ui-avatars.com/api/?name=' + (item.deployed_to || 'User').replace(/ /g, '+') + '&background=random'"
                    class="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <span class="fw-medium text-dark">{{ item.deployed_to }}</span>
                </div>
              </td>
              <td class="py-3 text-muted">{{ item.location }}</td>
              <td class="py-3 text-dark fw-bold">{{ item.quantity }}</td>
              <td class="py-3 text-muted small">{{ item.history || 'N/A' }}</td>
              <td class="py-3">
                <span
                  class="badge rounded-pill px-3 py-2 fw-semibold border border-opacity-25 badge-soft-info border-info text-info"
                >
                  {{ item.received_date }}
                </span>
              </td>
            </tr>
            <tr v-if="!loading && filteredAndSortedDeployments.length === 0">
              <td colspan="6" class="py-5 text-center text-muted">
                <i class="bi bi-search d-block fs-3 mb-2 opacity-50"></i>
                No deployments found matching "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-sort-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}
.custom-sort-header:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
