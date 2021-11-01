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

                                    <div class="form-group row mb-0">
                                        <div class="col-12 col-md-8 offset-md-4 text-center text-md-left">
                                            <button type="submit" class="btn btn-primary text-uppercase" :disabled="isSubmitting">
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
import { getErrorsOrAlert } from "../../../helpers/helpers";

export default {
    components: {
    },
    data() {
        return {
            email: "",
            errors: {},
            msg: "",
            isSubmitting: false,
        };
    },
    computed: {
        submitBtnText() {
            return this.isSubmitting ? "Wysyłanie linku..." : "Wyślij link do zresetowania hasła";
        },
    },
    methods: {
        submit() {
            this.isSubmitting = true;
            axios
                .post("/api/password/email", { email: this.email })
                .then(({ data }) => {
                    this.msg = data;
                    this.errors = {};
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
