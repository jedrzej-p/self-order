<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">SelfOrder</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
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
                        <router-link v-if="loggedUser.is_admin" :to="{ name: 'admin-orders' }" class="nav-link">Panel administratora</router-link>
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
