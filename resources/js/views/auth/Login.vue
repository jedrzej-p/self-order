<template>
    <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh; background-color: #f4f5f7; flex-direction: column;">
        <div class="auth-form p-3 bg-white shadow-sm">
            <form method="POST" action="/login">
                <div class="form-group">
                    <label for="email" class="text-sm">Adres e-mail</label>
                    <input id="email" type="email" class="form-control" v-model="email" required autofocus>
                </div>
                <div class="form-group">
                    <label for="password" class="text-sm">Hasło</label>
                    <input id="password" type="password" class="form-control" v-model="password" required>
                </div>
                <div class="form-group mb-0 text-right">
                    <button type="submit" class="btn btn-dark-gray" @click="handleSubmit">
                        Zaloguj
                    </button>
                </div>
                <a style="color: black !important;" href="/register">Jeśli nie masz konta, zarejestruj się!</a>
            </form>
        </div>
        <!-- Alert jeśli wystąpi błąd -->
        <div v-if="error_message" class="alert alert-danger" role="alert" style="position: fixed; top: 1rem;">
            {{ error_message }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
    @media(min-width: 992px) {
        .auth-form {
            width: 22rem;
        }
    }
    .btn-dark-gray {
        background-color: #252f3f;
        color: white;
        font-weight: 500;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    }
    .text-sm {
        color: #343a40;
        font-family: Nunito, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
</style>
<script>
    export default {
        data(){
            return {
                email : "",
                password : "",
                error_message: null
            }
        },
        props: {
            title: {
                type: String,
                default: 'Logowanie'
            },
        },
        methods : {
            handleSubmit(e){
                e.preventDefault()

                if (this.password.length > 0) {
                    axios.post('api/login', {
                        email: this.email,
                        password: this.password
                    }).then(response => {
                        localStorage.setItem('user',response.data.success.email)
                        localStorage.setItem('jwt',response.data.success.token)

                        if (localStorage.getItem('jwt') != null){
                            this.$router.go('home')
                        }
                    }).catch(error => {
                        switch (error.response.status) {
                        case 422:                                       //Złe dane logowania
                            this.showError('Błędne dane logowania');
                            break;
                        default:                                        //Pozostałe błędy
                            console.error(error);
                            break;
                        }
                    });
                }
            },
            showError: function(message_value) {
                this.error_message = message_value;                     //Przekazanie wartości errora do property
                setTimeout(() => {                                      //Po 3000ms wywołuje funkcje chowającą alert
                    this.hideError();
                }, 3000);
            },
            hideError: function() {
                this.error_message = null;
            }
        },
        beforeRouteEnter (to, from, next) {
            if (localStorage.getItem('jwt')) {
                return next('/');
            }
            next();
        },
        watch: {
            title: {
                immediate: true,
                handler(title) {
                    document.title = title
                },
            },
        },
    }
</script>
