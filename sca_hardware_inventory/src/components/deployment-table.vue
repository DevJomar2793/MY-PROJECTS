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
});

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
    };
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
  };
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
              <div class="mb-5">
                <div
                  class="d-flex align-items-center mb-4 pb-2 border-bottom border-light"
                >
                  <i class="bi bi-person-lines-fill text-primary me-2 fs-5"></i>
                  <h6
                    class="mb-0 fw-bold text-secondary text-uppercase tracking-wider fs-7"
                  >
                    Assignment Details
                  </h6>
                </div>
                <div class="row g-4">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >3 Digit Code</label
                    >
                    <input
                      v-model="newDeployment.emp_3_code"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none bg-light"
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
                      class="form-control rounded-3 border-light-subtle shadow-none"
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
                      class="form-control rounded-3 border-light-subtle shadow-none"
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
                      class="form-control rounded-3 border-light-subtle shadow-none"
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
                      class="form-control rounded-3 border-light-subtle shadow-none"
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
                      class="form-control rounded-3 border-light-subtle shadow-none"
                    />
                  </div>
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
</template>
