/* =============================================
   SUPAHBOWL - Main JavaScript
   ============================================= */

'use strict';

// ======== DOM Ready ========
document.addEventListener('DOMContentLoaded', () => {
  initStickyNav();
  initScrollReveal();
  initMenuFilter();
  initSmoothScroll();
  initContactForm();
  initCounters();
  initGalleryLightbox();
});

// ======== STICKY NAVBAR ========
function initStickyNav() {
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ======== SCROLL REVEAL ========
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ======== MENU FILTER ========
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          item.style.display = 'block';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    });
  });
}

// ======== SMOOTH SCROLL ========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ======== CONTACT FORM ========
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;

    // Simulate sending
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';

    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #06d6a0, #1b9aaa)';

      // Show success toast
      showToast('🎉 Message sent! We\'ll get back to you shortly.');

      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });
}

// ======== COUNTER ANIMATION ========
function initCounters() {
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + (el.getAttribute('data-suffix') || '');
        if (current < target) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ======== GALLERY LIGHTBOX ========
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      openLightbox(img.src, img.alt);
    });
  });
}

function openLightbox(src, alt) {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;
    display:flex;align-items:center;justify-content:center;
    animation:fadeIn 0.3s ease;cursor:zoom-out;
  `;
  lb.innerHTML = `
    <img src="${src}" alt="${alt}" style="
      max-width:90vw;max-height:90vh;border-radius:16px;
      box-shadow:0 30px 80px rgba(0,0,0,0.5);
      animation:zoomIn 0.3s ease;
    ">
    <button onclick="this.parentElement.remove()" style="
      position:absolute;top:20px;right:24px;background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.2);color:#fff;
      border-radius:50%;width:44px;height:44px;font-size:1.3rem;cursor:pointer;
    ">✕</button>
  `;
  lb.addEventListener('click', (e) => {
    if (e.target === lb) lb.remove();
  });
  document.body.appendChild(lb);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes zoomIn { from { transform:scale(0.85); opacity:0; } to { transform:scale(1); opacity:1; } }
  `;
  document.head.appendChild(style);
}

// ======== TOAST ========
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:30px;right:30px;background:linear-gradient(135deg,#e63946,#ff6b35);
    color:#fff;padding:16px 28px;border-radius:14px;font-size:0.95rem;font-weight:600;
    box-shadow:0 10px 30px rgba(230,57,70,0.35);z-index:9999;
    animation:slideIn 0.4s ease;font-family:'Poppins',sans-serif;
  `;
  toast.textContent = message;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideIn { from { transform:translateX(120%);opacity:0; } to { transform:translateX(0);opacity:1; } }`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// ======== ORDER BUTTON CLICK ========
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-order')) {
    const card = e.target.closest('.menu-card');
    const name = card?.querySelector('h5')?.textContent || 'item';
    showToast(`🛒 "${name}" added to your order!`);
  }
});
