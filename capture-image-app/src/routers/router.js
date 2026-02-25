import { createRouter, createWebHistory } from "vue-router";

import Index from "../view/index.vue"
import Dashboard from "../view/dashboard.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Index },
        { path: "/dashboard", component: Dashboard },
    ],
});

export default router;