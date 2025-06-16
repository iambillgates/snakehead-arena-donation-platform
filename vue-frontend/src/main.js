import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './index.css'

// Create Vue app
const app = createApp(App)

// Initialize Pinia store
const pinia = createPinia()
app.use(pinia)

// Use Vue Router
app.use(router)

// Mount app
app.mount('#app')

// Initialize auth store after mounting
const authStore = useAuthStore()
authStore.initialize()
