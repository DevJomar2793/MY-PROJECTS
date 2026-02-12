import { createApp } from 'vue'
import '../static/style.css'
import App from './App.vue'
import router from './routers/router'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Bootstrap JS (for modal, dropdown, tooltip, etc.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";


createApp(App).use(router).mount('#app')
