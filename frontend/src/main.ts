import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {klogger} from "kbor-logger";
import '@/styles/index.scss'
window.$logger = klogger();
window.$logger?.success('当前环境', import.meta.env.MODE)

createApp(App).use(PrimeVue, {
    theme: {
        preset: Aura
    }}).mount('#app')
