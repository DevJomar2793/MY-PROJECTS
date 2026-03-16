import { createRouter, createWebHistory } from 'vue-router'
import Index from '../view/index.vue'
import Equipment from '../view/equipment.vue'

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
    