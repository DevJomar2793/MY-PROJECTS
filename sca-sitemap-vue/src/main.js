import { createApp } from 'vue'
import '../static/style.css'
import App from './App.vue'
import router from './routers/router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Import Bootstrap JS (optional, for components like modals, dropdowns)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).use(router).mount('#app')
