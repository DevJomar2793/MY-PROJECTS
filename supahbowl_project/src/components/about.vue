<script setup></script>
<template>
  <section id="about">
    <div class="container">
      <div class="row align-items-center g-5">
        <!-- Image -->
        <div class="col-lg-5 reveal-left">
          <div class="about-img-wrap">
            <img
              src="/assets/images/about_chef.png"
              alt="Our Chef cooking fresh ingredients"
              loading="lazy"
            />
            <div class="about-img-badge">
              <div class="icon"><i class="bi bi-award-fill"></i></div>
              <div class="text">
                <div class="num">Award</div>
                <div class="sub">Winning Kitchen</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Text -->
        <div class="col-lg-7 reveal-right">
          <span class="section-badge">Our Story</span>
          <h2 class="section-title">
            Passion for Food,<br /><span>Crafted with Heart</span>
          </h2>
          <div class="divider" style="margin-left: 0"></div>
          <p
            class="text-muted mb-4"
            style="line-height: 1.9; font-size: 1.02rem"
          >
            SupahBowl started as a dream — a small kitchen where great food met
            great people. Since 2016, we've been serving the community with bold
            flavors, quality ingredients, and the kind of recipes you'd want to
            pass down. Every dish tells a story, and every bite is made with
            care.
          </p>

          <!-- Highlights -->
          <div class="highlight-card">
            <div class="highlight-icon"><i class="bi bi-flower1"></i></div>
            <div class="highlight-text">
              <h5>Fresh Ingredients</h5>
              <p>
                We source fresh, locally-grown produce daily. No shortcuts, no
                compromises — just the good stuff on your plate.
              </p>
            </div>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon"><i class="bi bi-wallet2"></i></div>
            <div class="highlight-text">
              <h5>Affordable Meals</h5>
              <p>
                Great food shouldn't break the bank. We keep our prices fair so
                everyone can enjoy restaurant-quality meals.
              </p>
            </div>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon">
              <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <div class="highlight-text">
              <h5>Fast Service</h5>
              <p>
                We value your time. Quick preparation, efficient delivery, and a
                smile on every order — guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
