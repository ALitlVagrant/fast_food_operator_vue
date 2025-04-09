import { createRouter, createWebHistory } from 'vue-router';
import DisplayOrder from './components/DisplayOrderNumber.vue';
import KitchenDisplay from './components/KitchenDisplay.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: DisplayOrder,
    },
    {
        path: '/kitchen-display',
        name: 'KitchenDisplay',
        component: KitchenDisplay,
    },
];

const router = createRouter({
    // Använd en relativ sökväg istället för process.env.BASE_URL
    history: createWebHistory(),
    routes,
});

export default router;
