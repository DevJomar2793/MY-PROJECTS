<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import Swal from "sweetalert2";

const searchQuery = ref("");
const sortKey = ref("");
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const deployments = ref([]);
const loading = ref(false);

const isEditing = ref(false);
const currentId = ref(null);
const showModal = ref(false);

const newDeployment = ref({
  emp_3_code: "",
  deployed_to: "",
  location: "",
  department: "",
  contact_info: "",
  received_date: new Date().toISOString().split("T")[0],
  hardware_ids: [],
});

const showTagModal = ref(false);
const availableHardware = ref([]);
const loadingHardware = ref(false);
const selectedHardware = ref([]);
const tagSearchQuery = ref("");

const filteredAvailableHardware = computed(() => {
  if (!tagSearchQuery.value.trim()) return availableHardware.value;
  const q = tagSearchQuery.value.toLowerCase().trim();
  return availableHardware.value.filter((hw) => {
    return (
      (hw.ckt_item_number && hw.ckt_item_number.toLowerCase().includes(q)) ||
      (hw.manufacturer && hw.manufacturer.toLowerCase().includes(q)) ||
      (hw.model && hw.model.toLowerCase().includes(q)) ||
      (hw.hardware_type && hw.hardware_type.toLowerCase().includes(q)) ||
      (hw.serial_number && hw.serial_number.toLowerCase().includes(q))
    );
  });
});

const showHardwareDetailsModal = ref(false);
const selectedHardwareDetails = ref(null);

const openHardwareDetails = (hw) => {
  selectedHardwareDetails.value = hw;
  showHardwareDetailsModal.value = true;
};

const closeHardwareDetails = () => {
  showHardwareDetailsModal.value = false;
  selectedHardwareDetails.value = null;
};

const openTagModal = async () => {
  loadingHardware.value = true;
  showTagModal.value = true;
  try {
    const res = await api.get("/hardware");
    availableHardware.value = res.data.filter(
      (h) =>
        h.designation === "Available" ||
        (h.deployment_id === currentId.value && currentId.value !== null),
    );
  } catch (e) {
    console.error("Error fetching hardware:", e);
  } finally {
    loadingHardware.value = false;
  }
};

const closeTagModal = () => {
  showTagModal.value = false;
  tagSearchQuery.value = "";
};

const toggleHardwareTag = (hw) => {
  const index = newDeployment.value.hardware_ids.indexOf(hw.id);
  if (index > -1) {
    newDeployment.value.hardware_ids.splice(index, 1);
    selectedHardware.value = selectedHardware.value.filter(
      (s) => s.id !== hw.id,
    );
  } else {
    newDeployment.value.hardware_ids.push(hw.id);
    selectedHardware.value.push(hw);
  }
};

const fetchDeployments = async () => {
  loading.value = true;
  try {
    const response = await api.get("/deployments");
    deployments.value = response.data;
  } catch (error) {
    console.error("Error fetching deployments:", error);
    // Swal.fire({
    //   icon: "error",
    //   title: "Error",
    //   text: "Failed to load deployment data.",
    // });
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
        (item.emp_3_code && item.emp_3_code.toLowerCase().includes(q)) ||
        (item.deployed_to && item.deployed_to.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.contact_info && item.contact_info.toLowerCase().includes(q))
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

const openModal = (item = null) => {
  if (item && item.id !== undefined && !(item instanceof Event)) {
    isEditing.value = true;
    currentId.value = item.id;
    newDeployment.value = {
      emp_3_code: item.emp_3_code,
      deployed_to: item.deployed_to,
      location: item.location,
      department: item.department,
      contact_info: item.contact_info || "",
      received_date: item.received_date,
      hardware_ids: item.hardware_items
        ? item.hardware_items.map((h) => h.id)
        : [],
    };
    selectedHardware.value = item.hardware_items
      ? [...item.hardware_items]
      : [];
  } else {
    isEditing.value = false;
    currentId.value = null;
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  newDeployment.value = {
    emp_3_code: "",
    deployed_to: "",
    location: "",
    department: "",
    contact_info: "",
    received_date: new Date().toISOString().split("T")[0],
    hardware_ids: [],
  };
  selectedHardware.value = [];
};

const saveDeployment = async () => {
  if (!newDeployment.value.emp_3_code || !newDeployment.value.deployed_to) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all required fields (Code and Name)!",
    });
    return;
  }

  const payload = {
    emp_3_code: newDeployment.value.emp_3_code,
    deployed_to: newDeployment.value.deployed_to,
    location: newDeployment.value.location,
    department: newDeployment.value.department,
    contact_info: newDeployment.value.contact_info,
    received_date: newDeployment.value.received_date,
    hardware_ids: newDeployment.value.hardware_ids,
  };

  try {
    if (isEditing.value) {
      await api.put(`/deployments/${currentId.value}`, payload);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Deployment details successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await api.post("/deployments", payload);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "New employee deployment added.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
    closeModal();
    fetchDeployments();
  } catch (error) {
    console.error("Error saving deployment:", error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: error.response?.data?.detail || "Could not save deployment data.",
    });
  }
};
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
        <span class="fw-bold">Add Employee</span>
      </button>
    </div>
    <div class="card-body p-4 pt-2">
      <div class="table-responsive">
        <table class="table table-hover align-middle border-bottom mb-0">
          <thead>
            <tr>
              <th
                @click="sortBy('emp_3_code')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                3 Digit Code
                <i
                  :class="getSortIcon('emp_3_code')"
                  style="font-size: 0.8rem"
                ></i>
              </th>
              <th
                @click="sortBy('deployed_to')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Deployed To
                <i
                  :class="getSortIcon('deployed_to')"
                  style="font-size: 0.8rem"
                ></i>
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
                @click="sortBy('department')"
                class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Department
                <i
                  :class="getSortIcon('department')"
                  style="font-size: 0.8rem"
                ></i>
              </th>

              <th
                @click="sortBy('received_date')"
                class="border-0 text-muted fw-semibold py-3 fs-6 rounded-end custom-sort-header"
                style="background-color: var(--secondary-color)"
              >
                Hired Date
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
                <div
                  class="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                ></div>
                Loading deployments...
              </td>
            </tr>
            <tr
              v-else
              v-for="item in filteredAndSortedDeployments"
              :key="item.id"
            >
              <td class="py-3 text-muted">
                <button
                  @click="openModal(item)"
                  class="btn btn-link p-0 text-decoration-none fw-semibold text-primary"
                >
                  {{ item.emp_3_code }}
                </button>
              </td>
              <td class="py-3">
                <div class="d-flex align-items-center">
                  <img
                    :src="
                      'https://ui-avatars.com/api/?name=' +
                      (item.deployed_to || 'User').replace(/ /g, '+') +
                      '&background=random'
                    "
                    class="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <span class="fw-medium text-dark">{{
                    item.deployed_to
                  }}</span>
                </div>
              </td>
              <td class="py-3 text-muted">{{ item.location }}</td>
              <td class="py-3 text-dark fw-bold">{{ item.department }}</td>
              <!-- <td class="py-3 text-muted small">{{ item.history || "N/A" }}</td> -->
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

  <!-- Add Employee Modal -->
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
                <i class="bi bi-person-badge text-primary fs-4"></i>
              </div>
              <div>
                <h5 class="modal-title fw-bold text-dark mb-0">
                  {{
                    isEditing ? "Edit Deployment Details" : "Add New Employee"
                  }}
                </h5>
                <p class="text-muted small mb-0">
                  Manage deployment and location information
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
            <form @submit.prevent="saveDeployment">
              <!-- Assignment Details -->
              <div class="mb-5 pb-2">
                <div
                  class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <div class="d-flex align-items-center">
                    <i
                      class="bi bi-person-lines-fill text-primary me-2 fs-5"
                    ></i>
                    <h6
                      class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                    >
                      Assignment Details
                    </h6>
                  </div>
                  <button
                    type="button"
                    @click="openTagModal"
                    class="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm d-flex align-items-center gap-2 transition-all fw-semibold hover-lift"
                  >
                    <i class="bi bi-tags-fill"></i> Tag Equipment
                  </button>
                </div>

                <div class="row g-4">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >3 Digit Code</label
                    >
                    <input
                      v-model="newDeployment.emp_3_code"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary bg-light"
                      placeholder="e.g. 123"
                      required
                    />
                  </div>
                  <div class="col-md-8">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Deployed To (Name)</label
                    >
                    <input
                      v-model="newDeployment.deployed_to"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Location</label
                    >
                    <input
                      v-model="newDeployment.location"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary"
                      placeholder="e.g. Office A, Desk 12"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Department</label
                    >
                    <input
                      v-model="newDeployment.department"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary"
                      placeholder="e.g. IT, HR, Marketing"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Contact Info</label
                    >
                    <input
                      v-model="newDeployment.contact_info"
                      type="tel"
                      maxlength="11"
                      minlength="11"
                      pattern="[0-9]{11}"
                      required
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary bg-light"
                      placeholder="e.g. 09123456789"
                    />
                  </div>
                </div>
              </div>

              <!-- Extra Information -->
              <div class="mb-5 pb-2">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i class="bi bi-calendar-check text-primary me-2 fs-5"></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Timeline & History
                  </h6>
                </div>
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Hired Date</label
                    >
                    <input
                      v-model="newDeployment.received_date"
                      type="date"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary bg-light"
                    />
                  </div>
                </div>
              </div>

              <!-- Tagged Display -->
              <div class="mb-5 pb-2">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i
                    class="bi bi-bookmark-plus-fill text-primary me-2 fs-5"
                  ></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Tagged Equipment
                  </h6>
                </div>
                <div
                  v-if="selectedHardware.length > 0"
                  class="table-responsive mb-4 border rounded-3 overflow-hidden shadow-sm"
                >
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th
                          class="border-0 text-muted fw-semibold py-2 fs-7 ps-3"
                        >
                          CKT Item #
                        </th>
                        <th class="border-0 text-muted fw-semibold py-2 fs-7">
                          Equipment Details
                        </th>
                        <th
                          class="border-0 text-muted fw-semibold py-2 fs-7 text-center pe-3"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="hw in selectedHardware"
                        :key="hw.id"
                        class="cursor-pointer transition-all hover-lift-row"
                        @click="openHardwareDetails(hw)"
                      >
                        <td class="py-2 ps-3 text-primary fw-semibold fs-7">
                          <i class="bi bi-display me-1"></i
                          >{{ hw.ckt_item_number }}
                        </td>
                        <td class="py-2">
                          <div class="fw-medium text-dark fs-7">
                            {{ hw.manufacturer }} {{ hw.model }}
                          </div>
                          <div
                            class="text-muted small"
                            style="font-size: 0.75rem"
                          >
                            {{ hw.hardware_type }} &bull; S/N:
                            {{ hw.serial_number }}
                          </div>
                        </td>
                        <td class="py-2 text-center pe-3" @click.stop>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger rounded-circle p-0 shadow-none transition-all d-inline-flex align-items-center justify-content-center"
                            style="width: 24px; height: 24px"
                            @click="toggleHardwareTag(hw)"
                            title="Remove assignment"
                          >
                            <i
                              class="bi bi-x-lg"
                              style="font-size: 0.75rem"
                            ></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Footer Buttons -->
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
                    <i class="bi bi-plus-lg me-2"></i>Save Deployment
                  </button>
                  <button
                    v-else
                    type="submit"
                    class="btn btn-success rounded-pill py-2.5 px-4 fw-bold shadow-sm flex-grow-2"
                  >
                    <i class="bi bi-check2-circle me-2"></i>Update Deployment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Tag Equipment Sub-Modal -->
  <Transition name="modal-fade">
    <div
      v-if="showTagModal"
      class="modal-backdrop show"
      style="z-index: 1060"
      @click="closeTagModal"
    ></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="showTagModal"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 1070"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header border-0 pt-4 px-4 pb-3 bg-light">
            <h5
              class="modal-title fw-bold text-dark mb-0 d-flex align-items-center gap-2"
            >
              <i class="bi bi-pc-display text-primary"></i> Tag Hardware
            </h5>
            <button
              type="button"
              class="btn-close shadow-none"
              @click="closeTagModal"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="modal-body p-4 bg-white custom-scrollbar"
            style="max-height: 50vh"
          >
            <!-- Search Hardware -->
            <div class="mb-4">
              <div
                class="d-flex align-items-center px-3 py-2 border rounded-3 bg-light"
              >
                <i class="bi bi-search text-muted me-2"></i>
                <input
                  v-model="tagSearchQuery"
                  type="text"
                  class="form-control form-control-sm border-0 bg-transparent p-0 shadow-none text-dark"
                  placeholder="Search by Item #, Model, S/N..."
                />
                <button 
                  v-if="tagSearchQuery" 
                  @click="tagSearchQuery = ''"
                  class="btn btn-link p-0 text-muted ms-2 shadow-none"
                >
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

            <div v-if="loadingHardware" class="text-center py-4 text-muted">
              <div
                class="spinner-border spinner-border-sm text-primary me-2"
                role="status"
              ></div>
              Loading hardware...
            </div>
            <div
              v-else-if="availableHardware.length === 0"
              class="text-center py-4 text-muted"
            >
              <i class="bi bi-hdd-network d-block fs-3 mb-2 opacity-50"></i>
              No available hardware to tag.
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle border-bottom mb-0">
                <thead>
                  <tr>
                    <th
                      class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start"
                      style="background-color: var(--secondary-color)"
                    >
                      CKT Item #
                    </th>
                    <th
                      class="border-0 text-muted fw-semibold py-3 fs-6"
                      style="background-color: var(--secondary-color)"
                    >
                      Hardware
                    </th>
                    <th
                      class="border-0 text-muted fw-semibold py-3 fs-6 rounded-end text-center"
                      style="background-color: var(--secondary-color)"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="hw in filteredAvailableHardware"
                    :key="hw.id"
                    class="cursor-pointer transition-all hover-lift-row"
                    :class="{
                      'table-primary bg-primary bg-opacity-10':
                        newDeployment.hardware_ids.includes(hw.id),
                    }"
                    @click="openHardwareDetails(hw)"
                  >
                    <td class="py-3 text-primary fw-semibold">
                      {{ hw.ckt_item_number }}
                    </td>
                    <td class="py-3">
                      <div class="fw-medium text-dark">
                        {{ hw.manufacturer }} {{ hw.model }}
                      </div>
                      <div class="text-muted small">
                        {{ hw.hardware_type }} &bull; S/N:
                        {{ hw.serial_number }}
                      </div>
                    </td>
                    <td class="py-3 text-center" @click.stop>
                      <button
                        type="button"
                        class="btn btn-sm rounded-pill fw-bold pt-1 pb-1 px-3 shadow-none transition-all"
                        :class="
                          newDeployment.hardware_ids.includes(hw.id)
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        "
                        @click="toggleHardwareTag(hw)"
                      >
                        <i
                          class="bi"
                          :class="
                            newDeployment.hardware_ids.includes(hw.id)
                              ? 'bi-check2'
                              : 'bi-plus-lg'
                          "
                        ></i>
                        {{
                          newDeployment.hardware_ids.includes(hw.id)
                            ? "Tagged"
                            : "Tag"
                        }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div 
              v-if="!loadingHardware && filteredAvailableHardware.length === 0 && tagSearchQuery" 
              class="text-center py-5 text-muted"
            >
              <i class="bi bi-search d-block fs-3 mb-2 opacity-50"></i>
              No hardware matching "{{ tagSearchQuery }}"
            </div>
          </div>
          <div class="modal-footer border-0 bg-light p-3">
            <button
              type="button"
              class="btn btn-primary rounded-pill px-4 fw-bold w-100 shadow-sm"
              @click="closeTagModal"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Hardware Details Sub-Modal -->
  <Transition name="modal-fade">
    <div
      v-if="showHardwareDetailsModal"
      class="modal-backdrop show"
      style="z-index: 1080"
      @click="closeHardwareDetails"
    ></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="showHardwareDetailsModal"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 1090"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
      >
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header border-0 pt-4 px-4 pb-3 bg-light">
            <h5
              class="modal-title fw-bold text-dark mb-0 d-flex align-items-center gap-2"
            >
              <i class="bi bi-info-circle text-primary"></i> Hardware Details
            </h5>
            <button
              type="button"
              class="btn-close shadow-none"
              @click="closeHardwareDetails"
              aria-label="Close"
            ></button>
          </div>
          <div
            class="modal-body p-4 bg-white custom-scrollbar"
            style="max-height: 70vh"
          >
            <div v-if="selectedHardwareDetails" class="row g-4">
              <div class="col-12">
                <div
                  class="d-flex justify-content-between align-items-center border-bottom border-light pb-3"
                >
                  <div>
                    <h4 class="fw-bold mb-1">
                      {{ selectedHardwareDetails.ckt_item_number }}
                    </h4>
                    <span
                      class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3"
                      >{{
                        selectedHardwareDetails.designation || "Available"
                      }}</span
                    >
                  </div>
                  <div class="text-end">
                    <h5 class="fw-semibold text-dark mb-0">
                      {{ selectedHardwareDetails.manufacturer }}
                      {{ selectedHardwareDetails.model }}
                    </h5>
                    <p class="text-muted small mb-0">
                      {{ selectedHardwareDetails.hardware_type }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <h6
                  class="text-muted fw-bold text-uppercase fs-7 mb-3 tracking-wider"
                >
                  <i class="bi bi-cpu me-2"></i>System Specs
                </h6>
                <div
                  class="bg-light bg-opacity-50 p-3 rounded-4 border border-light-subtle h-100"
                >
                  <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">Processor:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.processor
                      }}</span>
                    </li>
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">RAM:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.ram
                      }}</span>
                    </li>
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">Storage:</span>
                      <span class="fw-medium text-dark text-end ms-3"
                        >{{ selectedHardwareDetails.storage }} ({{
                          selectedHardwareDetails.storage_type
                        }})</span
                      >
                    </li>
                    <li class="d-flex justify-content-between pb-1">
                      <span class="text-muted">OS:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.operating_system
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="col-md-6">
                <h6
                  class="text-muted fw-bold text-uppercase fs-7 mb-3 tracking-wider"
                >
                  <i class="bi bi-info-square me-2"></i>Additional Info
                </h6>
                <div
                  class="bg-light bg-opacity-50 p-3 rounded-4 border border-light-subtle h-100"
                >
                  <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">Serial Number:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.serial_number
                      }}</span>
                    </li>
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">Warranty:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.warranty
                      }}</span>
                    </li>
                    <li
                      class="d-flex justify-content-between border-bottom border-light pb-2"
                    >
                      <span class="text-muted">Date Received:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.date_received || "N/A"
                      }}</span>
                    </li>
                    <li class="d-flex justify-content-between pb-1">
                      <span class="text-muted">Date Tested:</span>
                      <span class="fw-medium text-dark text-end ms-3">{{
                        selectedHardwareDetails.date_tested || "N/A"
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                class="col-12"
                v-if="
                  selectedHardwareDetails.images &&
                  selectedHardwareDetails.images.length > 0
                "
              >
                <h6
                  class="text-muted fw-bold text-uppercase fs-7 mb-3 tracking-wider mt-2"
                >
                  <i class="bi bi-images me-2"></i>Photos
                </h6>
                <div class="d-flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  <img
                    v-for="img in selectedHardwareDetails.images"
                    :key="img.id"
                    :src="'http://localhost:8000' + img.image_path"
                    class="rounded-4 border border-light-subtle object-fit-cover shadow-sm"
                    style="width: 140px; height: 100px"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 bg-light p-3">
            <button
              type="button"
              class="btn btn-outline-primary rounded-pill px-4 fw-bold w-100 shadow-sm"
              @click="closeHardwareDetails"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.cursor-pointer {
  cursor: pointer !important;
}

.hover-lift {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
}

.hover-lift-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 10;
  position: relative;
}

/* Custom Scrollbar for inner modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
