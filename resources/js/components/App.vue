<template>
    <div class="main-container" :class="{ 'main-container-home': $route.name === 'home' }">
        <Navbar v-if="$route.name !== 'home' && $route.name !== 'login' && $route.name !== 'register' && $route.name !== 'password-reset' && $route.name !== 'verify' && $route.name !== 'password-request'" />

        <transition name="fade" mode="out-in">
            <router-view />
        </transition>

        <Footer v-if="$route.name !== 'home' && $route.name !== 'login' && $route.name !== 'register' && $route.name !== 'password-reset' && $route.name !== 'verify' && $route.name !== 'password-request'" />
    </div>
</template>

<script>
import Navbar from "./layout/NavbarVue";
import Footer from "./layout/FooterVue";

export default {
    components: {
        Navbar,
        Footer,
    },
    mounted() {
        const body = document.querySelector("body");
        body.classList.remove("is-loading");
    },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
