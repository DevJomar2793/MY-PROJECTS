<script setup>
</script>

<template>
<section id="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge">
        <i class="bi bi-star-fill"></i>
        <span>#1 Food Spot in Town</span>
      </div>

      <h1 class="hero-title">
        Delicious Food<br>
        Made <span>Fresh</span><br>
        Every Day
      </h1>

      <p class="hero-desc">
        From flame-grilled burgers to wood-fired pizzas — every dish is crafted with love,
        the freshest ingredients, and a whole lot of flavor. Taste the difference.
      </p>

      <div class="hero-btns">
        <a href="#menu" class="btn-primary-custom text-decoration-none" id="hero-view-menu-btn">
          <i class="bi bi-grid-3x3-gap-fill"></i> View Menu
        </a>
        <a href="#contact" class="btn-outline-custom text-decoration-none" id="hero-order-btn">
          <i class="bi bi-bag-heart-fill"></i> Order Now
        </a>
      </div>

      <div class="hero-stats">
        <div class="hero-stat">
          <div class="number">
            <span class="count-up" data-target="500" data-suffix="+">0+</span>
          </div>
          <div class="label">Happy Customers</div>
        </div>
        <div class="hero-stat">
          <div class="number">
            <span class="count-up" data-target="25" data-suffix="+">0+</span>
          </div>
          <div class="label">Menu Items</div>
        </div>
        <div class="hero-stat">
          <div class="number">
            <span class="count-up" data-target="8" data-suffix=" Yrs">0</span>
          </div>
          <div class="label">Experience</div>
        </div>
        <div class="hero-stat">
          <div class="number">
            <span class="count-up" data-target="4" data-suffix=".9★">0</span>
          </div>
          <div class="label">Avg. Rating</div>
        </div>
      </div>
    </div>
  </div>

  <div class="hero-scroll">
    <span>Scroll Down</span>
    <i class="bi bi-chevron-compact-down"></i>
  </div>
</section>
</template>