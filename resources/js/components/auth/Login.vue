<template>
    <main class="main">
        <section id="cover">
            <div id="cover-caption">
                <div id="container" class="container">
                    <div class="row">
                        <div class="col-sm-6 offset-sm-3 text-center">
                            <div class="card">
                                <h2 class="text-center">Logowanie</h2>
                                <br>
                                <form action="#" novalidate @submit.prevent="submit">
                                    <div class="form-group row">
                                        <label for="email" class="col-md-4 col-form-label font-weight-bold text-md-right">Adres e-mail</label>
                                        <div class="col-md-6">
                                            <input id="email" v-model="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" />
                                            <span v-if="errors.email" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.email[0] }}</strong>
                                            </span>
                                        </div>    
                                    </div>
                                    <div class="form-group row">
                                        <label for="password" class="col-md-4 col-form-label font-weight-bold text-md-right">Hasło</label>
                                        <div class="col-md-6">
                                            <input id="password" v-model="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
                                            <span v-if="errors.password" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.password[0] }}</strong>
                                            </span>
                                        </div>    
                                    </div>
                                    <div class="form-group mb-0 text-right">
                                        <button type="submit" class="btn btn-primary text-uppercase mb-3" :disabled="isSubmitting">
                                            {{ submitBtnText }}
                                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm" />
                                        </button>
                                        <div>
                                            <router-link v-show="!isSubmitting" :to="{ name: 'password-request' }"> Zapomniałeś hasła?</router-link>
                                        </div>
                                    </div>
                                    Jezeli nie masz konta, <router-link v-show="!isSubmitting" :to="{ name: 'register' }">Zarejestruj się</router-link>
                                </form>
                            </div>
                        </div>
                    </div>   
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { login } from "../../utils/jwt";
import { getErrorsOrAlert } from "../../helpers/helpers";

export default {
    components: {
    },
    data() {
        return {
            email: "",
            password: "",
            remember: false,
            errors: {},
            isSubmitting: false,
        };
    },
    computed: {
        submitBtnText() {
            return this.isSubmitting ? "Logowanie..." : "Zaloguj";
        },
    },
    methods: {
        submit() {
            this.isSubmitting = true;
            axios
                .post("/api/login", {
                    email: this.email,
                    password: this.password,
                    remember: this.remember,
                })
                .then(({ data }) => {
                    login(data);
                    window.location.replace("/");
                })
                .catch(({ response }) => {
                    this.errors = getErrorsOrAlert(response);
                    this.isSubmitting = false;
                });
        },
    },
};
</script>

<style lang="scss">
    html,
    body {
        height: 100%;
    }
</style>
