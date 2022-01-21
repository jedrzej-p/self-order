<template>
    <main class="main">
        <section id="cover">
            <div id="cover-caption">
                <div id="container" class="container">
                    <div class="row">
                        <div class="col-sm-6 offset-sm-3 text-center">
                            <div class="card">
                                <h2 class="text-center">Rejestracja</h2>
                                <form action="#" novalidate @submit.prevent="submit">
                                     <div class="form-group row">
                                        <label for="name" class="col-md-4 col-form-label font-weight-bold text-md-right">Imię</label>
                                        <div class="col-md-6">
                                            <input id="name" v-model="name" type="text" class="form-control" :class="{ 'is-invalid': errors.name }" />
                                            <span v-if="errors.name" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.name[0] }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                     <div class="form-group row">
                                        <label for="surname" class="col-md-4 col-form-label font-weight-bold text-md-right">Nazwisko</label>
                                        <div class="col-md-6">
                                            <input id="surname" v-model="surname" type="text" class="form-control" :class="{ 'is-invalid': errors.surname }"  />
                                            <span v-if="errors.surname" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.surname[0] }}</strong>
                                            </span>
                                        </div>
                                    </div>
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
                                            <input id="password" v-model="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" autocomplete="new-password" />
                                            <span v-if="errors.password" class="invalid-feedback" role="alert">
                                                <strong>{{ errors.password[0] }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="password-confirm" class="col-md-4 col-form-label font-weight-bold text-md-right">Potwierdź hasło</label>
                                        <div class="col-md-6">
                                            <input id="password-confirm" v-model="password_confirmation" type="password" class="form-control" autocomplete="new-password" />
                                        </div>
                                    </div>
                                    <div class="form-group row mb-0">
                                        <div class="col-12 col-md-8 offset-md-4 text-center text-md-left">
                                            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                                {{ submitBtnText }}
                                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" />
                                            </button>
                                        </div>
                                    </div>
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
            name: "",
            surname: "",
            password_confirmation: "",
            errors: {},
            isSubmitting: false,
        };
    },
    computed: {
        submitBtnText() {
            return this.isSubmitting ? "Rejestrowanie..." : "Zarejestruj";
        },
    },
    methods: {
        submit() {
            this.isSubmitting = true;
            axios
                .post("/api/register", {
                    email: this.email,
                    name: this.name,
                    surname: this.surname,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
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

<style lang="scss" scoped></style>
