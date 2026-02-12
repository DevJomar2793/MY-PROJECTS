<script setup></script>

<template>
  <div class="sidebar d-flex flex-column p-3 text-white" style="width: 220px">
    <h5 class="text-white">Menu</h5>
    <ul class="nav nav-pills flex-column mb-auto">
      <router-link to="/" class="nav-link text-white">Dashboard</router-link>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle nav-link text-white"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Screens
        </a>
        <ul class="dropdown-menu">
          <router-link to="/buyer" class="nav-link text-white"
            >Buyer</router-link
          >
          <li><a class="dropdown-item" href="#">Seller</a></li>
        </ul>
      </li>
      <li><a href="#" class="nav-link text-white">Report</a></li>
      <!-- <li><a href="#" class="nav-link text-white">Customers</a></li>
      <li><a href="#" class="nav-link text-white">Reports</a></li> -->
    </ul>
  </div>
</template>
