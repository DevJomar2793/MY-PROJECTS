import { createRouter, createWebHistory } from 'vue-router'
import Index from '../view/index.vue'
import Equipment from '../view/equipment.vue'
import Deployment from '../view/deployment.vue'

const routes = [
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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
    