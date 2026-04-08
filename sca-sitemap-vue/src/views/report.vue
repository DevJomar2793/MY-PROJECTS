<script setup>
import SideBar from "../components/sidebar.vue";
import Footer from "../components/footer.vue";
import { ref } from "vue";

// Mock data for the report
const summaryStats = ref([
  { title: "Total Screens Map", value: "342", icon: "bi-layers", color: "text-primary", bg: "bg-primary-subtle" },
  { title: "Active Links", value: "1,204", icon: "bi-link-45deg", color: "text-success", bg: "bg-success-subtle" },
  { title: "Errors Found", value: "12", icon: "bi-exclamation-triangle", color: "text-danger", bg: "bg-danger-subtle" },
  { title: "Test Coverage", value: "89%", icon: "bi-check2-circle", color: "text-info", bg: "bg-info-subtle" }
]);

const recentActivities = ref([
  { id: 1, action: "Screen Added", user: "QA_John", date: "2026-03-04 09:30", status: "Success", bg: "bg-success-subtle text-success" },
  { id: 2, action: "Link Broken", user: "System", date: "2026-03-04 08:15", status: "Error", bg: "bg-danger-subtle text-danger" },
  { id: 3, action: "Sitemap Updated", user: "Admin", date: "2026-03-03 16:45", status: "Success", bg: "bg-success-subtle text-success" },
  { id: 4, action: "New Module Scanned", user: "AutoBot", date: "2026-03-03 14:20", status: "Warning", bg: "bg-warning-subtle text-warning" },
]);
</script>

<template>
  <SideBar />
  <main class="content report-main">
    <div class="container-fluid py-4">
      
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 fade-in-up">
        <div>
          <h1 class="h3 mb-1 fw-bold text-dark">Analytics Report</h1>
          <p class="text-muted mb-0">Overview of your sitemaps and system health</p>
        </div>
        <div>
          <button class="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 py-2">
            <i class="bi bi-download"></i> Export Data
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3" v-for="(stat, index) in summaryStats" :key="index">
          <div class="card border-0 shadow-sm h-100 summary-card p-2 fade-in-up" :style="{ animationDelay: `${index * 0.1 + 0.1}s` }">
            <div class="card-body d-flex align-items-center">
              <div class="flex-shrink-0 me-4">
                <div class="icon-shape rounded-4 d-flex align-items-center justify-content-center" :class="stat.bg">
                  <i class="bi fs-3" :class="[stat.icon, stat.color]"></i>
                </div>
              </div>
              <div>
                <h6 class="text-muted fw-normal mb-1">{{ stat.title }}</h6>
                <h2 class="mb-0 fw-bold text-dark">{{ stat.value }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section (Mocked visually) -->
      <div class="row g-4 mb-4 fade-in-up" style="animation-delay: 0.5s">
        
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm h-100 p-3">
            <div class="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
              <h5 class="fw-bold mb-0">System Throughput</h5>
              <i class="bi bi-three-dots text-muted cursor-pointer"></i>
            </div>
            <div class="card-body px-4">
              <div class="chart-mockup d-flex align-items-end justify-content-between h-100 pt-5 pb-2">
                <div class="bar-wrapper" v-for="i in 12" :key="i">
                  <div class="bar rounded-top-2 bg-primary" 
                       :style="{ height: Math.floor(Math.random() * 70 + 30) + '%' }">
                  </div>
                  <span class="d-block text-center text-muted small mt-2 fw-medium">W{{i}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100 p-3">
            <div class="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between">
              <h5 class="fw-bold mb-0">Status Summary</h5>
              <i class="bi bi-three-dots text-muted cursor-pointer"></i>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center px-4">
              <div class="donut-container position-relative mb-4">
                <div class="donut-chart rounded-circle"></div>
                <div class="donut-hole bg-white rounded-circle position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center">
                  <span class="fs-4 fw-bold">100%</span>
                </div>
              </div>
              <div class="w-100 mt-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted d-flex align-items-center">
                    <span class="badge-dot bg-success me-2"></span> Success
                  </span>
                  <span class="fw-bold">65%</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-muted d-flex align-items-center">
                    <span class="badge-dot bg-warning me-2"></span> Warning
                  </span>
                  <span class="fw-bold">25%</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted d-flex align-items-center">
                    <span class="badge-dot bg-danger me-2"></span> Error
                  </span>
                  <span class="fw-bold">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities Table -->
      <div class="card border-0 shadow-sm fade-in-up" style="animation-delay: 0.6s">
        <div class="card-header bg-white border-0 p-4">
          <h5 class="fw-bold mb-0">Recent Activities</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-table">
              <thead class="table-light text-muted">
                <tr>
                  <th class="ps-4 py-3 fw-medium border-0">Action Type</th>
                  <th class="py-3 fw-medium border-0">User / System</th>
                  <th class="py-3 fw-medium border-0">Date & Time</th>
                  <th class="py-3 fw-medium border-0">Status</th>
                  <th class="text-end pe-4 py-3 fw-medium border-0">Manage</th>
                </tr>
              </thead>
              <tbody class="border-top-0">
                <tr v-for="activity in recentActivities" :key="activity.id">
                  <td class="ps-4 py-3 fw-bold text-dark">{{ activity.action }}</td>
                  <td class="py-3">
                    <div class="d-flex align-items-center gap-3">
                      <div class="avatar-sm bg-secondary-subtle text-secondary fw-bold rounded-circle d-flex align-items-center justify-content-center" 
                           style="width: 36px; height: 36px; font-size: 13px;">
                        {{ activity.user.substring(0, 2).toUpperCase() }}
                      </div>
                      <span class="text-dark fw-medium">{{ activity.user }}</span>
                    </div>
                  </td>
                  <td class="text-muted py-3"><i class="bi bi-clock me-1"></i> {{ activity.date }}</td>
                  <td class="py-3">
                    <span class="badge rounded-pill fw-medium px-3 py-2" :class="activity.bg">
                      {{ activity.status }}
                    </span>
                  </td>
                  <td class="text-end pe-4 py-3">
                    <button class="btn btn-sm btn-light rounded-circle" style="width: 32px; height: 32px;">
                      <i class="bi bi-three-dots"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-white border-top border-light py-3 pt-4 text-center">
          <button class="btn btn-link text-decoration-none text-primary fw-bold p-0">
            View All Check Logs <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>

    </div>
  </main>
  <Footer />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.report-main {
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
  background-color: #f4f6fc;
}

/* Make layout align nicely to right of Sidebar across devices if applicable */
@media (min-width: 992px) {
  .report-main {
    margin-left: 250px; /* Adjust according to true sidebar width from App.vue/Dashboard.vue */
  }
}

/* Components Styling */
.icon-shape {
  width: 60px;
  height: 60px;
  border-radius: 14px;
}

.summary-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 16px;
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
}

.card {
  border-radius: 16px;
}

/* Charts */
.chart-mockup {
  height: 220px;
  border-bottom: 2px solid #eef2f7;
}

.bar-wrapper {
  width: 6%;
  height: 100%;
}

.bar {
  width: 100%;
  transition: height 1s ease-in-out;
  background: linear-gradient(180deg, var(--bs-primary) 0%, rgba(13, 110, 253, 0.3) 100%);
}

.bar:hover {
  background: var(--bs-primary);
  cursor: pointer;
}

/* Donut implementation via conic gradients */
.donut-container {
  width: 170px;
  height: 170px;
}
.donut-chart {
  width: 100%;
  height: 100%;
  background: conic-gradient(
    var(--bs-success) 0% 65%, 
    var(--bs-warning) 65% 90%, 
    var(--bs-danger) 90% 100%
  );
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: rotateDonut 1s ease-out;
}
.donut-hole {
  width: 110px;
  height: 110px;
  box-shadow: inset 0px 5px 10px rgba(0,0,0,0.02);
}

.badge-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cursor-pointer {
  cursor: pointer;
}

/* Table Style */
.custom-table th {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.custom-table tbody tr {
  transition: background-color 0.2s ease;
}

.custom-table tbody tr:hover {
  background-color: rgba(0,0,0,0.01);
}

/* Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(25px);
  animation: fadeInUp 0.7s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotateDonut {
  from { transform: rotate(-90deg); opacity: 0; }
  to { transform: rotate(0deg); opacity: 1; }
}
</style>