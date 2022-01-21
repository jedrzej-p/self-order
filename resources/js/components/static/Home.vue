<template>
    <main class="main">
        <section id="cover">
            <div id="cover-caption">
                <div id="container" class="container">
                    <div class="row mx-0">
                        <div class="col-sm-6 offset-sm-3 text-center">
                            <router-link :to="{ name: startBtnRoute }" class="btn btn-primary btn-start">Start</router-link>
                        </div>
                    </div>   
                </div>
            </div>
        </section>
        <div class="container mt-4">
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {};
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
        startBtnRoute() {
            return this.isLoggedIn ? "products" : "login";
        },
    },
};
</script>

<style lang="scss" scoped>
.btn-start {
    left: 0;
    position: absolute;
    text-align: center;
    top: 50%;
    width: 100%;
}
</style>
