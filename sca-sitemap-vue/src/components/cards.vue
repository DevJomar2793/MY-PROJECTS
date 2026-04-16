<script setup>
import { ref, onMounted } from "vue";

const totalPagesBuyers = ref(0);
const totalPagesSellers = ref(0);
const totalPagesAppraisalBoss = ref(0);
const totalPagesAdmin = ref(0);
const totalPagesMobileWorker = ref(0);
const totalPagesMarketplace = ref(0);
const totalPagesReadModule = ref(0);
const totalPagesControllerModule = ref(0);

// Get Total Count Screen of Buyer
async function getTotalPagesForBuyers() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforbuyers",
  );
  totalPagesBuyers.value = await res.json();
}

// Get Total Count Screen of Seller
async function getTotalPagesForSellers() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforsellers",
  );
  totalPagesSellers.value = await res.json();
}

//Get Total Count Screnn of Appraisal Boss
async function getTotalPagesForAppraisalBoss() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforappraisalboss",
  );
  totalPagesAppraisalBoss.value = await res.json();
}

//Get Total Count Screen of Admin
async function getTotalPagesForAdmin() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforadmin",
  );
  totalPagesAdmin.value = await res.json();
}

//Get Total Count Screen of Mobile Worker
async function getTotalPagesForMobileWorker() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountformobileworker",
  );
  totalPagesMobileWorker.value = await res.json();
}

//Get Total Count Screen of Marketplace
async function getTotalPagesForMarketplace() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountformarketplace",
  );
  totalPagesMarketplace.value = await res.json();
}

//Get Total Count Screen of Read Module
async function getTotalPagesForReadModule() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforreadmodule",
  );
  totalPagesReadModule.value = await res.json();
}

//Get Total Count Screen of Controller Module
async function getTotalPagesForControllerModule() {
  const res = await fetch(
    "https://atbackend-sca-sitemap-vue.onrender.com/api/v1/gettotalcountforcontrollermodule",
  );
  totalPagesControllerModule.value = await res.json();
}

const refreshCounts = () => {
  getTotalPagesForBuyers();
  getTotalPagesForSellers();
  getTotalPagesForAppraisalBoss();
  getTotalPagesForAdmin();
  getTotalPagesForMobileWorker();
  getTotalPagesForMarketplace();
  getTotalPagesForReadModule();
  getTotalPagesForControllerModule();
};

defineExpose({
  refreshCounts,
});

onMounted(() => {
  refreshCounts();
});
</script>
<template>
  <div class="row g-3 mb-4">
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-indigo">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Buyers Page</div>
            <div class="stat-value">{{ totalPagesBuyers }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-teal">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-currency-dollar"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Sellers Page</div>
            <div class="stat-value">{{ totalPagesSellers }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-amber">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-cart"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Appraisal Boss Page</div>
            <div class="stat-value">{{ totalPagesAppraisalBoss }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-rose">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Admin Page</div>
            <div class="stat-value">{{ totalPagesAdmin }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-indigo">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-people"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Mobile Worker App Page</div>
            <div class="stat-value">{{ totalPagesMobileWorker }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-teal">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-currency-dollar"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Marketplace Page</div>
            <div class="stat-value">{{ totalPagesMarketplace }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-amber">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-cart"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Read Module Page</div>
            <div class="stat-value">{{ totalPagesReadModule }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card stat-card card-rose">
        <div class="card-body">
          <!-- <div class="stat-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div> -->
          <div class="stat-info">
            <div class="stat-label">Controller Module Page</div>
            <div class="stat-value">{{ totalPagesControllerModule }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
