import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard.vue";
import Buyer from "../views/buyerpage.vue"
import Seller from "../views/sellerpage.vue"
import AppraisalBoss from "../views/appraisalboss.vue"
import Admin from "../views/admin.vue"
import MobileWorkerApp from "../views/mobileworkerapp.vue"
import Marketplace from "../views/marketplace.vue";
import ReadModule from "../views/readmodule.vue";
import ControllerModule from "../views/controllermodule.vue";
import Index from "../views/index.vue";
import Report from "../views/report.vue";
import Login from "../views/login.vue";
import Signup from "../views/signup.vue";
import ForgotPassword from "../views/forgot-password.vue";
import ResetPassword from "../views/reset-password.vue";

const routes = [
    // Public routes
    {path: "/", name:"Index", component: Index},
    {path: "/login", name:"Login", component: Login},
    {path: "/signup", name:"Signup", component: Signup},
    {path: "/forgot-password", name:"ForgotPassword", component: ForgotPassword},
    {path: "/reset-password", name:"ResetPassword", component: ResetPassword},

    // Protected routes
    {path: "/dashboard", name:"Dashboard", component: Dashboard, meta: { requiresAuth: true } },
    {path: "/buyer", name:"Buyer", component: Buyer, meta: { requiresAuth: true }},
    {path: "/seller", name:"Seller", component: Seller, meta: { requiresAuth: true }},
    {path: "/appraisalboss", name:"AppraisalBoss", component: AppraisalBoss, meta: { requiresAuth: true }},
    {path: "/admin", name:"Admin", component: Admin, meta: { requiresAuth: true }},
    {path: "/mobileworkerapp", name:"MobileWorkerApp", component: MobileWorkerApp, meta: { requiresAuth: true }},
    {path: "/marketplace", name:"Marketplace", component: Marketplace, meta: { requiresAuth: true }},
    {path: "/readmodule", name:"ReadModule", component: ReadModule, meta: { requiresAuth: true }},
    {path: "/controllermodule", name:"ControllerModule", component: ControllerModule, meta: { requiresAuth: true }},
    // {path: "/report", name:"Report", component: Report, meta: { requiresAuth: true }}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token');
    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
