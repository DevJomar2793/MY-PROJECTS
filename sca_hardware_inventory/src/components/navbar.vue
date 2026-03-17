<template>
  <nav
    class="navbar navbar-expand-lg glass-panel rounded-4 mb-4 px-4 py-3 shadow-sm border-0"
  >
    <div class="container-fluid px-0">
      <span class="navbar-brand mb-0 h5 fw-bold text-dark">Hardware List</span>
      <div class="d-flex align-items-center gap-3">
        <div class="position-relative cursor-pointer" role="button">
          <i class="bi bi-bell fs-5 text-muted hover-lift d-inline-block"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
          >
            <span class="visually-hidden">New alerts</span>
          </span>
        </div>
        <div class="d-flex align-items-center gap-2 border-start ps-3 ms-2">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=4361ee&color=fff"
            alt="Profile"
            class="rounded-circle shadow-sm"
            width="36"
            height="36"
          />
          <div class="d-none d-md-block">
            <p
              class="mb-0 fw-semibold fs-6 lh-1"
              style="color: var(--text-main)"
            >
              Admin User
            </p>
            <small
              class="text-muted d-block text-truncate"
              style="max-width: 120px; font-size: 0.75rem"
              >admin@example.com</small
            >
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
