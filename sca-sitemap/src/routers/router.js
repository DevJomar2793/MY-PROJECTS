import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard.vue";
import Buyer from "../views/buyerpage.vue"
import Seller from "../views/sellerpage.vue"
import AppraisalBoss from "../views/appraisalboss.vue"
import Admin from "../views/admin.vue"

const routes = [
    {path: "/", name:"Dashboard", component: Dashboard },
    {path: "/buyer", name:"Buyer", component: Buyer},
    {path: "/seller", name:"Seller", component: Seller},
    {path: "/appraisalboss", name:"AppraisalBoss", component: AppraisalBoss},
    {path: "/admin", name:"Admin", component: Admin}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
