import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {klogger} from "kbor-logger";
import '@/styles/index.scss';
import router from './router';
import ToastService from 'primevue/toastservice';



const app = createApp(App);
window.$logger = klogger();
window.$logger?.success('当前环境', import.meta.env.MODE)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        option: {
            prefix: 'webkubor',
        }
    }}).use(ToastService).use(router).mount('#app')
