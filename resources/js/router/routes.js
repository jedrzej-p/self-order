import Home from "../components/static/Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Verify from "../components/auth/Verify";
import PasswordEmail from "../components/auth/passwords/PasswordEmail";
import PasswordReset from "../components/auth/passwords/PasswordReset";
import Products from "../components/products/Main";
import Product from "../components/products/Details";
import Cart from "../components/cart/Index";
import Summary from "../components/cart/Summary";
import UserOrders from "../components/profile/Orders";
import UserFavorites from "../components/profile/Favorites";

//admin
import AdminOrders from "../components/admin/orders/Index";

export default [
    { path: "/", component: Home, name: "home" },
    { path: "/login", component: Login, name: "login", meta: { requiresGuest: true } },
    { path: "/register", component: Register, name: "register", meta: { requiresGuest: true } },
    { path: "/email/verify/:id?/:hash?/:email?", component: Verify, name: "verify", props: true, meta: { requiresNotVerified: true } },
    { path: "/password/reset", component: PasswordEmail, name: "password-request", meta: { requiresGuest: true } },
    { path: "/password/reset/:token", component: PasswordReset, name: "password-reset", props: true, meta: { requiresGuest: true } },

    { path: '/products', name: 'products', component: Products },
    { path: '/product/:id', name: 'product', component: Product },

    { path: '/cart', name: 'cart', component: Cart },
    { path: '/summary', name: 'summary', component: Summary },

    //user 

    { path: '/user/orders', name: 'user-orders', component: UserOrders },
    { path: '/user/favorites', name: 'user-favorites', component: UserFavorites },

    //admin

    { path: '/admin/orders', name: 'admin-orders', component: AdminOrders },
];
