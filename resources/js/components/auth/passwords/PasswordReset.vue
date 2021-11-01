<template>
    <main class="main">
        <section id="cover">
            <div id="cover-caption">
                <div id="container" class="container">
                    <div class="row">
                        <div class="col-sm-6 offset-sm-3 text-center">
                            <div class="card">
                                <h2 class="text-center">Reset hasła</h2>
                                <br>
                                <div v-if="msg.length" class="alert alert-success" role="alert">
                                    {{ msg }}
                                </div>

                                <form v-if="!isReseted" action="#" novalidate @submit.prevent="submit">
                                    <div class="form-group row">
                                        <label for="password" class="col-md-4 col-form-label font-weight-bold text-md-right">Hasło</label>

                                        <div class="col-md-6">
                                            <input id="password" v-model="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password || errors.email || errors.token }" />
                                            <span v-if="errors.password" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.password[0] }}</strong>
                                            </span>
                                            <span v-if="errors.email" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.email[0] }}</strong>
                                            </span>
                                            <span v-if="errors.token" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.token[0] }}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="password-confirm" class="col-md-4 col-form-label font-weight-bold text-md-right">Potwierdź hasło</label>

                                        <div class="col-md-6">
                                            <input id="password-confirm" v-model="password_confirmation" type="password" class="form-control" name="password_confirmation" />
                                        </div>
                                    </div>

                                    <div class="form-group row mb-0">
                                        <div class="col-12 col-md-8 offset-md-4 text-center text-md-left">
                                            <button type="submit" class="btn btn-primary text-uppercase mb-3" :disabled="isSubmitting">
                                                {{ submitBtnText }}
                                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div v-else class="text-center">
                                    <router-link :to="{ name: 'login' }" class="btn btn-save text-uppercase">Zaloguj się</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { getErrorsOrAlert } from "../../../helpers/helpers";

export default {
    props: ["token"],
    components: {
    },
    data() {
        return {
            password: "",
            password_confirmation: "",
            email: this.$route.query.email,
            errors: {},
            msg: "",
            isSubmitting: false,
            isReseted: false,
        };
    },
    computed: {
        submitBtnText() {
            return this.isSubmitting ? "Resetowanie hasła..." : "Zresetuj hasło";
        },
    },
    methods: {
        submit() {
            this.isSubmitting = true;
            axios
                .post("/api/password/reset", {
                    email: this.email,
                    token: this.token,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                })
                .then(({ data }) => {
                    this.msg = data;
                    this.isReseted = true;
                })
                .catch(({ response }) => {
                    this.errors = getErrorsOrAlert(response);
                })
                .then(() => {
                    this.isSubmitting = false;
                });
        },
    },
};
</script>

<style lang="scss" scoped></style>
