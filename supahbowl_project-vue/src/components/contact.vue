<script setup></script>

<template>
  <section id="contact">
    <div class="container">
      <div class="text-center reveal">
        <span class="section-badge">Get In Touch</span>
        <h2 class="section-title">We'd Love to <span>Hear from You</span></h2>
        <div class="divider"></div>
        <p class="section-subtitle">
          Have a question, a catering inquiry, or just want to say hi? Reach out
          — we're always happy to chat.
        </p>
      </div>

      <div class="row g-5">
        <!-- Left: Info + Map -->
        <div class="col-lg-5 reveal-left">
          <div class="contact-info-card">
            <div class="contact-icon">
              <i class="bi bi-telephone-fill"></i>
            </div>
            <div>
              <h5>Phone</h5>
              <p>+63 912 345 6789</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-icon">
              <i class="bi bi-envelope-fill"></i>
            </div>
            <div>
              <h5>Email</h5>
              <p>hello@supahbowl.com</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-icon"><i class="bi bi-geo-alt-fill"></i></div>
            <div>
              <h5>Address</h5>
              <p>123 Flavor Street, Food City, Metro Manila</p>
            </div>
          </div>

          <div class="contact-info-card">
            <div class="contact-icon"><i class="bi bi-clock-fill"></i></div>
            <div>
              <h5>Hours</h5>
              <p>Mon–Sun: 10:00 AM – 10:00 PM</p>
            </div>
          </div>

          <!-- Map Embed -->
          <div class="map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.7799591499267!2d120.9842!3d14.5995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM1JzU4LjIiTiAxMjDCsDU5JzAzLjEiRQ!5e0!3m2!1sen!2sph!4v1234567890"
              title="SupahBowl Location"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="col-lg-7 reveal-right">
          <div class="contact-form-wrap">
            <h3>Send Us a Message</h3>
            <p class="lead-sub">
              Fill in the form below and we'll respond within 24 hours.
            </p>

            <form id="contactForm" novalidate>
              <div class="row">
                <div class="col-sm-6">
                  <input
                    type="text"
                    class="form-control-custom"
                    id="contact-name"
                    placeholder="Your Full Name"
                    required
                  />
                </div>
                <div class="col-sm-6">
                  <input
                    type="email"
                    class="form-control-custom"
                    id="contact-email"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
              <input
                type="text"
                class="form-control-custom"
                id="contact-subject"
                placeholder="Subject (e.g. Catering Inquiry)"
              />
              <textarea
                class="form-control-custom"
                id="contact-message"
                rows="5"
                placeholder="Write your message here..."
                required
              ></textarea>

              <button
                type="submit"
                class="btn-primary-custom w-100 justify-content-center"
                id="contact-submit-btn"
              >
                <i class="bi bi-send-fill"></i> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
