<script setup></script>

<template>
  <section id="testimonials">
    <div class="container">
      <div class="text-center mb-5 reveal">
        <span
          class="section-badge"
          style="background: rgba(255, 255, 255, 0.1); color: var(--accent)"
          >Testimonials</span
        >
        <h2 class="section-title" style="color: var(--white)">
          What Our <span>Customers</span> Say
        </h2>
        <div class="divider"></div>
      </div>

      <!-- Bootstrap Carousel -->
      <div
        id="testimonialCarousel"
        class="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div class="carousel-inner">
          <!-- Slide 1 -->
          <div class="carousel-item active">
            <div class="testimonial-card reveal">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <p class="testimonial-text">
                "Best burger in town — hands down! The patty was perfectly
                juicy, the bun was fresh, and the secret sauce? Absolute
                perfection. SupahBowl never disappoints!"
              </p>
              <div class="testimonial-author">
                <div class="author-avatar">M</div>
                <div>
                  <div class="author-name">Maria Santos</div>
                  <div class="author-role">Regular Customer since 2019</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 2 -->
          <div class="carousel-item">
            <div class="testimonial-card">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <p class="testimonial-text">
                "The wood-fired pizza is out of this world! I've eaten pizza all
                over, and SupahBowl's is genuinely top-tier. The crispy crust
                and generous toppings — incredible!"
              </p>
              <div class="testimonial-author">
                <div class="author-avatar">J</div>
                <div>
                  <div class="author-name">James Reyes</div>
                  <div class="author-role">Food Enthusiast</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 3 -->
          <div class="carousel-item">
            <div class="testimonial-card">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <p class="testimonial-text">
                "Affordable, quick, and absolutely delicious! The combo meal is
                unbeatable value. I order from SupahBowl at least twice a week —
                my whole family loves it!"
              </p>
              <div class="testimonial-author">
                <div class="author-avatar">A</div>
                <div>
                  <div class="author-name">Ana Cruz</div>
                  <div class="author-role">Loyal Customer</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 4 -->
          <div class="carousel-item">
            <div class="testimonial-card">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <p class="testimonial-text">
                "The fried chicken is crispy, flavorful, and generous in
                portion! Plus the staff is super friendly and service is always
                fast. Best food spot in the neighborhood!"
              </p>
              <div class="testimonial-author">
                <div class="author-avatar">R</div>
                <div>
                  <div class="author-name">Ryan Dela Cruz</div>
                  <div class="author-role">Local Food Blogger</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="prev"
          id="carousel-prev"
        >
          <i
            class="bi bi-chevron-left"
            style="color: white; font-size: 1.2rem"
          ></i>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="next"
          id="carousel-next"
        >
          <i
            class="bi bi-chevron-right"
            style="color: white; font-size: 1.2rem"
          ></i>
          <span class="visually-hidden">Next</span>
        </button>

        <!-- Indicators -->
        <div class="carousel-indicators" style="bottom: -40px">
          <button
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>
