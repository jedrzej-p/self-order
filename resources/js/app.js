import VueRouter from 'vue-router'
window.Vue = require('vue');
Vue.use(require('vue-resource'));
import 'bootstrap';
import App from './views/App'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import Home from './views/MainPage'
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },

        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    comments: false,
    router,
});
