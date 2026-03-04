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

const routes = [
    {path: "/", name:"Index", component: Index},
    {path: "/dashboard", name:"Dashboard", component: Dashboard },
    {path: "/buyer", name:"Buyer", component: Buyer},
    {path: "/seller", name:"Seller", component: Seller},
    {path: "/appraisalboss", name:"AppraisalBoss", component: AppraisalBoss},
    {path: "/admin", name:"Admin", component: Admin},
    {path: "/mobileworkerapp", name:"MobileWorkerApp", component: MobileWorkerApp},
    {path: "/marketplace", name:"Marketplace", component: Marketplace},
    {path: "/readmodule", name:"ReadModule", component: ReadModule},
    {path: "/controllermodule", name:"ControllerModule", component: ControllerModule},
    {path: "/login", name:"Login", component: Login},
    {path: "/signup", name:"Signup", component: Signup},
    {path: "/forgot-password", name:"ForgotPassword", component: ForgotPassword},
    // {path: "/report", name:"Report", component: Report}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
