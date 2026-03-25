import { createRouter, createWebHistory } from 'vue-router'
import RoleSelection from '../view/RoleSelection.vue'
import Index from '../view/index.vue'
import EmployeeDashboard from '../view/employee-dashboard.vue'
import EmployeeLogin from '../view/employee-login.vue'
import EmployeeSignup from '../view/employee-signup.vue'
import EmployeeForgotPassword from '../view/employee-forgot-password.vue'
import Equipment from '../view/equipment.vue'
import Deployment from '../view/deployment.vue'
import Report from '../view/report.vue'
import Login from '../view/login.vue'
import Signup from '../view/signup.vue'
import ForgotPassword from '../view/forget-password.vue'

const routes = [
    // ── Public (no auth needed) ────────────────────
    {
        path: '/',
        name: 'RoleSelection',
        component: RoleSelection,
        meta: { public: true }
    },
    {
        path: '/employee/dashboard',
        name: 'EmployeeDashboard',
        component: EmployeeDashboard,
        meta: { employeeAuth: true }
    },
    {
        path: '/employee/login',
        name: 'EmployeeLogin',
        component: EmployeeLogin,
        meta: { public: true }
    },
    {
        path: '/employee/signup',
        name: 'EmployeeSignup',
        component: EmployeeSignup,
        meta: { public: true }
    },
    {
        path: '/employee/forgot-password',
        name: 'EmployeeForgotPassword',
        component: EmployeeForgotPassword,
        meta: { public: true }
    },
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
        path: '/dashboard',
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

// Navigation guard – protect routes
router.beforeEach((to, _from, next) => {
    const isPublic = to.meta?.public === true
    const isEmployeeRoute = to.meta?.employeeAuth === true
    const token = localStorage.getItem('ckt_token')
    const empToken = localStorage.getItem('ckt_emp_token')

    // Protect employee dashboard
    if (isEmployeeRoute && !empToken) {
        return next('/employee/login')
    }

    // Protect admin routes
    if (!isPublic && !isEmployeeRoute && !token) {
        return next('/login')
    }

    // If admin is logged in and trying to access admin login/signup/forgot-password, redirect
    if (isPublic && token && ['/login', '/signup', '/forgot-password'].includes(to.path)) {
        return next('/dashboard')
    }

    // If employee is logged in and trying to access employee login/signup/forgot-password, redirect
    if (isPublic && empToken && ['/employee/login', '/employee/signup', '/employee/forgot-password'].includes(to.path)) {
        return next('/employee/dashboard')
    }

    next()
})

export default router