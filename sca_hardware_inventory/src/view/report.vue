<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import Sidebar from "../components/sidebar.vue";
import Navbar from "../components/navbar.vue";
import Footer from "../components/footer.vue";

// ─── State ──────────────────────────────────────────────────
const loading = ref(false);
const summary = ref(null);
const searchQuery = ref("");
const activeTab = ref("overview"); // 'overview' | 'employees' | 'hardware-types' | 'designations'
const selectedEmployee = ref(null);

// ─── Fetch Summary ──────────────────────────────────────────
const fetchSummary = async () => {
  loading.value = true;
  try {
    const res = await api.get("/reports/summary");
    summary.value = res.data;
  } catch (e) {
    console.error("Error fetching report:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSummary);

// ─── Computed ───────────────────────────────────────────────
const designationList = computed(() => {
  if (!summary.value) return [];
  return Object.entries(summary.value.designation_breakdown)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
});

const typeList = computed(() => {
  if (!summary.value) return [];
  return Object.entries(summary.value.type_breakdown)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
});

const deptList = computed(() => {
  if (!summary.value) return [];
  return Object.entries(summary.value.department_breakdown)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
});

const filteredEmployees = computed(() => {
  if (!summary.value) return [];
  const q = searchQuery.value.toLowerCase().trim();
  return summary.value.employee_list.filter((e) =>
    !q ||
    e.deployed_to?.toLowerCase().includes(q) ||
    e.emp_3_code?.toLowerCase().includes(q) ||
    e.department?.toLowerCase().includes(q)
  );
});

const deploymentRate = computed(() => {
  if (!summary.value || summary.value.total_items === 0) return 0;
  return Math.round((summary.value.total_deployed / summary.value.total_items) * 100);
});

// ─── Chart helpers ──────────────────────────────────────────
const maxCount = (list) => Math.max(...list.map((i) => i.count), 1);

const barWidth = (count, list) =>
  Math.round((count / maxCount(list)) * 100);

// ─── Designation color map ──────────────────────────────────
const designationColor = (label) => {
  const map = {
    "SPARE": "bg-info-subtle text-info border-info",
    "ASSIGNED (STAFF)": "bg-primary-subtle text-primary border-primary",
    "ASSIGNED (COMPANY/STUDENT)": "bg-success-subtle text-success border-success",
    "SOLD": "bg-danger-subtle text-danger border-danger",
    "SCRAP": "bg-secondary-subtle text-secondary border-secondary",
    "For sale at regular price (good item)": "bg-warning-subtle text-warning border-warning",
    "For sale at cheap price (not good item)": "bg-orange-subtle text-warning border-warning",
    "Backup or Spare": "bg-info-subtle text-info border-info",
  };
  return map[label] || "bg-light text-muted border-secondary";
};

const barColor = (index) => {
  const colors = [
    "bg-primary", "bg-success", "bg-info", "bg-warning", "bg-danger",
    "bg-secondary", "bg-dark", "bg-primary opacity-75"
  ];
  return colors[index % colors.length];
};

// ─── Export helpers ──────────────────────────────────────────
const exportCSV = () => {
  if (!summary.value) return;
  const rows = [
    ["CKT Employee Report", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
    [],
    ["EMPLOYEE DEPLOYMENT SUMMARY"],
    ["3-Code", "Employee Name", "Department", "Location", "Contact", "Date Received", "# Items", "CKT Items"],
  ];
  summary.value.employee_list.forEach((e) => {
    rows.push([
      e.emp_3_code,
      e.deployed_to,
      e.department,
      e.location,
      e.contact_info,
      e.received_date,
      e.hardware_count,
      e.hardware_items.map((h) => h.ckt_item_number).join(" | "),
    ]);
  });
  rows.push([]);
  rows.push(["DESIGNATION BREAKDOWN"]);
  rows.push(["Designation", "Count"]);
  designationList.value.forEach((d) => rows.push([d.label, d.count]));
  rows.push([]);
  rows.push(["HARDWARE TYPE BREAKDOWN"]);
  rows.push(["Type", "Count"]);
  typeList.value.forEach((t) => rows.push([t.label, t.count]));

  const csvContent = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CKT_Hardware_Report_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const openEmployeeDetail = (emp) => {
  selectedEmployee.value = emp;
};

const closeEmployeeDetail = () => {
  selectedEmployee.value = null;
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <Sidebar />
      <main class="col-md-10 ms-sm-auto px-4 py-4">
        <Navbar />

        <!-- Page Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 class="fw-bold text-dark mb-1">
              <i class="bi bi-bar-chart-fill text-primary me-2"></i>Reports &amp; Analytics
            </h4>
            <p class="text-muted small mb-0">Inventory overview based on live database data</p>
          </div>
          <div class="d-flex gap-2">
            <button @click="fetchSummary" class="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold">
              <i class="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
            <button @click="exportCSV" class="btn btn-sm btn-success rounded-pill px-3 fw-semibold shadow-sm">
              <i class="bi bi-download me-1"></i> Export CSV
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-3">Loading report data...</p>
        </div>

        <div v-else-if="summary">

          <!-- ── KPI Cards ────────────────────────────────── -->
          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <div class="card border-0 rounded-4 shadow-sm h-100 p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 bg-primary bg-opacity-10 p-3">
                    <i class="bi bi-hdd-stack-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <div class="text-muted small fw-semibold text-uppercase" style="font-size:10px;">Total Items</div>
                    <div class="fw-bold fs-3 text-dark">{{ summary.total_items }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 rounded-4 shadow-sm h-100 p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 bg-success bg-opacity-10 p-3">
                    <i class="bi bi-person-check-fill text-success fs-4"></i>
                  </div>
                  <div>
                    <div class="text-muted small fw-semibold text-uppercase" style="font-size:10px;">Deployed Items</div>
                    <div class="fw-bold fs-3 text-success">{{ summary.total_deployed }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 rounded-4 shadow-sm h-100 p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 bg-warning bg-opacity-10 p-3">
                    <i class="bi bi-archive-fill text-warning fs-4"></i>
                  </div>
                  <div>
                    <div class="text-muted small fw-semibold text-uppercase" style="font-size:10px;">Undeployed</div>
                    <div class="fw-bold fs-3 text-warning">{{ summary.total_undeployed }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card border-0 rounded-4 shadow-sm h-100 p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="rounded-3 bg-info bg-opacity-10 p-3">
                    <i class="bi bi-people-fill text-info fs-4"></i>
                  </div>
                  <div>
                    <div class="text-muted small fw-semibold text-uppercase" style="font-size:10px;">Total Employees</div>
                    <div class="fw-bold fs-3 text-info">{{ summary.total_deployments }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Deployment Rate Banner -->
          <div class="card border-0 rounded-4 shadow-sm mb-4 p-3">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="fw-semibold text-dark">Overall Deployment Rate</span>
              <span class="fw-bold text-primary fs-5">{{ deploymentRate }}%</span>
            </div>
            <div class="progress rounded-pill" style="height: 10px;">
              <div
                class="progress-bar bg-primary rounded-pill"
                :style="{ width: deploymentRate + '%' }"
                role="progressbar"
              ></div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small class="text-muted">{{ summary.total_deployed }} deployed</small>
              <small class="text-muted">{{ summary.total_undeployed }} available</small>
            </div>
          </div>

          <!-- ── Tabs ──────────────────────────────────────── -->
          <ul class="nav nav-pills gap-2 mb-4">
            <li class="nav-item">
              <button
                class="nav-link rounded-pill px-4 fw-semibold"
                :class="activeTab === 'overview' ? 'active' : 'text-muted'"
                @click="activeTab = 'overview'"
              >
                <i class="bi bi-pie-chart-fill me-1"></i> Overview
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link rounded-pill px-4 fw-semibold"
                :class="activeTab === 'employees' ? 'active' : 'text-muted'"
                @click="activeTab = 'employees'"
              >
                <i class="bi bi-people-fill me-1"></i> By Employee
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link rounded-pill px-4 fw-semibold"
                :class="activeTab === 'hardware-types' ? 'active' : 'text-muted'"
                @click="activeTab = 'hardware-types'"
              >
                <i class="bi bi-cpu-fill me-1"></i> By Hardware Type
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link rounded-pill px-4 fw-semibold"
                :class="activeTab === 'designations' ? 'active' : 'text-muted'"
                @click="activeTab = 'designations'"
              >
                <i class="bi bi-tags-fill me-1"></i> By Designation
              </button>
            </li>
          </ul>

          <!-- ── Tab: Overview ─────────────────────────────── -->
          <div v-if="activeTab === 'overview'" class="row g-4">

            <!-- Designation Breakdown Card -->
            <div class="col-md-6">
              <div class="card border-0 rounded-4 shadow-sm h-100">
                <div class="card-header bg-white border-0 pt-4 pb-2 px-4">
                  <h6 class="fw-bold mb-0"><i class="bi bi-tags-fill text-primary me-2"></i>Designation Breakdown</h6>
                </div>
                <div class="card-body px-4 pb-4">
                  <div v-for="(item, i) in designationList" :key="item.label" class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small fw-medium text-dark" style="font-size:12px;">{{ item.label }}</span>
                      <span class="badge rounded-pill px-2" :class="barColor(i)" style="font-size:10px;">{{ item.count }}</span>
                    </div>
                    <div class="progress rounded-pill" style="height:7px;">
                      <div
                        class="progress-bar rounded-pill"
                        :class="barColor(i)"
                        :style="{ width: barWidth(item.count, designationList) + '%' }"
                        role="progressbar"
                      ></div>
                    </div>
                  </div>
                  <div v-if="designationList.length === 0" class="text-center text-muted py-3">No data available</div>
                </div>
              </div>
            </div>

            <!-- Hardware Type Breakdown Card -->
            <div class="col-md-6">
              <div class="card border-0 rounded-4 shadow-sm h-100">
                <div class="card-header bg-white border-0 pt-4 pb-2 px-4">
                  <h6 class="fw-bold mb-0"><i class="bi bi-cpu-fill text-info me-2"></i>Hardware Type Breakdown</h6>
                </div>
                <div class="card-body px-4 pb-4">
                  <div v-for="(item, i) in typeList" :key="item.label" class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small fw-medium text-dark" style="font-size:12px;">{{ item.label }}</span>
                      <span class="badge rounded-pill px-2 bg-info text-dark" style="font-size:10px;">{{ item.count }}</span>
                    </div>
                    <div class="progress rounded-pill" style="height:7px;">
                      <div
                        class="progress-bar rounded-pill bg-info"
                        :style="{ width: barWidth(item.count, typeList) + '%' }"
                        role="progressbar"
                      ></div>
                    </div>
                  </div>
                  <div v-if="typeList.length === 0" class="text-center text-muted py-3">No data available</div>
                </div>
              </div>
            </div>

            <!-- Department Breakdown -->
            <div class="col-12">
              <div class="card border-0 rounded-4 shadow-sm">
                <div class="card-header bg-white border-0 pt-4 pb-2 px-4">
                  <h6 class="fw-bold mb-0"><i class="bi bi-building-fill text-success me-2"></i>Hardware Assigned by Department</h6>
                </div>
                <div class="card-body px-4 pb-4">
                  <div class="row g-3">
                    <div v-for="(item, i) in deptList" :key="item.label" class="col-md-4">
                      <div class="bg-light rounded-3 p-3 d-flex align-items-center justify-content-between border">
                        <div>
                          <div class="fw-semibold text-dark small">{{ item.label }}</div>
                          <div class="text-muted" style="font-size:11px;">{{ item.count }} hardware item{{ item.count !== 1 ? 's' : '' }}</div>
                        </div>
                        <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" :class="barColor(i)" style="width:36px;height:36px;font-size:13px;">
                          {{ item.count }}
                        </div>
                      </div>
                    </div>
                    <div v-if="deptList.length === 0" class="text-center text-muted py-3">No department data available</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ── Tab: By Employee ──────────────────────────── -->
          <div v-if="activeTab === 'employees'">
            <div class="card border-0 rounded-4 shadow-sm">
              <div class="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Deployment by Employee</h6>
                <div class="d-flex align-items-center px-3 py-1" style="background-color:#f8f9fa; border-radius: 20px; width: 250px;">
                  <i class="bi bi-search text-muted me-2"></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="form-control border-0 shadow-none p-0 bg-transparent"
                    placeholder="Search employee..."
                    style="font-size: 13px;"
                  />
                </div>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th class="border-0 text-muted fw-semibold py-3 ps-4" style="background:#f8f9fa;">3-Code</th>
                        <th class="border-0 text-muted fw-semibold py-3" style="background:#f8f9fa;">Employee Name</th>
                        <th class="border-0 text-muted fw-semibold py-3" style="background:#f8f9fa;">Department</th>
                        <th class="border-0 text-muted fw-semibold py-3" style="background:#f8f9fa;">Location</th>
                        <th class="border-0 text-muted fw-semibold py-3" style="background:#f8f9fa;">Date Received</th>
                        <th class="border-0 text-muted fw-semibold py-3 text-center" style="background:#f8f9fa;"># Items</th>
                        <th class="border-0 text-muted fw-semibold py-3 pe-4 text-center" style="background:#f8f9fa;">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="filteredEmployees.length === 0">
                        <td colspan="7" class="text-center text-muted py-5 fst-italic">No employees found.</td>
                      </tr>
                      <tr v-for="emp in filteredEmployees" :key="emp.id">
                        <td class="ps-4 py-3">
                          <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3">{{ emp.emp_3_code }}</span>
                        </td>
                        <td class="py-3">
                          <div class="d-flex align-items-center gap-2">
                            <img
                              :src="'https://ui-avatars.com/api/?name=' + (emp.deployed_to || 'U').replace(/ /g, '+') + '&background=random&size=32'"
                              class="rounded-circle"
                              width="32"
                              height="32"
                            />
                            <span class="fw-medium text-dark">{{ emp.deployed_to }}</span>
                          </div>
                        </td>
                        <td class="py-3 text-muted">{{ emp.department || "—" }}</td>
                        <td class="py-3 text-muted">{{ emp.location || "—" }}</td>
                        <td class="py-3 text-muted">{{ emp.received_date || "—" }}</td>
                        <td class="py-3 text-center">
                          <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 fw-semibold">
                            {{ emp.hardware_count }}
                          </span>
                        </td>
                        <td class="py-3 pe-4 text-center">
                          <button
                            class="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-none"
                            @click="openEmployeeDetail(emp)"
                          >
                            <i class="bi bi-eye-fill me-1"></i>View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Tab: By Hardware Type ─────────────────────── -->
          <div v-if="activeTab === 'hardware-types'">
            <div class="card border-0 rounded-4 shadow-sm">
              <div class="card-header bg-white border-0 pt-4 pb-3 px-4">
                <h6 class="fw-bold mb-0"><i class="bi bi-cpu-fill text-info me-2"></i>Hardware Type Summary</h6>
              </div>
              <div class="card-body px-4 pb-4">
                <div class="row g-3">
                  <div v-for="(item, i) in typeList" :key="item.label" class="col-md-4">
                    <div class="card border-0 rounded-4 shadow-sm p-4 h-100">
                      <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="rounded-3 p-2" :class="barColor(i)" style="opacity:0.9">
                          <i class="bi bi-hdd-rack-fill text-white fs-5"></i>
                        </div>
                        <span class="fw-bold fs-2 text-dark">{{ item.count }}</span>
                      </div>
                      <div class="fw-semibold text-dark">{{ item.label }}</div>
                      <div class="text-muted small">hardware item{{ item.count !== 1 ? 's' : '' }}</div>
                      <div class="progress rounded-pill mt-3" style="height:5px;">
                        <div
                          class="progress-bar rounded-pill"
                          :class="barColor(i)"
                          :style="{ width: barWidth(item.count, typeList) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="typeList.length === 0" class="text-center text-muted py-4">No data available</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Tab: By Designation ───────────────────────── -->
          <div v-if="activeTab === 'designations'">
            <div class="card border-0 rounded-4 shadow-sm">
              <div class="card-header bg-white border-0 pt-4 pb-3 px-4">
                <h6 class="fw-bold mb-0"><i class="bi bi-tags-fill text-primary me-2"></i>Designation Status Summary</h6>
              </div>
              <div class="card-body px-4 pb-4">
                <div class="row g-3">
                  <div v-for="(item, i) in designationList" :key="item.label" class="col-md-4">
                    <div class="card border-0 rounded-4 shadow-sm p-4 h-100">
                      <div class="d-flex align-items-center justify-content-between mb-3">
                        <span
                          class="badge rounded-pill px-3 py-2 fw-semibold border border-opacity-25 small"
                          :class="designationColor(item.label)"
                        >
                          {{ item.label }}
                        </span>
                        <span class="fw-bold fs-2 text-dark">{{ item.count }}</span>
                      </div>
                      <div class="text-muted small">{{ item.count }} item{{ item.count !== 1 ? 's' : '' }} with this status</div>
                      <div class="progress rounded-pill mt-3" style="height:5px;">
                        <div
                          class="progress-bar rounded-pill"
                          :class="barColor(i)"
                          :style="{ width: barWidth(item.count, designationList) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="designationList.length === 0" class="text-center text-muted py-4">No data available</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- No data fallback -->
        <div v-else class="text-center py-5 text-muted">
          <i class="bi bi-exclamation-triangle fs-1"></i>
          <p class="mt-3">Could not load report data. Make sure the backend is running.</p>
        </div>

        <Footer />
      </main>
    </div>
  </div>

  <!-- Employee Detail Modal -->
  <Transition name="modal-fade">
    <div
      v-if="selectedEmployee"
      class="modal-backdrop show"
      style="z-index: 1050"
      @click="closeEmployeeDetail"
    ></div>
  </Transition>
  <Transition name="modal-window">
    <div
      v-if="selectedEmployee"
      class="modal d-block"
      tabindex="-1"
      style="z-index: 1060"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable shadow-lg">
        <div class="modal-content border-0 rounded-4 overflow-hidden">
          <div class="modal-header border-0 px-4 pt-4 pb-2 bg-light">
            <div>
              <h5 class="fw-bold text-dark mb-1">
                <i class="bi bi-person-badge-fill text-primary me-2"></i>
                {{ selectedEmployee.deployed_to }}
              </h5>
              <p class="text-muted small mb-0">
                Code: <strong>{{ selectedEmployee.emp_3_code }}</strong> &bull;
                {{ selectedEmployee.department }} &bull; {{ selectedEmployee.location }}
              </p>
            </div>
            <button type="button" class="btn-close ms-auto" @click="closeEmployeeDetail"></button>
          </div>
          <div class="modal-body px-4 pb-4">
            <!-- Info row -->
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="bg-light rounded-3 p-3 border">
                  <div class="text-muted small text-uppercase fw-semibold" style="font-size:10px;">Contact</div>
                  <div class="fw-medium">{{ selectedEmployee.contact_info || "—" }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="bg-light rounded-3 p-3 border">
                  <div class="text-muted small text-uppercase fw-semibold" style="font-size:10px;">Date Received</div>
                  <div class="fw-medium">{{ selectedEmployee.received_date || "—" }}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="bg-light rounded-3 p-3 border">
                  <div class="text-muted small text-uppercase fw-semibold" style="font-size:10px;">Total Items</div>
                  <div class="fw-bold fs-4 text-primary">{{ selectedEmployee.hardware_count }}</div>
                </div>
              </div>
            </div>

            <!-- Hardware list -->
            <h6 class="fw-bold text-secondary mb-3 text-uppercase" style="font-size:11px;">
              <i class="bi bi-hdd-stack me-1"></i>Assigned Hardware
            </h6>
            <div v-if="selectedEmployee.hardware_items.length === 0" class="text-muted fst-italic text-center py-3">No items assigned.</div>
            <div class="table-responsive border rounded-3 overflow-hidden">
              <table v-if="selectedEmployee.hardware_items.length > 0" class="table table-sm table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="py-2 ps-3 text-muted fw-semibold" style="font-size:11px;">CKT Item #</th>
                    <th class="py-2 text-muted fw-semibold" style="font-size:11px;">Hardware Type</th>
                    <th class="py-2 text-muted fw-semibold" style="font-size:11px;">Manufacturer / Model</th>
                    <th class="py-2 pe-3 text-muted fw-semibold" style="font-size:11px;">S/N</th>
                    <th class="py-2 pe-3 text-muted fw-semibold" style="font-size:11px;">Designation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hw in selectedEmployee.hardware_items" :key="hw.ckt_item_number">
                    <td class="ps-3 py-2 text-primary fw-semibold" style="font-size:12px;">{{ hw.ckt_item_number }}</td>
                    <td class="py-2" style="font-size:12px;">{{ hw.hardware_type }}</td>
                    <td class="py-2 text-muted" style="font-size:12px;">{{ hw.manufacturer }} {{ hw.model }}</td>
                    <td class="pe-3 py-2 text-muted" style="font-size:12px;">{{ hw.serial_number }}</td>
                    <td class="pe-3 py-2" style="font-size:12px;">
                      <span class="badge rounded-pill px-2 bg-primary-subtle text-primary border border-primary-subtle">{{ hw.designation || "—" }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer border-0 px-4 pb-4">
            <button class="btn btn-outline-secondary rounded-pill px-4 fw-bold" @click="closeEmployeeDetail">Close</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
