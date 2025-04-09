// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importera router

createApp(App)
    .use(router)  // Lägg till router här
    .mount('#app');
