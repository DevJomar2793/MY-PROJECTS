import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard.vue";
import Buyer from "../views/buyerpage.vue"
import Seller from "../views/sellerpage.vue"

const routes = [
    {path: "/", name:"Dashboard", component: Dashboard },
    {path: "/buyer", name:"Buyer", component: Buyer},
    {path: "/seller", name:"Seller", component: Seller}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
