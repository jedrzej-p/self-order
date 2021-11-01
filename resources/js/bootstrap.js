import Vue from "vue";
import router from "./router/router";
import { getToken, isLoggedIn, logout } from "./utils/jwt";
import store from "./store/store";

// ===== Lodash, jQuery i Bootstrap =====
window._ = require("lodash");
window.moment = require("moment");
window.alertify = require("alertifyjs");

window.moment.locale("pl");

alertify.set("notifier", "position", "bottom-center");
window.Popper = require("popper.js").default;
window.$ = window.jQuery = require("jquery");
require("bootstrap");


// ===== Konfiguracja router =====
router.beforeEach((to, from, next) => {
    $(".collapse").collapse("hide");
    if (to.matched.some((record) => record.meta.requiresGuest)) {
        if (isLoggedIn()) {
            next({ name: "home" });
        } else {
            next();
        }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (isLoggedIn()) {
            next();
        } else {
            next({ name: "login" });
        }
    } else if (to.matched.some((record) => record.meta.requiresNotVerified)) {
        const verifyUrl = to.params.id && to.params.hash && to.params.email;
        if (verifyUrl) {
            next();
        } else if (isLoggedIn()) {
            if (store.state.loggedUser.email_verified_at === null) {
                next();
            } else {
                next({ name: "home" });
            }
        } else {
            next({ name: "login" });
        }
    } else if (to.matched.some((record) => record.meta.requiresVerified)) {
        if (!isLoggedIn()) {
            next({ name: "login" });
        } else if (store.state.loggedUser.email_verified_at) {
            next();
        } else {
            next({ name: "verify" });
        }
    } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
        if (!isLoggedIn()) {
            next({ name: "login" });
        } else if (store.state.loggedUser.is_admin) {
            next();
        } else {
            next({ name: "home" });
        }
    } else {
        next();
    }
});
// ==========

// ===== Konfiguracja axios =====
window.axios = require("axios");

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// przekierowanie do formularza logowania gdy 401
axios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response.status === 401) {
            logout();
            return true;
        }
        if (error.response.status === 402) {
            router.push({ name: "home" });
            return true;
        }
        return Promise.reject(error);
    }
);

// dołączenie nagłówka autoryzacji
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// ==========

// SW
if ("serviceWorker" in navigator) {
    window.addEventListener(
        "load",
        () => {
            navigator.serviceWorker.register("/sw.js").catch((err) => console.log(err));
        },
        false
    );
}
