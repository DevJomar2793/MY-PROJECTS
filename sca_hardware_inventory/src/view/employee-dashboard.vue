<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const loading = ref(true);
const deployments = ref([]);
const user = ref(JSON.parse(localStorage.getItem("ckt_emp_user") || "{}"));

// Modal State
const showReceiptModal = ref(false);
const activeDeployment = ref(null);
const signatureDataUrl = ref("");
const signedDate = ref("");
const signatureCanvas = ref(null);
let isDrawing = false;

const fetchData = async () => {
  const token = localStorage.getItem("ckt_emp_token");
  if (!token) {
    router.push("/employee/login");
    return;
  }
  try {
    const res = await api.get("/employee/deployments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    deployments.value = res.data;
  } catch (e) {
    if (e.response?.status === 401) {
      router.push("/employee/login");
    }
    console.error("Failed to load employee deployments:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleLogout = () => {
  localStorage.removeItem("ckt_emp_token");
  localStorage.removeItem("ckt_emp_user");
  router.push("/");
};

// Receipt Logic
const openReceiptModal = async (dep) => {
  activeDeployment.value = dep;
  showReceiptModal.value = true;
  signedDate.value = null;
  signatureDataUrl.value = null;
  await nextTick();
  // initialize canvas
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

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  activeDeployment.value = null;
};

const getPos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
};

const startDraw = (e) => {
  e.preventDefault();
  isDrawing = true;
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const pos = getPos(e, canvas);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (e) => {
  if (!isDrawing) return;
  e.preventDefault();
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const pos = getPos(e, canvas);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
};

const stopDraw = () => {
  if (!isDrawing) return;
  isDrawing = false;
  const canvas = signatureCanvas.value;
  if (!canvas) return;
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
  if (!activeDeployment.value) return;
  const printWindow = window.open("", "_blank");
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hwList = activeDeployment.value.hardware_items || [];
  const hardwareRows = hwList
    .map(
      (hw, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${hw.hardware_type || "-"}</td>
      <td>${hw.qty ?? "-"}</td>
      <td>${hw.issued_date || "-"}</td>
      <td>${hw.price_usd ?? "-"}</td>
    </tr>
  `
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
      <title>Acknowledgement Receipt - ${activeDeployment.value.deployed_to}</title>
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
          <span>${activeDeployment.value.deployed_to || "—"}</span>
          <label>3-Digit Code</label>
          <span>${activeDeployment.value.emp_3_code || "—"}</span>
        </div>
        <div class="info-block">
          <label>Department</label>
          <span>${activeDeployment.value.department || "—"}</span>
          <label>Location</label>
          <span>${activeDeployment.value.location || "—"}</span>
        </div>
        <div class="info-block">
          <label>Contact Info</label>
          <span>${activeDeployment.value.contact_info || "—"}</span>
          <label>Date Received</label>
          <span>${activeDeployment.value.received_date || "—"}</span>
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
        <li>I am responsible for the equipment or property issues related to me.</li>
        <li>I will use it/them in the manner intended.</li>
        <li>I will be responsible for any damage done (excluding normal wear and tear)</li>
        <li>Upon separation from the Company, I will return the item(s) issued to me in proper working order (excluding normal wear & tear).</li>
        <li>I will replace any items issued to me that are damaged or lost at my expense.</li>
        <li>I authorize a payroll deduction to cover the replacement cost of any item issued to me that is not returned for whatever reason or is not returned in good condition.</li>
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
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

</script>

<template>
  <div class="min-vh-100 bg-light d-flex flex-column">

    <!-- Header -->
    <nav class="navbar navbar-expand-lg border-bottom" style="background: linear-gradient(135deg, #083344, #0e7490);">
      <div class="container-fluid px-4 py-2">
        <a class="navbar-brand text-white d-flex align-items-center gap-2" href="#">
          <i class="bi bi-person-badge-fill fs-4"></i>
          <span class="fw-bold">CKT Employee Portal</span>
        </a>
        <div class="d-flex align-items-center gap-3">
          <div class="text-white-50 small d-none d-md-block">
            Signed in as <span class="text-white fw-semibold">{{ user.username }}</span>
          </div>
          <button @click="handleLogout" class="btn btn-sm btn-outline-light rounded-pill px-3">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-5 flex-grow-1">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">My Dashboard</h2>
          <p class="text-muted mb-0">View your assigned hardware and deployment receipts.</p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-info" role="status"></div>
        <p class="text-muted mt-2 small">Loading deployments...</p>
      </div>

      <div v-else-if="deployments.length === 0" class="text-center py-5">
        <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3" style="width: 80px; height: 80px;">
          <i class="bi bi-box-seam fs-1 text-muted"></i>
        </div>
        <h5 class="fw-bold text-dark">No Deployments Found</h5>
        <p class="text-muted small">You currently have no hardware assigned to your account.</p>
      </div>

      <!-- Deployments List -->
      <div v-else class="row g-4">
        <div class="col-12 col-xl-6" v-for="dep in deployments" :key="dep.id">
          <div class="card border-0 rounded-4 shadow-sm h-100">
            <div class="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
              <div>
                <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-2 py-1 mb-2">
                  <i class="bi bi-calendar-event me-1"></i>{{ dep.received_date || 'N/A' }}
                </span>
                <h5 class="fw-bold text-dark mb-0">{{ dep.department }} Department</h5>
                <p class="text-muted small mb-0">{{ dep.location }} &bull; Assigned to: {{ dep.deployed_to }}</p>
              </div>
            </div>

            <div class="card-body px-4 pt-3">
              <h6 class="fw-semibold text-dark fs-7 mb-3">Assigned Hardware Items</h6>
              
              <div v-if="dep.hardware_items && dep.hardware_items.length > 0" class="table-responsive border rounded-3 overflow-hidden mb-4">
                <table class="table table-sm table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="py-2 ps-3 text-muted fw-semibold" style="font-size: 11px">Type</th>
                      <th class="py-2 text-muted fw-semibold" style="font-size: 11px">Model</th>
                      <th class="py-2 text-muted fw-semibold" style="font-size: 11px">S/N</th>
                      <th class="py-2 text-muted fw-semibold pe-3 text-end" style="font-size: 11px">Issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hw in dep.hardware_items" :key="hw.id">
                      <td class="ps-3 py-2 text-dark fw-medium" style="font-size: 12px">{{ hw.hardware_type }}</td>
                      <td class="py-2 text-muted" style="font-size: 12px">{{ hw.manufacturer }} {{ hw.model }}</td>
                      <td class="py-2 text-muted" style="font-size: 12px">{{ hw.serial_number }}</td>
                      <td class="py-2 pe-3 text-muted text-end" style="font-size: 12px">{{ hw.issued_date || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="bg-light rounded-3 p-3 text-center mb-4">
                <span class="text-muted small fst-italic">No equipment tagged to this deployment yet.</span>
              </div>
            </div>

            <div class="card-footer bg-white border-top-0 px-4 pb-4 pt-0 text-end">
              <button
                class="btn rounded-pill px-4 fw-bold shadow-sm"
                :class="(dep.hardware_items && dep.hardware_items.length > 0) ? 'btn-info text-white' : 'btn-secondary text-white opacity-50'"
                :disabled="!dep.hardware_items || dep.hardware_items.length === 0"
                @click="openReceiptModal(dep)"
              >
                <i class="bi bi-file-earmark-check-fill me-2"></i> Acknowledgement Receipt
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Receipt Modal -->
    <Transition name="fade">
      <div v-if="showReceiptModal" class="modal-backdrop fade show" style="z-index: 1040"></div>
    </Transition>

    <Transition name="zoom">
      <div
        v-if="showReceiptModal"
        class="modal fade show d-block"
        tabindex="-1"
        style="z-index: 1045"
        @click.self="closeReceiptModal"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable shadow-lg"
          style="max-width: 780px"
        >
          <div class="modal-content border-0 rounded-4 overflow-hidden">
            <div class="modal-header border-0 px-4 pt-4 pb-2 d-flex align-items-start">
              <div>
                <h5 class="fw-bold text-dark mb-1">
                  <i class="bi bi-file-earmark-check-fill text-info me-2"></i>
                  Acknowledgement Receipt Form
                </h5>
                <p class="text-muted small mb-0">
                  Hardware receipt for
                  <strong>{{ activeDeployment?.deployed_to }}</strong>
                </p>
              </div>
              <button
                type="button"
                class="btn-close ms-auto"
                @click="closeReceiptModal"
              ></button>
            </div>

            <div class="modal-body px-4 pb-2" v-if="activeDeployment">
              <!-- Receipt Preview -->
              <div class="border rounded-4 p-4 bg-light bg-opacity-50">
                <div class="text-center mb-4">
                  <h6 class="fw-bold text-uppercase mb-0 fs-5">CKT Hardware Inventory System</h6>
                  <p class="text-muted fw-semibold text-uppercase fs-7 mb-1">Hardware Acknowledgement Receipt</p>
                  <p class="text-muted small mb-0">
                    Date: {{ new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }}
                  </p>
                </div>

                <!-- Employee Info -->
                <div class="row g-3 mb-4">
                  <div class="col-md-4">
                    <div class="bg-white rounded-3 p-3 border">
                      <div class="text-muted small fw-semibold text-uppercase mb-1" style="font-size: 10px">Employee Name</div>
                      <div class="fw-medium">{{ activeDeployment.deployed_to || "—" }}</div>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="bg-white rounded-3 p-3 border">
                      <div class="text-muted small fw-semibold text-uppercase mb-1" style="font-size: 10px">3-Digit Code</div>
                      <div class="fw-medium">{{ activeDeployment.emp_3_code || "—" }}</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="bg-white rounded-3 p-3 border">
                      <div class="text-muted small fw-semibold text-uppercase mb-1" style="font-size: 10px">Department</div>
                      <div class="fw-medium">{{ activeDeployment.department || "—" }}</div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="bg-white rounded-3 p-3 border">
                      <div class="text-muted small fw-semibold text-uppercase mb-1" style="font-size: 10px">Date Received</div>
                      <div class="fw-medium">{{ activeDeployment.received_date || "—" }}</div>
                    </div>
                  </div>
                </div>

                <!-- Equipment Table -->
                <div class="table-responsive border rounded-3 overflow-hidden mb-4">
                  <table class="table table-sm table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="py-2 ps-3 text-muted fw-semibold" style="font-size: 11px">#</th>
                        <th class="py-2 text-muted fw-semibold" style="font-size: 11px">Hardware Type</th>
                        <th class="py-2 text-muted fw-semibold" style="font-size: 11px">QTY</th>
                        <th class="py-2 text-muted fw-semibold" style="font-size: 11px">Issued Date</th>
                        <th class="py-2 pe-3 text-muted fw-semibold" style="font-size: 11px">Initial Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!activeDeployment.hardware_items || activeDeployment.hardware_items.length === 0">
                        <td colspan="5" class="py-4 text-center text-muted fst-italic">No equipment tagged.</td>
                      </tr>
                      <tr v-for="(hw, i) in activeDeployment.hardware_items" :key="hw.id">
                        <td class="ps-3 py-2 text-muted" style="font-size: 12px">{{ i + 1 }}</td>
                        <td class="py-2 text-info fw-semibold" style="font-size: 12px">{{ hw.hardware_type || "-" }}</td>
                        <td class="py-2" style="font-size: 12px">{{ hw.qty ?? "-" }}</td>
                        <td class="py-2" style="font-size: 12px">{{ hw.issued_date || "-" }}</td>
                        <td class="py-2 pe-3 text-muted" style="font-size: 12px">{{ hw.price_usd ?? "-" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p class="small text-muted fst-italic mb-4">By signing this form, I agree to the following.</p>
                <ul>
                  <li>I am responsible for the equipment or property issues related to me.</li>
                  <li>I will use it/them in the manner intended.</li>
                  <li>I will be responsible for any damage done (excluding normal wear and tear)</li>
                  <li>Upon separation from the Company, I will return the item(s) issued to me in proper working order (excluding normal wear & tear).</li>
                  <li>I will replace any items issued to me that are damaged or lost at my expense.</li>
                  <li>I authorize a payroll deduction to cover the replacement cost of any item issued to me that is not returned for whatever reason or is not returned in good condition.</li>
                </ul>

                <!-- Signature Pad -->
                <div class="mb-3">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <label class="fw-semibold text-dark small d-flex align-items-center gap-2">
                      <i class="bi bi-pen text-info"></i> Employee Signature
                      <span v-if="signedDate" class="badge bg-success-subtle text-success border border-success-subtle rounded-pill ms-1" style="font-size: 10px">
                        <i class="bi bi-check-circle-fill me-1"></i>Signed on {{ signedDate }}
                      </span>
                    </label>
                    <button type="button" @click="clearSignature" class="btn btn-sm btn-outline-danger rounded-pill px-3 py-0" style="font-size: 11px">
                      <i class="bi bi-eraser-fill me-1"></i> Clear
                    </button>
                  </div>
                  <canvas
                    ref="signatureCanvas"
                    class="w-100 rounded-3 border"
                    :class="signatureDataUrl ? 'border-success' : 'border-secondary border-opacity-25'"
                    style="cursor: crosshair; touch-action: none; height: 150px; background: white;"
                    @mousedown="startDraw"
                    @mousemove="draw"
                    @mouseup="stopDraw"
                    @mouseleave="stopDraw"
                    @touchstart="startDraw"
                    @touchmove="draw"
                    @touchend="stopDraw"
                  ></canvas>
                  <p class="text-muted mt-1" style="font-size: 11px">
                    <i class="bi bi-info-circle me-1"></i>Draw your signature using mouse or touch.
                  </p>
                </div>

                <div class="row mt-3">
                  <div class="col-6 text-center">
                    <div class="border-top pt-2 mt-2 text-muted small">Employee Signature / Date</div>
                  </div>
                  <div class="col-6 text-center">
                    <div class="border-top pt-2 mt-2 text-muted small">Issued By / Authorized Representative / Date</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer border-0 px-4 pt-2 pb-4">
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4 fw-bold" @click="closeReceiptModal">Close</button>
              <button type="button" class="btn btn-info text-white rounded-pill px-4 fw-bold ms-2 shadow-sm" @click="printReceipt">
                <i class="bi bi-printer-fill me-2"></i> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.modal-dialog {
  transition: transform 0.2s ease-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.2s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
