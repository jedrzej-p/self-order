<template>
    <main class="main">
        <section id="cover">
            <div id="cover-caption">
                <div id="container" class="container">
                    <div class="row">
                        <div class="col-sm-6 offset-sm-3 text-center">
                            <div class="card">
                                <h2 class="text-center">Weryfikacja adresu e-mail</h2>
                                <br>
                                <div v-if="isSubmitting" class="d-flex justify-content-center">
                                    <div class="spinner-grow text-danger admin-loading-spinner" />
                                </div>

                                <template v-else>
                                    <div v-if="verifyMode">
                                        Wykryto zbyt dużą ilość żądań.<br />
                                        Odśwież stronę po upływie 1 minuty.
                                    </div>
                                    <template v-else>
                                        <div class="mb-0">
                                            Zanim przejdziesz dalej, sprawdź czy otrzymałeś link weryfikacyjny na adres e-mail podany podczas rejestracji.
                                        </div>
                                        <div class="mb-3">
                                            Jeżeli nie otrzymałeś wiadomości,
                                            <form action="#" class="d-inline" novalidate @submit.prevent="submit"><button type="submit" class="btn btn-link p-0 m-0 align-baseline" style="padding: 0 !important; border: none !important;">kliknij tutaj, aby wysłać ponownie</button>.</form>
                                        </div>
                                        <div class="mb-0">Jeżeli adres e-mail został zweryfikowany, <button type="button" class="btn btn-link p-0 m-0 align-baseline" style="padding: 0 !important; border: none !important;" @click="refreshApp">kliknij tutaj, aby odświeżyć aplikację</button>.</div>
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { getErrorsOrAlert } from "../../helpers/helpers";

export default {
    props: ["id", "hash", "email"],
    components: {
    },
    data() {
        return {
            isSubmitting: true,
            verifyMode: false,
        };
    },
    methods: {
        submit() {
            this.isSubmitting = true;
            axios
                .post("/api/email/resend")
                .then(({ data }) => alertify.success(data))
                .catch(({ response }) => {
                    getErrorsOrAlert(response);
                    this.isSubmitting = false;
                })
                .then(() => {
                    this.isSubmitting = false;
                });
        },
        verifyEmail() {
            axios
                .get(`/api/email/verify/${this.id}/${this.hash}/${this.email}`)
                .then(({ data }) => {
                    this.$store.dispatch("getLoggedUser").then(() => {
                        alertify.success(data);
                        this.$router.push({ name: "home" });
                    });
                })
                .catch(({ response }) => {
                    getErrorsOrAlert(response);
                    this.isSubmitting = false;
                });
        },
        refreshApp() {
            window.location.reload();
        },
    },
    created() {
        if (this.id !== undefined && this.hash !== undefined && this.email !== undefined) {
            this.verifyMode = true;
            this.verifyEmail();
        } else {
            this.isSubmitting = false;
        }
    },
};
</script>

<style lang="scss" scoped></style>
