<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import api from "../api/axios";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const hardwareItems = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const currentId = ref(null);

const hardwareTypes = [
  { id: 1, label: "Laptop", code: "L" },
  { id: 2, label: "Desktop", code: "D" },
  { id: 3, label: "Monitor", code: "M" },
  { id: 4, label: "Tablet", code: "T" },
  { id: 5, label: "Printer", code: "P" },
  { id: 6, label: "Keyboard", code: "K" },
  { id: 7, label: "Mouse", code: "MOU" },
  { id: 8, label: "Barcode Scanner", code: "BS" },
  { id: 9, label: "External HardDrive", code: "EHD" },
];

const designationOptions = [
  { value: "ASSIGNED (STAFF)", description: "Being used by Team Member" },
  {
    value: "ASSIGNED (COMPANY/STUDENT)",
    description: "Being used by Company/Student",
  },
  { value: "SPARE", description: "Backup or Spare" },
  {
    value: "RE-SELL (FOR SALE)",
    description: "For sale at regular price (good item)",
  },
  {
    value: "FOR SALE (CHEAP)",
    description: "For sale at cheap price (not good item)",
  },
  { value: "SCRAP", description: "Scrap" },
  { value: "SOLD", description: "SOLD" },
];

// Modal & Form State
const showModal = ref(false);
const zoomedImage = ref(null);
const selectedFiles = ref([]);
const imagePreviews = ref([]);
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
  dateReceived: new Date().toISOString().split("T")[0],
  deliveredBy: "",
  dateTested: new Date().toISOString().split("T")[0],
  designation: "",
  deployment_id: null,
  images: [],
  price_usd: "",
  price_php: "",
  notes: "",
});

// CKT generation is now handled in openModal to trigger instantly on "Add" click

// Exchange rate
const exchangeRate = ref(null);
const rateLastUpdated = ref("");
const rateLoading = ref(false);

const fetchExchangeRate = async () => {
  rateLoading.value = true;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    exchangeRate.value = data.rates?.PHP ?? null;
    if (data.time_last_update_utc) {
      rateLastUpdated.value = new Date(
        data.time_last_update_utc,
      ).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    exchangeRate.value = null;
  } finally {
    rateLoading.value = false;
  }
};

// Auto-convert USD → PHP when USD input changes
watch(
  () => newHardware.value.price_usd,
  (val) => {
    if (exchangeRate.value && val !== "" && val !== null) {
      newHardware.value.price_php = (
        parseFloat(val) * exchangeRate.value
      ).toFixed(2);
    }
  },
);

const fetchHardware = async () => {
  loading.value = true;
  try {
    const response = await api.get("/hardware");
    hardwareItems.value = response.data;
  } catch (error) {
    console.error("Error fetching hardware:", error);
    // Swal.fire({
    //   icon: "error",
    //   title: "Error",
    //   text: "Failed to load hardware inventory.",
    // });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHardware();
  fetchExchangeRate();
});

const openModal = (item = null) => {
  // Ensure we check if 'item' is a valid hardware object and not a PointerEvent from the click
  if (item && item.id !== undefined && !(item instanceof Event)) {
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
      dateReceived:
        item.date_received || new Date().toISOString().split("T")[0],
      deliveredBy: item.delivered_by || "",
      dateTested: item.date_tested,
      designation: item.designation || "",
      deployment_id: item.deployment_id,
      images: item.images ? item.images.map((img) => img.image_path) : [],
      price_usd: item.price_usd ?? "",
      price_php: item.price_php ?? "",
      notes: item.notes ?? "",
    };
    imagePreviews.value = item.images
      ? item.images.map((img) => `http://localhost:8000${img.image_path}`)
      : [];
    selectedFiles.value = []; // Prevent re-uploading existing if they are just editing text
  } else {
    isEditing.value = false;
    currentId.value = null;
    resetForm();

    // Auto-generate CKT number instantly on click
    const maxId =
      hardwareItems.value.length > 0
        ? Math.max(...hardwareItems.value.map((i) => Number(i.id) || 0))
        : 0;
    const nextId = maxId + 1;
    const paddedId = String(nextId).padStart(4, "0");
    newHardware.value.ckt_item_number = `CKT - ${paddedId}`;
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
    dateReceived: new Date().toISOString().split("T")[0],
    deliveredBy: "",
    dateTested: new Date().toISOString().split("T")[0],
    designation: "",
    deployment_id: null,
    images: [],
    price_usd: "",
    price_php: "",
    notes: "",
  };
  selectedFiles.value = [];
  imagePreviews.value = [];
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    selectedFiles.value.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  });
};

const zoomImage = (src) => {
  zoomedImage.value = src;
};

const closeZoom = () => {
  zoomedImage.value = null;
};

const removeImage = async (index) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to remove this image.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, remove it!",
  });

  if (!result.isConfirmed) {
    return;
  }

  // If it's a blob (newly added), revoke it
  if (imagePreviews.value[index].startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviews.value[index]);
  }
  imagePreviews.value.splice(index, 1);

  // If it's a new file, remove from selectedFiles
  if (selectedFiles.value.length >= index + 1) {
    selectedFiles.value.splice(index, 1);
  }

  if (newHardware.value.images && newHardware.value.images.length > index) {
    newHardware.value.images.splice(index, 1);
  }
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

  // Handle Image Upload First
  let uploadedPaths = [...(newHardware.value.images || [])];
  if (selectedFiles.value.length > 0) {
    const formData = new FormData();
    selectedFiles.value.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedPaths = [...uploadedPaths, ...uploadRes.data.file_paths];
    } catch (uploadError) {
      console.error("Image upload failed", uploadError);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "Failed to upload images.",
      });
      return;
    }
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
    date_received: newHardware.value.dateReceived,
    delivered_by: newHardware.value.deliveredBy,
    date_tested: newHardware.value.dateTested,
    designation: newHardware.value.designation || "SPARE", // Use selected or default
    deployment_id: newHardware.value.deployment_id,
    images: uploadedPaths,
    price_usd:
      newHardware.value.price_usd !== ""
        ? parseFloat(newHardware.value.price_usd)
        : null,
    price_php:
      newHardware.value.price_php !== ""
        ? parseFloat(newHardware.value.price_php)
        : null,
    notes: newHardware.value.notes || null,
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

const deleteHardware = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the hardware item and its uploaded images. You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/hardware/${currentId.value}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Hardware has been permanently deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
      closeModal();
      fetchHardware(); // Refresh the list
    } catch (error) {
      console.error("Error deleting hardware:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.detail || "Could not delete hardware data.",
      });
    }
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
        @click="openModal()"
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
  <Transition name="modal-fade">
    <div v-if="showModal" class="modal-backdrop show"></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="showModal"
      class="modal d-block"
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
                  {{
                    isEditing ? "System Hardware Details" : "Add New Hardware"
                  }}
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
                        readonly
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Hardware Type</label
                    >
                    <select
                      v-model="newHardware.hardware_type"
                      class="form-select rounded-3 border-light-subtle shadow-none"
                      required
                    >
                      <option value="" disabled>Select type</option>
                      <option
                        v-for="type in hardwareTypes"
                        :key="type.id"
                        :value="type.label"
                      >
                        {{ type.label }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Hardware Designation</label
                    >
                    <select
                      v-model="newHardware.designation"
                      class="form-select rounded-3 border-light-subtle shadow-none"
                      required
                    >
                      <option value="" disabled>Select designation</option>
                      <option
                        v-for="opt in designationOptions"
                        :key="opt.value"
                        :value="opt.value"
                      >
                        {{ opt.value }} ({{ opt.description }})
                      </option>
                    </select>
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

              <!-- Section 5: Logistics & Delivery -->
              <div class="mb-5 pb-2">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i class="bi bi-truck text-primary me-2 fs-5"></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Logistics & Delivery
                  </h6>
                </div>
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Date of Arrival / Received</label
                    >
                    <input
                      v-model="newHardware.dateReceived"
                      type="date"
                      class="form-control rounded-3 border-light-subtle shadow-none"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Delivered By</label
                    >
                    <input
                      v-model="newHardware.deliveredBy"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none"
                      placeholder="e.g., Courier Name, IT Staff"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 6: Pricing & Notes -->
              <div class="mb-5 pb-2">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i class="bi bi-currency-exchange text-primary me-2 fs-5"></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Pricing &amp; Notes
                  </h6>
                </div>

                <!-- Exchange Rate Banner -->
                <div class="mb-4">
                  <div
                    class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 border"
                    :class="
                      exchangeRate
                        ? 'bg-success bg-opacity-10 border-success border-opacity-25'
                        : 'bg-light border-light-subtle'
                    "
                  >
                    <span
                      v-if="rateLoading"
                      class="spinner-border spinner-border-sm text-success"
                      role="status"
                    ></span>
                    <i
                      v-else-if="exchangeRate"
                      class="bi bi-graph-up-arrow text-success"
                    ></i>
                    <i v-else class="bi bi-wifi-off text-muted"></i>
                    <span v-if="rateLoading" class="text-muted small"
                      >Fetching today's rate…</span
                    >
                    <span
                      v-else-if="exchangeRate"
                      class="small fw-semibold text-success"
                    >
                      1 USD = <strong>₱{{ exchangeRate.toFixed(4) }}</strong>
                      <span
                        v-if="rateLastUpdated"
                        class="fw-normal text-muted ms-2"
                        >· Updated {{ rateLastUpdated }}</span
                      >
                    </span>
                    <span v-else class="text-muted small"
                      >Exchange rate unavailable — enter PHP manually</span
                    >
                  </div>
                </div>

                <div class="row g-4">
                  <!-- USD Price -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Price (USD $)</label
                    >
                    <div class="input-group">
                      <span
                        class="input-group-text bg-light border-light-subtle text-muted fw-bold"
                        >$</span
                      >
                      <input
                        v-model="newHardware.price_usd"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control rounded-end-3 border-light-subtle shadow-none"
                        placeholder="e.g., 499.99"
                      />
                    </div>
                    <div
                      v-if="exchangeRate && newHardware.price_usd"
                      class="text-muted small mt-1 ms-1"
                    >
                      <i class="bi bi-arrow-right-short"></i> Auto-converts to
                      PHP below
                    </div>
                  </div>

                  <!-- PHP Price -->
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1">
                      Price (PHP ₱)
                      <span
                        v-if="exchangeRate && newHardware.price_usd"
                        class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 ms-1 fw-normal rounded-pill px-2"
                        style="font-size: 0.65rem"
                        >auto-filled</span
                      >
                    </label>
                    <div class="input-group">
                      <span
                        class="input-group-text bg-light border-light-subtle text-muted fw-bold"
                        >₱</span
                      >
                      <input
                        v-model="newHardware.price_php"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control rounded-end-3 border-light-subtle shadow-none"
                        placeholder="e.g., 28,500.00"
                      />
                    </div>
                    <div class="text-muted small mt-1 ms-1">
                      You can also type this value directly.
                    </div>
                  </div>

                  <!-- Notes -->
                  <div class="col-12">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Notes</label
                    >
                    <textarea
                      v-model="newHardware.notes"
                      rows="3"
                      class="form-control rounded-3 border-light-subtle shadow-none"
                      placeholder="e.g., Purchased from Vendor X. Has a scratch on the bottom. Needs OS reinstall."
                      style="resize: vertical; min-height: 80px"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Section 7: Media & Images -->

              <div class="mb-5 pb-2">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i class="bi bi-images text-primary me-2 fs-5"></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Hardware Images
                  </h6>
                </div>
                <div class="row g-4">
                  <div class="col-12">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Upload Photos</label
                    >
                    <div
                      class="position-relative text-center p-4 border border-2 border-dashed rounded-4 bg-light border-light-subtle mb-3 transition-opacity hover-upload-box"
                    >
                      <i
                        class="bi bi-cloud-arrow-up display-6 text-primary mb-2 opacity-75"
                      ></i>
                      <h6 class="fw-semibold text-dark mb-1">
                        Click or Drop images here
                      </h6>
                      <p class="text-muted small mb-0">
                        JPEG, PNG, or WebP formats
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        class="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                        @change="handleFileUpload"
                        style="cursor: pointer"
                      />
                    </div>

                    <!-- Image Previews -->
                    <div
                      v-if="imagePreviews.length > 0"
                      class="d-flex gap-3 overflow-x-auto pb-2 mt-3 p-3 bg-white rounded-4 border border-light-subtle shadow-sm custom-scrollbar"
                    >
                      <div
                        v-for="(preview, index) in imagePreviews"
                        :key="index"
                        class="position-relative flex-shrink-0 overflow-hidden rounded-4 shadow-sm border border-light preview-card cursor-pointer"
                        style="width: 120px; height: 120px"
                        @click="zoomImage(preview)"
                      >
                        <img
                          :src="preview"
                          class="w-100 h-100 object-fit-cover preview-img transition-transform"
                        />
                        <div
                          class="position-absolute w-100 h-100 top-0 start-0 bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center preview-overlay px-2 text-center pointer-events-none"
                        >
                          <i class="bi bi-zoom-in text-white fs-3"></i>
                        </div>
                        <!-- Delete Button -->
                        <button
                          type="button"
                          @click.stop="removeImage(index)"
                          class="btn btn-danger position-absolute rounded-circle shadow p-0 d-flex align-items-center justify-content-center remove-btn"
                          style="
                            top: 6px;
                            right: 6px;
                            width: 24px;
                            height: 24px;
                            z-index: 5;
                            background: rgba(220, 53, 69, 0.95);
                            border: 2px solid white;
                          "
                        >
                          <i
                            class="bi bi-x"
                            style="font-size: 1.1rem; margin-top: 1px"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="modal-footer border-0 px-0 pb-0 pt-4 bg-light bg-opacity-50 mx-n4 px-4 sticky-bottom"
              >
                <div class="d-flex w-100 gap-3">
                  <button
                    v-if="isEditing"
                    type="button"
                    class="btn btn-outline-danger rounded-pill py-2.5 px-4 fw-bold shadow-none flex-grow-1"
                    @click="deleteHardware"
                  >
                    <i class="bi bi-trash3 me-2"></i>Delete
                  </button>
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
                  <button
                    v-else
                    type="submit"
                    class="btn btn-success rounded-pill py-2.5 px-4 fw-bold shadow-sm flex-grow-2"
                  >
                    <i class="bi bi-check2-circle me-2"></i>Update Hardware
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Image Zoom Lightbox -->
  <Transition name="modal-fade">
    <div
      v-if="zoomedImage"
      class="modal-backdrop show"
      style="z-index: 1060"
      @click="closeZoom"
    ></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="zoomedImage"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 1070"
      @click.self="closeZoom"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-xl"
        style="max-width: 90vw"
        @click.self="closeZoom"
      >
        <div class="modal-content bg-transparent border-0 shadow-none">
          <div class="modal-body text-center p-0 position-relative">
            <button
              type="button"
              class="btn-close btn-close-white position-absolute shadow-none bg-dark p-2 rounded-circle"
              style="
                top: -20px;
                right: -20px;
                filter: invert(1) grayscale(100%) brightness(200%);
                opacity: 0.8;
              "
              @click="closeZoom"
              aria-label="Close"
            ></button>
            <img
              :src="zoomedImage"
              class="img-fluid rounded-4 shadow-lg object-fit-contain bg-dark"
              style="
                max-height: 85vh;
                width: auto;
                max-width: 100%;
                border: 2px solid rgba(255, 255, 255, 0.1);
              "
            />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.table-responsive {
  max-height: 60vh;
  overflow-y: auto;
}
thead th {
  position: sticky;
  top: 0;
  z-index: 1;
}
.custom-sort-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.custom-sort-header:hover {
  background-color: var(--bs-primary) !important;
  color: white !important;
}
.custom-sort-header:hover i {
  color: white !important;
  opacity: 1 !important;
}
/* Modal Fade for Backdrop */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal Window Animation */
.modal-window-enter-active,
.modal-window-leave-active {
  transition: opacity 0.3s ease;
}
.modal-window-enter-active .modal-dialog {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-window-leave-active .modal-dialog {
  transition: transform 0.3s ease-in;
}

.modal-window-enter-from,
.modal-window-leave-to {
  opacity: 0;
}
.modal-window-enter-from .modal-dialog,
.modal-window-leave-to .modal-dialog {
  transform: translateY(-50px) scale(0.9);
}

/* Upload UI Styles */
.border-dashed {
  border-style: dashed !important;
}
.cursor-pointer {
  cursor: pointer !important;
}
.hover-upload-box:hover {
  background-color: var(--bs-secondary-bg) !important;
  border-color: var(--bs-primary) !important;
}

/* Preview Card Styles */
.preview-img {
  transition: transform 0.3s ease;
}
.preview-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}
.preview-card:hover .preview-overlay {
  opacity: 1;
}
.preview-card:hover .preview-img {
  transform: scale(1.1);
}

/* Custom Scrollbar for modern gallery */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--bs-light);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
