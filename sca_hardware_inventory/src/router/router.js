import { createRouter, createWebHistory } from 'vue-router'
import Index from '../view/index.vue'
import Equipment from '../view/equipment.vue'
import Deployment from '../view/deployment.vue'
import Report from '../view/report.vue'
import Login from '../view/login.vue'
import Signup from '../view/signup.vue'
import ForgotPassword from '../view/forget-password.vue'

const routes = [
    // ── Auth (public) ──────────────────────
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { public: true }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: { public: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: { public: true }
    },

    // ── App (protected) ────────────────────
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/equipment',
        name: 'Equipment',
        component: Equipment
    },
    {
        path: '/deployment',
        name: 'Deployment',
        component: Deployment
    },
    {
        path: '/reports',
        name: 'Reports',
        component: Report
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard – protect all non-public routes
router.beforeEach((to, _from, next) => {
    const isPublic = to.meta?.public === true
    const token = localStorage.getItem('ckt_token')

    if (!isPublic && !token) {
        return next('/login')
    }
    if (isPublic && token) {
        return next('/')
    }
    next()
})

export default router