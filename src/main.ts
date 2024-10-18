import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'normalize.css'
import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //pinia持久化

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')
