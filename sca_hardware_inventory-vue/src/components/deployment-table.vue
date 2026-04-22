<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
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
  tagged_hardware: [],
});

const showTagModal = ref(false);
const availableHardware = ref([]);
const loadingHardware = ref(false);
const selectedHardware = ref([]);
const tagSearchQuery = ref("");
const tagIssuedDate = ref(new Date().toISOString().split("T")[0]);
const tagSortKey = ref("");
const tagSortOrder = ref(1); // 1 for ascending, -1 for descending

const filteredAvailableHardware = computed(() => {
  let result = [...availableHardware.value];

  // 1. Search Filtering
  if (tagSearchQuery.value.trim()) {
    const q = tagSearchQuery.value.toLowerCase().trim();
    result = result.filter((hw) => {
      return (
        (hw.ckt_item_number && hw.ckt_item_number.toLowerCase().includes(q)) ||
        (hw.manufacturer && hw.manufacturer.toLowerCase().includes(q)) ||
        (hw.model && hw.model.toLowerCase().includes(q)) ||
        (hw.hardware_type && hw.hardware_type.toLowerCase().includes(q)) ||
        (hw.serial_number && hw.serial_number.toLowerCase().includes(q))
      );
    });
  }

  // 2. Sorting
  if (tagSortKey.value) {
    result.sort((a, b) => {
      let aVal = a[tagSortKey.value] || "";
      let bVal = b[tagSortKey.value] || "";

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return -1 * tagSortOrder.value;
      if (aVal > bVal) return 1 * tagSortOrder.value;
      return 0;
    });
  }

  return result;
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
    const res = await api.get("api/v1/hardware");
    availableHardware.value = res.data.filter(
      (h) =>
        !h.deployment_id ||
        (currentId.value !== null && h.deployment_id === currentId.value),
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
  const index = newDeployment.value.tagged_hardware.findIndex(
    (h) => h.id === hw.id,
  );
  if (index > -1) {
    newDeployment.value.tagged_hardware.splice(index, 1);
    selectedHardware.value = selectedHardware.value.filter(
      (s) => s.id !== hw.id,
    );
  } else {
    newDeployment.value.tagged_hardware.push({
      id: hw.id,
      issued_date: tagIssuedDate.value,
    });
    selectedHardware.value.push({ ...hw, issued_date: tagIssuedDate.value });
  }
};

const fetchDeployments = async () => {
  loading.value = true;
  try {
    const response = await api.get("api/v1/deployments");
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

const tagSortBy = (key) => {
  if (tagSortKey.value === key) {
    tagSortOrder.value = tagSortOrder.value * -1;
  } else {
    tagSortKey.value = key;
    tagSortOrder.value = 1;
  }
};

const getTagSortIcon = (key) => {
  if (tagSortKey.value !== key)
    return "bi bi-arrow-down-up text-black-50 ms-1 opacity-50";
  return tagSortOrder.value === 1
    ? "bi bi-sort-alpha-down text-primary ms-1 fw-bold"
    : "bi bi-sort-alpha-up text-primary ms-1 fw-bold";
};

// Acknowledgement Receipt Modal
const showReceiptModal = ref(false);
const signatureCanvas = ref(null);
const isDrawing = ref(false);
const signatureDataUrl = ref(null);
const signedDate = ref(null);

const openReceiptModal = () => {
  signatureDataUrl.value = null;
  signedDate.value = null;
  showReceiptModal.value = true;
  nextTick(() => initSignatureCanvas());
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  signatureDataUrl.value = null;
  signedDate.value = null;
};

const initSignatureCanvas = () => {
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = 120;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#1a1a2e";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
};

const getPos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
};

const startDraw = (e) => {
  e.preventDefault();
  isDrawing.value = true;
  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const pos = getPos(e, canvas);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (e) => {
  if (!isDrawing.value) return;
  e.preventDefault();
  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const pos = getPos(e, canvas);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
};

const stopDraw = () => {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  const canvas = signatureCanvas.value;
  signatureDataUrl.value = canvas.toDataURL("image/png");
  signedDate.value = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const clearSignature = () => {
  signatureDataUrl.value = null;
  signedDate.value = null;
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const printReceipt = () => {
  const printWindow = window.open("", "_blank");
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hardwareRows = selectedHardware.value
    .map(
      (hw, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${hw.hardware_type || "-"}</td>
      <td>${hw.qty ?? "-"}</td>
      <td>${hw.issued_date || "-"}</td>
      <td>${hw.price_usd ?? "-"}</td>
    </tr>
  `,
    )
    .join("");

  const sigHtml = signatureDataUrl.value
    ? `<img src="${signatureDataUrl.value}" style="height:70px; display:block; margin:0 auto 4px;" />
       <div style="font-size:10px; color:#555;">Signed on: ${signedDate.value}</div>`
    : ``;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Acknowledgement Receipt - ${newDeployment.value.deployed_to}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 40px; color: #333; }
        h2 { text-align: center; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        h3 { text-align: center; font-size: 13px; color: #555; margin-top: 0; }
        .header-section { text-align: center; margin-bottom: 30px; }
        .info-grid { display: flex; gap: 40px; margin-bottom: 20px; }
        .info-block { flex: 1; }
        .info-block label { font-weight: bold; display: block; font-size: 10px; text-transform: uppercase; color: #777; }
        .info-block span { display: block; font-size: 13px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 30px; }
        th { background: #f0f0f0; padding: 8px; text-align: left; font-size: 11px; border: 1px solid #ddd; }
        td { padding: 7px 8px; border: 1px solid #ddd; font-size: 11px; }
        .signature-section { display: flex; gap: 60px; margin-top: 30px; }
        .signature-block { flex: 1; text-align: center; }
        .signature-line { border-top: 1px solid #333; padding-top: 6px; font-size: 11px; color: #555; }
        .footer-note { margin-top: 40px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header-section">
        <h2>CKT Hardware Inventory System</h2>
        <h3>HARDWARE ACKNOWLEDGEMENT RECEIPT</h3>
        <p style="font-size:11px; color:#777;">Date: ${dateStr}</p>
      </div>

      <div class="info-grid">
        <div class="info-block">
          <label>Employee Name</label>
          <span>${newDeployment.value.deployed_to || "—"}</span>
          <label>3-Digit Code</label>
          <span>${newDeployment.value.emp_3_code || "—"}</span>
        </div>
        <div class="info-block">
          <label>Department</label>
          <span>${newDeployment.value.department || "—"}</span>
          <label>Location</label>
          <span>${newDeployment.value.location || "—"}</span>
        </div>
        <div class="info-block">
          <label>Contact Info</label>
          <span>${newDeployment.value.contact_info || "—"}</span>
          <label>Date Received</label>
          <span>${newDeployment.value.received_date || "—"}</span>
        </div>
      </div>

      <p style="margin-top:16px; font-size:12px;">The following hardware items have been received and are acknowledged by the employee named above:</p>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Hardware Type</th>
            <th>Quantity</th>
            <th>Issued Date</th>
            <th>Initial Value</th>
          </tr>
        </thead>
        <tbody>
          ${hardwareRows || "<tr><td colspan='5' style='text-align:center;'>No equipment tagged.</td></tr>"}
        </tbody>
      </table>

      <p style="font-size:12px;">By Signing this form, I Agree to the following:</p>
      <ul>
        <li>
          I am responsible for the equipment or property issues related
          to me.
        </li>
        <li>I will use it/them in the manner intended.</li>
        <li>
          I will be responsible for any damage done (excluding normal
          wear and tear)
        </li>
        <li>
          Upon separation from the Company, I will return the item(s)
          issued to me in proper working order (excluding normal wear &
          tear).
        </li>
        <li>
          I will replace any items issued to me that are damaged or lost
          at my expense.
        </li>
        <li>
          I authorize a payroll deduction to cover the replacement cost
          of any item issued to me that is not returned for whatever
          reason or is not returned in good condition.
        </li>
      </ul>


      <div class="signature-section" style="margin-top: 16px;">
        <div class="signature-block">
          ${sigHtml}
          <div class="signature-line">Employee Signature / Date</div>
        </div>
        <div class="signature-block">
          <div class="signature-line" style="margin-top: 80px;">Issued By / Authorized Representative / Date</div>
        </div>
      </div>

      <div class="footer-note">CKT Hardware Inventory System &mdash; This is a system-generated document.</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 400);
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
      tagged_hardware: item.hardware_items
        ? item.hardware_items.map((h) => ({
            id: h.id,
            issued_date: h.issued_date,
          }))
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
    tagged_hardware: [],
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
    tagged_hardware: newDeployment.value.tagged_hardware,
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
      await api.post("api/v1/deployments", payload);
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
                  <button
                    v-if="isEditing"
                    type="button"
                    @click="openReceiptModal"
                    class="btn btn-sm btn-outline-success rounded-pill px-3 shadow-sm d-flex align-items-center gap-2 transition-all fw-semibold hover-lift"
                  >
                    <i class="bi bi-file-earmark-check-fill"></i>
                    Acknowledgement Receipt
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
                  <!-- <div class="col-md-6">
                    <label class="form-label fw-semibold text-muted small mb-1"
                      >Location</label
                    >
                    <input
                      v-model="newDeployment.location"
                      type="text"
                      class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary"
                      placeholder="e.g. Office A, Desk 12"
                    />
                  </div> -->
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
                        <th class="border-0 text-muted fw-semibold py-2 fs-7">
                          Issued Date
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
                        <td class="py-2">
                          <span
                            class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1"
                          >
                            {{ hw.issued_date || "—" }}
                          </span>
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
            <!-- Add Issued Date picker -->
            <div class="mb-4">
              <label class="form-label fw-semibold text-muted small mb-1"
                >Issued Date (Applies to newly tagged hardware)</label
              >
              <input
                v-model="tagIssuedDate"
                type="date"
                class="form-control rounded-3 border-light-subtle shadow-none bg-light"
              />
            </div>

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

            <!-- Hardware Location -->
            <div class="col-md-6">
              <label class="form-label fw-semibold text-muted small mb-1"
                >Location</label
              >
              <input
                v-model="newDeployment.location"
                type="text"
                class="form-control rounded-3 border-light-subtle shadow-none focus-ring focus-ring-primary"
                placeholder="e.g. Office or Home"
              />
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
                      @click="tagSortBy('ckt_item_number')"
                      class="border-0 text-muted fw-semibold py-3 fs-6 rounded-start custom-sort-header"
                      style="background-color: var(--secondary-color)"
                    >
                      CKT Item #
                      <i
                        :class="getTagSortIcon('ckt_item_number')"
                        style="font-size: 0.8rem"
                      ></i>
                    </th>
                    <th
                      @click="tagSortBy('manufacturer')"
                      class="border-0 text-muted fw-semibold py-3 fs-6 custom-sort-header"
                      style="background-color: var(--secondary-color)"
                    >
                      Hardware
                      <i
                        :class="getTagSortIcon('manufacturer')"
                        style="font-size: 0.8rem"
                      ></i>
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
                        newDeployment.tagged_hardware.some(
                          (h) => h.id === hw.id,
                        ),
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
                          newDeployment.tagged_hardware.some(
                            (h) => h.id === hw.id,
                          )
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                        "
                        @click="toggleHardwareTag(hw)"
                      >
                        <i
                          class="bi"
                          :class="
                            newDeployment.tagged_hardware.some(
                              (h) => h.id === hw.id,
                            )
                              ? 'bi-check2'
                              : 'bi-plus-lg'
                          "
                        ></i>
                        {{
                          newDeployment.tagged_hardware.some(
                            (h) => h.id === hw.id,
                          )
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
              v-if="
                !loadingHardware &&
                filteredAvailableHardware.length === 0 &&
                tagSearchQuery
              "
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

  <!-- Acknowledgement Receipt Modal -->
  <Transition name="modal-fade">
    <div
      v-if="showReceiptModal"
      class="modal-backdrop show"
      style="z-index: 1080"
      @click="closeReceiptModal"
    ></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="showReceiptModal"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 1090"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable shadow-lg"
        style="max-width: 780px"
      >
        <div class="modal-content border-0 rounded-4 overflow-hidden">
          <div
            class="modal-header border-0 px-4 pt-4 pb-2 d-flex align-items-start"
          >
            <div>
              <h5 class="fw-bold text-dark mb-1">
                <i class="bi bi-file-earmark-check-fill text-success me-2"></i>
                Acknowledgement Receipt Form
              </h5>
              <p class="text-muted small mb-0">
                Hardware receipt for
                <strong>{{ newDeployment.deployed_to || "employee" }}</strong>
              </p>
            </div>
            <button
              type="button"
              class="btn-close ms-auto"
              @click="closeReceiptModal"
            ></button>
          </div>

          <div class="modal-body px-4 pb-2">
            <!-- Receipt Preview -->
            <div class="border rounded-4 p-4 bg-light bg-opacity-50">
              <!-- Header -->
              <div class="text-center mb-4">
                <h6 class="fw-bold text-uppercase mb-0 fs-5">
                  CKT Hardware Inventory System
                </h6>
                <p class="text-muted fw-semibold text-uppercase fs-7 mb-1">
                  Hardware Acknowledgement Receipt
                </p>
                <p class="text-muted small mb-0">
                  Date:
                  {{
                    new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                </p>
              </div>

              <!-- Employee Info -->
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <div class="bg-white rounded-3 p-3 border">
                    <div
                      class="text-muted small fw-semibold text-uppercase mb-1"
                      style="font-size: 10px"
                    >
                      Employee Name
                    </div>
                    <div class="fw-medium">
                      {{ newDeployment.deployed_to || "—" }}
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="bg-white rounded-3 p-3 border">
                    <div
                      class="text-muted small fw-semibold text-uppercase mb-1"
                      style="font-size: 10px"
                    >
                      3-Digit Code
                    </div>
                    <div class="fw-medium">
                      {{ newDeployment.emp_3_code || "—" }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="bg-white rounded-3 p-3 border">
                    <div
                      class="text-muted small fw-semibold text-uppercase mb-1"
                      style="font-size: 10px"
                    >
                      Department
                    </div>
                    <div class="fw-medium">
                      {{ newDeployment.department || "—" }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="bg-white rounded-3 p-3 border">
                    <div
                      class="text-muted small fw-semibold text-uppercase mb-1"
                      style="font-size: 10px"
                    >
                      Date Received
                    </div>
                    <div class="fw-medium">
                      {{ newDeployment.received_date || "—" }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Equipment Table -->
              <div
                class="table-responsive border rounded-3 overflow-hidden mb-4"
              >
                <table class="table table-sm table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th
                        class="py-2 ps-3 text-muted fw-semibold"
                        style="font-size: 11px"
                      >
                        #
                      </th>
                      <th
                        class="py-2 text-muted fw-semibold"
                        style="font-size: 11px"
                      >
                        Hardware Type
                      </th>
                      <th
                        class="py-2 text-muted fw-semibold"
                        style="font-size: 11px"
                      >
                        QTY
                      </th>
                      <th
                        class="py-2 text-muted fw-semibold"
                        style="font-size: 11px"
                      >
                        Issued Date
                      </th>
                      <th
                        class="py-2 pe-3 text-muted fw-semibold"
                        style="font-size: 11px"
                      >
                        Initial Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="selectedHardware.length === 0">
                      <td
                        colspan="5"
                        class="py-4 text-center text-muted fst-italic"
                      >
                        No equipment tagged.
                      </td>
                    </tr>
                    <tr v-for="(hw, i) in selectedHardware" :key="hw.id">
                      <td class="ps-3 py-2 text-muted" style="font-size: 12px">
                        {{ i + 1 }}
                      </td>
                      <td
                        class="py-2 text-primary fw-semibold"
                        style="font-size: 12px"
                      >
                        {{ hw.hardware_type || "-" }}
                      </td>
                      <td class="py-2" style="font-size: 12px">
                        {{ hw.qty ?? "-" }}
                      </td>
                      <td class="py-2" style="font-size: 12px">
                        {{ hw.issued_date || "-" }}
                      </td>
                      <td class="py-2 pe-3 text-muted" style="font-size: 12px">
                        {{ hw.price_usd ?? "-" }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Acknowledgement text -->
              <p class="small text-muted fst-italic mb-4">
                By signing this form, I agree to the following.
              </p>
              <ul>
                <li>
                  I am responsible for the equipment or property issues related
                  to me.
                </li>
                <li>I will use it/them in the manner intended.</li>
                <li>
                  I will be responsible for any damage done (excluding normal
                  wear and tear)
                </li>
                <li>
                  Upon separation from the Company, I will return the item(s)
                  issued to me in proper working order (excluding normal wear &
                  tear).
                </li>
                <li>
                  I will replace any items issued to me that are damaged or lost
                  at my expense.
                </li>
                <li>
                  I authorize a payroll deduction to cover the replacement cost
                  of any item issued to me that is not returned for whatever
                  reason or is not returned in good condition.
                </li>
              </ul>

              <!-- Signature Pad -->
              <div class="mb-3">
                <div
                  class="d-flex align-items-center justify-content-between mb-2"
                >
                  <label
                    class="fw-semibold text-dark small d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-pen text-primary"></i> Employee Signature
                    <span
                      v-if="signedDate"
                      class="badge bg-success-subtle text-success border border-success-subtle rounded-pill ms-1"
                      style="font-size: 10px"
                    >
                      <i class="bi bi-check-circle-fill me-1"></i>Signed on
                      {{ signedDate }}
                    </span>
                  </label>
                  <button
                    type="button"
                    @click="clearSignature"
                    class="btn btn-sm btn-outline-danger rounded-pill px-3 py-0"
                    style="font-size: 11px"
                  >
                    <i class="bi bi-eraser-fill me-1"></i> Clear
                  </button>
                </div>
                <canvas
                  ref="signatureCanvas"
                  class="w-100 rounded-3 border"
                  :class="
                    signatureDataUrl
                      ? 'border-success'
                      : 'border-secondary border-opacity-25'
                  "
                  style="
                    cursor: crosshair;
                    touch-action: none;
                    height: 150px;
                    background: white;
                  "
                  @mousedown="startDraw"
                  @mousemove="draw"
                  @mouseup="stopDraw"
                  @mouseleave="stopDraw"
                  @touchstart="startDraw"
                  @touchmove="draw"
                  @touchend="stopDraw"
                ></canvas>
                <p class="text-muted mt-1" style="font-size: 11px">
                  <i class="bi bi-info-circle me-1"></i>Draw your signature
                  using mouse or touch. The signed date will be recorded
                  automatically.
                </p>
              </div>

              <!-- Authorized Rep Line -->
              <div class="row mt-3">
                <div class="col-6 text-center">
                  <div class="border-top pt-2 mt-2 text-muted small">
                    Employee Signature / Date
                  </div>
                </div>
                <div class="col-6 text-center">
                  <div class="border-top pt-2 mt-2 text-muted small">
                    Issued By / Authorized Representative / Date
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer border-0 px-4 pt-2 pb-4">
            <button
              type="button"
              class="btn btn-outline-secondary rounded-pill px-4 fw-bold"
              @click="closeReceiptModal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-success rounded-pill px-4 fw-bold ms-2 shadow-sm"
              @click="printReceipt"
            >
              <i class="bi bi-printer-fill me-2"></i> Print / Save as PDF
            </button>
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
  transition: background-color 0.2s ease;
}
.custom-sort-header:hover {
  background-color: var(--bs-primary) !important;
  color: white !important;
}
.custom-sort-header:hover i {
  color: white !important;
  opacity: 1 !important;
}
</style>
