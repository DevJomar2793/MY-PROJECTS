import { createRouter, createWebHistory } from 'vue-router'

import Index from '../views/Index.vue'
import Gallery from '../views/Gallery.vue'

const routes = [
  { path: '/', name: 'Home', component: Index },
  { path: '/gallery', name: 'Gallery', component: Gallery },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
