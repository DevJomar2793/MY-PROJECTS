<script setup></script>

<template>
  <section id="gallery">
    <div class="container">
      <div class="text-center reveal">
        <span class="section-badge">Food Gallery</span>
        <h2 class="section-title">A Feast <span>for the Eyes</span></h2>
        <div class="divider"></div>
        <p class="section-subtitle">
          Every dish is a work of art. Browse our gallery of freshly prepared
          food — click any photo to view full size.
        </p>
      </div>

      <div
        class="row g-0"
        style="border-radius: var(--radius); overflow: hidden"
      >
        <!-- Large left image -->
        <div class="col-lg-6 reveal-left">
          <div class="gallery-item" style="margin: 0; border-radius: 0">
            <img
              src="/assets/images/hero_banner.png"
              alt="Restaurant atmosphere with gourmet burger"
              loading="lazy"
              style="height: 100%; min-height: 300px"
            />
            <div class="gallery-overlay">
              <i class="bi bi-zoom-in"></i>
              <span>Restaurant Vibes</span>
            </div>
          </div>
        </div>
        <!-- Right grid -->
        <div class="col-lg-6">
          <div class="row g-0">
            <div class="col-6 reveal delay-1">
              <div class="gallery-item" style="margin: 0; border-radius: 0">
                <img
                  src="/assets/images/gallery1.png"
                  alt="Brunch spread"
                  loading="lazy"
                />
                <div class="gallery-overlay">
                  <i class="bi bi-zoom-in"></i>
                  <span>Brunch Spread</span>
                </div>
              </div>
            </div>
            <div class="col-6 reveal delay-2">
              <div class="gallery-item" style="margin: 0; border-radius: 0">
                <img
                  src="/assets/images/gallery2.png"
                  alt="Sushi platter"
                  loading="lazy"
                />
                <div class="gallery-overlay">
                  <i class="bi bi-zoom-in"></i>
                  <span>Sushi Platter</span>
                </div>
              </div>
            </div>
            <div class="col-6 reveal delay-3">
              <div class="gallery-item" style="margin: 0; border-radius: 0">
                <img
                  src="/assets/images/gallery3.png"
                  alt="Gourmet steak"
                  loading="lazy"
                />
                <div class="gallery-overlay">
                  <i class="bi bi-zoom-in"></i>
                  <span>Gourmet Steak</span>
                </div>
              </div>
            </div>
            <div class="col-6 reveal delay-4">
              <div class="gallery-item" style="margin: 0; border-radius: 0">
                <img
                  src="/assets/images/gallery4.png"
                  alt="Chocolate lava cake"
                  loading="lazy"
                />
                <div class="gallery-overlay">
                  <i class="bi bi-zoom-in"></i>
                  <span>Lava Cake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
