<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../api/axios";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const hardwareItems = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

// Modal & Form State
const showModal = ref(false);
const newHardware = ref({
  ckt_item_number: "",
  hardware_type: "",
  manufacturer: "",
  model: "",
  serialNumber: "",
  qty: 1,
  warranty: "",
  screenSize: "",
  processor: "",
  processorSpeed: "",
  operatingSystem: "",
  ram: "",
  storageType: "",
  storageSize: "",
  dateTested: new Date().toISOString().split("T")[0],
});

const fetchHardware = async () => {
  loading.value = true;
  try {
    const response = await api.get("/hardware");
    hardwareItems.value = response.data;
  } catch (error) {
    console.error("Error fetching hardware:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load hardware inventory.",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHardware();
});

const openModal = (item = null) => {
  if (item) {
    isEditing.value = true;
    currentId.value = item.id;
    newHardware.value = {
      ckt_item_number: item.ckt_item_number,
      hardware_type: item.hardware_type,
      manufacturer: item.manufacturer,
      model: item.model,
      serialNumber: item.serial_number,
      qty: item.qty,
      warranty: item.warranty,
      screenSize: item.screen_size,
      processor: item.processor,
      processorSpeed: item.processor_speed,
      operatingSystem: item.operating_system,
      ram: item.ram,
      storageType: item.storage_type,
      storageSize: item.storage,
      dateTested: item.date_tested,
    };
  } else {
    isEditing.value = false;
    currentId.value = null;
    resetForm();
    // Generate a temporary CKT item number if empty
    if (!newHardware.value.ckt_item_number) {
      newHardware.value.ckt_item_number = `CKT-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;
    }
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  newHardware.value = {
    ckt_item_number: "",
    hardware_type: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    qty: 1,
    warranty: "",
    screenSize: "",
    processor: "",
    processorSpeed: "",
    operatingSystem: "",
    ram: "",
    storageType: "",
    storageSize: "",
    dateTested: new Date().toISOString().split("T")[0],
  };
};

const addHardware = async () => {
  if (
    !newHardware.value.ckt_item_number ||
    !newHardware.value.hardware_type ||
    !newHardware.value.manufacturer ||
    !newHardware.value.model
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields!",
    });
    return;
  }

  // Map frontend fields (camelCase) to backend fields (snake_case)
  const payload = {
    ckt_item_number: newHardware.value.ckt_item_number,
    hardware_type: newHardware.value.hardware_type,
    manufacturer: newHardware.value.manufacturer,
    model: newHardware.value.model,
    qty: newHardware.value.qty,
    serial_number: newHardware.value.serialNumber,
    warranty: newHardware.value.warranty,
    screen_size: newHardware.value.screenSize,
    processor: newHardware.value.processor,
    processor_speed: newHardware.value.processorSpeed,
    operating_system: newHardware.value.operatingSystem,
    ram: newHardware.value.ram,
    storage_type: newHardware.value.storageType,
    storage: newHardware.value.storageSize,
    date_tested: newHardware.value.dateTested,
    designation: "Available", // Default designation
  };

  try {
    if (isEditing.value) {
      await api.put(`/hardware/${currentId.value}`, payload);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Hardware details have been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await api.post("/hardware", payload);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "New hardware has been successfully added to the database.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
    closeModal();
    fetchHardware(); // Refresh the list
  } catch (error) {
    console.error("Error saving hardware:", error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: error.response?.data?.detail || "Could not save hardware data.",
    });
  }
};

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
        item.ckt_item_number.toLowerCase().includes(q) ||
        item.hardware_type.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        (item.date_tested && item.date_tested.toLowerCase().includes(q))
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
          placeholder="Search items..."
        />
      </div>
      <button
        @click="openModal"
        class="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
      >
        <i class="bi bi-plus-lg"></i>
        <span class="fw-bold">Add Hardware</span>
      </button>
    </div>
    <div class="card-body p-4 pt-2">
      <div class="table-responsive">
        <table class="table table-hover align-middle border-bottom mb-0">
          <thead>
            <tr>
              <th
                @click="sortBy('id')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                CKT Item #
                <i :class="getSortIcon('id')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('type')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Hardware Type
                <i :class="getSortIcon('type')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('manufacturer')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Manufacturer
                <i
                  :class="getSortIcon('manufacturer')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
              <th
                @click="sortBy('model')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Model
                <i :class="getSortIcon('model')" style="font-size: 0.8rem"></i>
              </th>
              <th
                @click="sortBy('dateTested')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-end custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Date Tested
                <i
                  :class="getSortIcon('dateTested')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="py-5 text-center text-muted">
                <div
                  class="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                ></div>
                Loading inventory...
              </td>
            </tr>
            <tr v-else v-for="item in filteredAndSortedHardware" :key="item.id">
              <td class="py-3 text-muted">
                <button
                  @click="openModal(item)"
                  class="btn btn-link p-0 text-decoration-none fw-semibold text-primary"
                >
                  {{ item.ckt_item_number }}
                </button>
              </td>
              <td class="py-3 fw-medium text-dark">{{ item.hardware_type }}</td>
              <td class="py-3 text-muted">{{ item.manufacturer }}</td>
              <td class="py-3 fw-medium text-dark">{{ item.model }}</td>
              <td class="py-3">
                <span
                  class="badge rounded-pill px-3 py-2 fw-semibold border border-opacity-25 badge-soft-success border-success text-success"
                >
                  {{ item.date_tested }}
                </span>
              </td>
            </tr>
            <tr v-if="!loading && filteredAndSortedHardware.length === 0">
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

  <!-- Add Hardware Modal -->
  <div v-if="showModal" class="modal-backdrop fade show"></div>
  <div
    class="modal fade"
    :class="{ 'show d-block': showModal }"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
        <div class="modal-header border-0 pt-4 px-4 pb-3 bg-light">
          <div class="d-flex align-items-center">
            <div
              class="rounded-circle bg-primary bg-opacity-10 p-2 me-3 d-flex align-items-center justify-content-center"
              style="width: 48px; height: 48px"
            >
              <i class="bi bi-box-seam text-primary fs-4"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold text-dark mb-0">
                {{ isEditing ? "System Hardware Details" : "Add New Hardware" }}
              </h5>
              <p class="text-muted small mb-0">
                Manage hardware inventory specifications
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn-close shadow-none"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-4 bg-white">
          <form @submit.prevent="addHardware">
            <!-- Section 1: General Information -->
            <div class="mb-5">
              <div
                class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
              >
                <i class="bi bi-info-circle text-primary me-2 fs-5"></i>
                <h6
                  class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                >
                  General Information
                </h6>
              </div>
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >CKT Item Number</label
                  >
                  <div class="input-group">
                    <span
                      class="input-group-text bg-light border-light-subtle text-muted"
                      >#</span
                    >
                    <input
                      v-model="newHardware.ckt_item_number"
                      type="text"
                      class="form-control rounded-end-3 border-light-subtle shadow-none bg-light"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Hardware Type</label
                  >
                  <input
                    v-model="newHardware.hardware_type"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., Server, Workstation"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Manufacturer</label
                  >
                  <input
                    v-model="newHardware.manufacturer"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., Dell, HP, Apple"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Model</label
                  >
                  <input
                    v-model="newHardware.model"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., Precision T3600"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Serial Number</label
                  >
                  <input
                    v-model="newHardware.serialNumber"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="S/N or Service Tag"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Quantity</label
                  >
                  <input
                    v-model="newHardware.qty"
                    type="number"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Section 2: System Performance -->
            <div class="mb-5">
              <div
                class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
              >
                <i class="bi bi-cpu text-primary me-2 fs-5"></i>
                <h6
                  class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                >
                  System Performance
                </h6>
              </div>
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Processor (CPU)</label
                  >
                  <input
                    v-model="newHardware.processor"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., Intel Xeon E5-1620"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Clock Speed</label
                  >
                  <input
                    v-model="newHardware.processorSpeed"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., 3.60GHz"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Operating System</label
                  >
                  <input
                    v-model="newHardware.operatingSystem"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., Windows 10 Pro"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >RAM (Memory)</label
                  >
                  <input
                    v-model="newHardware.ram"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., 16GB DDR4"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Section 3: Storage & Display -->
            <div class="mb-5">
              <div
                class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
              >
                <i class="bi bi-hdd-network text-primary me-2 fs-5"></i>
                <h6
                  class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                >
                  Storage & Display
                </h6>
              </div>
              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Storage Type</label
                  >
                  <select
                    v-model="newHardware.storageType"
                    class="form-select rounded-3 border-light-subtle shadow-none"
                    required
                  >
                    <option value="" disabled>Select type</option>
                    <option value="SSD">SSD (Solid State Drive)</option>
                    <option value="HDD">HDD (Hard Disk Drive)</option>
                    <option value="NVMe">NVMe SSD</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Capacity</label
                  >
                  <input
                    v-model="newHardware.storageSize"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., 512GB"
                    required
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Screen Size</label
                  >
                  <input
                    v-model="newHardware.screenSize"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., 24 inch"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Section 4: Support & Maintenance -->
            <div class="mb-5 pb-2">
              <div
                class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
              >
                <i class="bi bi-shield-check text-primary me-2 fs-5"></i>
                <h6
                  class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                >
                  Support & Maintenance
                </h6>
              </div>
              <div class="row g-4">
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Warranty Period</label
                  >
                  <input
                    v-model="newHardware.warranty"
                    type="text"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    placeholder="e.g., 1 Year, 3 Years"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold text-muted small mb-1"
                    >Date Last Tested</label
                  >
                  <input
                    v-model="newHardware.dateTested"
                    type="date"
                    class="form-control rounded-3 border-light-subtle shadow-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div
              class="modal-footer border-0 px-0 pb-0 pt-4 bg-light bg-opacity-50 mx-n4 px-4 sticky-bottom"
            >
              <div class="d-flex w-100 gap-3">
                <button
                  type="button"
                  class="btn btn-outline-secondary rounded-pill py-2.5 px-4 fw-bold shadow-none flex-grow-1"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  v-if="!isEditing"
                  type="submit"
                  class="btn btn-primary rounded-pill py-2.5 px-4 fw-bold shadow-sm flex-grow-2"
                >
                  <i class="bi bi-plus-lg me-2"></i>Save Hardware
                </button>
                <!-- <button
                  v-else
                  type="submit"
                  class="btn btn-success rounded-pill py-2.5 px-4 fw-bold shadow-sm flex-grow-2"
                >
                  <i class="bi bi-check2-circle me-2"></i>Update Hardware
                </button> -->
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
