<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1); // 1 for ascending, -1 for descending

// Mock data
const hardwareItems = ref([
  {
    id: "#1024",
    type: "Router Cisco 2901",
    manufacturer: "Cisco Systems",
    model: "2901/K9",
    dateTested: "2025-03-10",
    statusClass: "badge-soft-success border-success text-success",
  },
  {
    id: "#1025",
    type: "PowerEdge R740",
    manufacturer: "Dell Technologies",
    model: "LFF Server v4",
    dateTested: "2025-03-12",
    statusClass: "badge-soft-warning border-warning text-warning",
  },
  {
    id: "#1026",
    type: "Aruba 2930F",
    manufacturer: "Hewlett Packard",
    model: "JL253A",
    dateTested: "2025-02-28",
    statusClass: "badge-soft-danger border-danger text-danger",
  },
  {
    id: "#1027",
    type: "MacBook Pro",
    manufacturer: "Apple Inc.",
    model: "M3 Max (16-inch)",
    dateTested: "2025-03-15",
    statusClass: "badge-soft-success border-success text-success",
  },
]);

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

const filteredAndSortedHardware = computed(() => {
  let result = [...hardwareItems.value];

  // 1. Search Filtering
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter((item) => {
      return (
        item.id.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.dateTested.toLowerCase().includes(q)
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
    <div class="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold text-dark">Hardware Inventory List</h5>
      <div class="d-flex align-items-center px-3 py-1" style="background-color: var(--secondary-color); border-radius: 20px; width: 250px;">
        <i class="bi bi-search text-muted me-2"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm border-0 bg-transparent p-0 shadow-none text-dark"
          placeholder="Search items..."
        />
      </div>
    </div>
    <div class="card-body p-4 pt-2">
      <div class="table-responsive">
        <table class="table table-hover align-middle border-bottom mb-0">
          <thead>
            <tr>
              <th @click="sortBy('id')" class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start custom-sort-header" style="background-color: var(--secondary-color)">
                CKT Item # <i :class="getSortIcon('id')" style="font-size: 0.8rem"></i>
              </th>
              <th @click="sortBy('type')" class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header" style="background-color: var(--secondary-color)">
                Hardware Type <i :class="getSortIcon('type')" style="font-size: 0.8rem"></i>
              </th>
              <th @click="sortBy('manufacturer')" class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header" style="background-color: var(--secondary-color)">
                Manufacturer <i :class="getSortIcon('manufacturer')" style="font-size: 0.8rem"></i>
              </th>
              <th @click="sortBy('model')" class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header" style="background-color: var(--secondary-color)">
                Model <i :class="getSortIcon('model')" style="font-size: 0.8rem"></i>
              </th>
              <th @click="sortBy('dateTested')" class="border-0 text-muted fw-semibold py-3 fs-6 rounded-end custom-sort-header" style="background-color: var(--secondary-color)">
                Date Tested <i :class="getSortIcon('dateTested')" style="font-size: 0.8rem"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAndSortedHardware" :key="item.id">
              <td class="py-3 text-muted">{{ item.id }}</td>
              <td class="py-3 fw-medium text-dark">{{ item.type }}</td>
              <td class="py-3 text-muted">{{ item.manufacturer }}</td>
              <td class="py-3 fw-medium text-dark">{{ item.model }}</td>
              <td class="py-3">
                <span :class="['badge rounded-pill px-3 py-2 fw-semibold border border-opacity-25', item.statusClass]">
                  {{ item.dateTested }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredAndSortedHardware.length === 0">
              <td colspan="5" class="py-5 text-center text-muted">
                <i class="bi bi-search d-block fs-3 mb-2 opacity-50"></i>
                No items found matching "{{ searchQuery }}"
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
