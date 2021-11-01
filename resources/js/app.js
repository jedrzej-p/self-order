import Vue from "vue";
import App from "./components/App";
import store from "./store/store";
import router from "./router/router";
import "es6-promise/auto";
import { isLoggedIn } from "./utils/jwt";

require("./utils/fontawesome");
require("./bootstrap");

Vue.config.productionTip = false;

function createApp() {
    new Vue({
        el: "#app",
        store,
        router,
        render: (h) => h(App),
    });
}

if (isLoggedIn()) {
    store.dispatch("getLoggedUser")
        .then(() => createApp());
} else {
    createApp();
}
