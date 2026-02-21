import { createRouter, createWebHistory } from "vue-router";

import Index from "../view/index.vue"
import Dashboard from "../view/dashboard.vue";

const routes = [
    {path:"/", name:"Index", component: Index},
    {path:"/dashboard", name:"Dashboard", component: Dashboard}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;