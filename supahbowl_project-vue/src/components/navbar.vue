<script setup>
</script>

<template>
<nav id="mainNav" class="navbar navbar-expand-lg fixed-top">
  <div class="container">
    <!-- Logo / Brand -->
    <a class="navbar-brand" href="#hero">
      🍔 Supah<span style="color:var(--secondary)">Bowl</span>
    </a>

    <!-- Mobile Toggler -->
    <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navbarMain"
      aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Nav Links -->
    <div class="collapse navbar-collapse" id="navbarMain">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-1">
        <li class="nav-item"><a class="nav-link" href="#hero">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About Us</a></li>
        <li class="nav-item"><a class="nav-link" href="#menu">Menu</a></li>
        <li class="nav-item"><a class="nav-link" href="#gallery">Gallery</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
        <li class="nav-item ms-lg-2">
          <a class="nav-link nav-order-btn" href="#menu" id="nav-order-btn">
            <i class="bi bi-bag-plus me-1"></i> Order Now
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>