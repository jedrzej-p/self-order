<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-0 p-lg-3">
        <a class="navbar-brand p-0 m-1" href="#">
            <img src="/logo.png" width="50" height="50" alt="">
        </a>
        <!-- Przycisk hamburgera -->
        <button class="navbar-toggler mr-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Navbar/Rozwijane menu -->
        <div class="collapse navbar-collapse px-3 px-lg-0" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <template v-if="!isLoggedIn">
                    <li class="nav-item">
                        <router-link :to="{ name: 'login' }" class="nav-link">Zaloguj</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'register' }" class="nav-link">Zarejestruj</router-link>
                    </li>
                </template>
                <template v-else>
                    <li class="nav-item">
                        <router-link :to="{ name: 'products' }" class="nav-link">Menu</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'cart' }" class="nav-link">Koszyk</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{ name: 'user-orders' }" class="nav-link">{{ loggedUser.email }}</router-link>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" @click.prevent="logout">
                            Wyloguj
                        </a>
                    </li>
                    <li class="nav-item">
                        <router-link v-if="loggedUser.is_admin == 1" :to="{ name: 'admin-orders' }" class="nav-link">Panel administratora</router-link>
                    </li>
                </template>
            </ul>
        </div>
    </nav>
</template>

<script>
import { logout, isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {};
    },
    computed: {
        loggedUser() {
            return this.$store.state.loggedUser;
        },
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods: {
        logout() {
            logout();
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
