import {createRouter, createWebHashHistory,RouteRecordRaw} from "vue-router";

const routes:RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/home.vue')
    },
    {
        path: "/npm/list",
        name: "NpmList",
        component: () => import('@/views/npm/list.vue')
    },
    {
        path: "/yarn/list",
        name: "YarnList",
        component: () => import('@/views/yarn/list.vue')
    },
    {
        path: "/pnpm/list",
        name: "PnpmList",
        component: () => import('@/views/pnpm/list.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router