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

const routes = [
    {path: "/", name:"Dashboard", component: Dashboard },
    {path: "/buyer", name:"Buyer", component: Buyer},
    {path: "/seller", name:"Seller", component: Seller},
    {path: "/appraisalboss", name:"AppraisalBoss", component: AppraisalBoss},
    {path: "/admin", name:"Admin", component: Admin},
    {path: "/mobileworkerapp", name:"MobileWorkerApp", component: MobileWorkerApp},
    {path: "/marketplace", name:"Marketplace", component: Marketplace},
    {path: "/readmodule", name:"ReadModule", component: ReadModule},
    {path: "/controllermodule", name:"ControllerModule", component: ControllerModule}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
