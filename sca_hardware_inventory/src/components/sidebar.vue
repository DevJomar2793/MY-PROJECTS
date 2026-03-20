<template>
  <nav class="col-md-2 d-md-block sidebar p-4">
    <div class="d-flex align-items-center mb-5 mt-2">
      <i class="bi bi-box-seam text-primary fs-3 me-2"></i>
      <h4 class="text-white mb-0 fw-bold">CKT Hardware Inventory</h4>
    </div>
    <ul class="nav flex-column gap-2">
      <li class="nav-item mb-1">
        <router-link
          to="/"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link
          to="/equipment"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          <i class="bi bi-laptop"></i> Equipment List
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <router-link
          to="/deployment"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          <i class="bi bi-person-circle"></i> Deployment
        </router-link>
      </li>

      <li class="nav-item mb-1">
        <router-link
          to="/reports"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >
          <i class="bi bi-bar-chart-fill"></i> Reports
        </router-link>
      </li>
      <li class="nav-item mb-1">
        <a class="nav-link" href="#"
          ><i class="bi bi-gear-fill"></i> Settings</a
        >
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#"
          ><i class="bi bi-question-circle-fill"></i> Help</a
        >
      </li>
    </ul>
  </nav>
</template>
