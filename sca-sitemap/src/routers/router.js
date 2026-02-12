import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/dashboard.vue";
import Buyer from "../views/buyerpage.vue"


const routes = [
    {path: "/", name:"Dashboard", component: Dashboard },
    {path: "/buyer", name:"Buyer", component: Buyer}
    
];

const router =  createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
