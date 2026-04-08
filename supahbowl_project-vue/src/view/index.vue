<script setup>
import { onMounted } from 'vue'
import NavbarComponent from '../components/navbar.vue'
import HeroComponent from '../components/hero.vue'
import AboutComponent from '../components/about.vue'
import MenuComponent from '../components/menu.vue'
import GalleryComponent from '../components/gallery.vue'
import TestimonialComponent from '../components/testimonial.vue'
import ContactComponent from '../components/contact.vue'
import WebFooter from '../components/web-footer.vue'

onMounted(() => {
  // ---- Sticky Navbar ----
  const nav = document.getElementById('mainNav')
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })

    // Active nav link
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]')
    window.addEventListener('scroll', () => {
      let current = ''
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id })
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`)
      })
    }, { passive: true })
  }

  // ---- Scroll Reveal ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el))

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.count-up')
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const target = parseInt(el.getAttribute('data-target'))
      const suffix = el.getAttribute('data-suffix') || ''
      let current = 0
      const step = target / (1800 / 16)
      const update = () => {
        current = Math.min(current + step, target)
        el.textContent = Math.floor(current).toLocaleString() + suffix
        if (current < target) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
      counterObs.unobserve(el)
    })
  }, { threshold: 0.5 })
  counters.forEach(c => counterObs.observe(c))

  // ---- Menu Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn')
  const menuItems = document.querySelectorAll('.menu-item')
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const filter = btn.getAttribute('data-filter')
      menuItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter
        item.style.opacity = '0'
        item.style.transform = match ? 'scale(0.9)' : 'scale(0.85)'
        item.style.display = 'block'
        if (match) {
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
            item.style.opacity = '1'
            item.style.transform = 'scale(1)'
          })
        } else {
          setTimeout(() => { item.style.display = 'none' }, 400)
        }
      })
    })
  })

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      const collapse = document.querySelector('.navbar-collapse.show')
      if (collapse) document.querySelector('.navbar-toggler')?.click()
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
    })
  })

  // ---- Gallery Lightbox ----
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img')
      if (!img) return
      const lb = document.createElement('div')
      lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;'
      lb.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,0.5);">
        <button onclick="this.parentElement.remove()" style="position:absolute;top:20px;right:24px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:50%;width:44px;height:44px;font-size:1.3rem;cursor:pointer;">✕</button>`
      lb.addEventListener('click', e => { if (e.target === lb) lb.remove() })
      document.body.appendChild(lb)
    })
  })

  // ---- Contact Form ----
  const form = document.getElementById('contactForm')
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()
      const btn = form.querySelector('[type="submit"]')
      const original = btn.innerHTML
      btn.disabled = true
      btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...'
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!'
        btn.style.background = 'linear-gradient(135deg, #06d6a0, #1b9aaa)'
        showToast('🎉 Message sent! We\'ll get back to you shortly.')
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; btn.style.background = ''; form.reset() }, 3000)
      }, 1500)
    })
  }

  // ---- Order Buttons ----
  document.addEventListener('click', e => {
    if (e.target.closest('.btn-order')) {
      const name = e.target.closest('.menu-card')?.querySelector('h5')?.textContent || 'item'
      showToast(`🛒 "${name}" added to your order!`)
    }
  })
})

function showToast(message) {
  const toast = document.createElement('div')
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:linear-gradient(135deg,#e63946,#ff6b35);color:#fff;padding:16px 28px;border-radius:14px;font-size:0.95rem;font-weight:600;box-shadow:0 10px 30px rgba(230,57,70,0.35);z-index:9999;font-family:\'Poppins\',sans-serif;'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s, transform 0.5s'
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(120%)'
    setTimeout(() => toast.remove(), 500)
  }, 3500)
}
</script>

<template>
  <NavbarComponent />
  <HeroComponent />
  <AboutComponent />
  <MenuComponent />
  <GalleryComponent />
  <TestimonialComponent />
  <ContactComponent />
  <WebFooter />
</template>
