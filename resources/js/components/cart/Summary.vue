<template>
    <main class="main">
        <div class="container mt-4">
            <div v-if="error == '501'">Wystąpił błąd podczas dokonywania płatności. Prosimy o zgłoszenie się do pracownika restauracji.</div>
            <div v-else>Dziękujemy za złożenie zamówienia.</div>
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {
            error: ''
        };
    },
    mounted(){
       this.storeCart();
       this.getErrorCode();
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods: {
        storeCart() {
            axios.post('/api/store-cart').then( response => {
                
            }).catch((error) => {
                console.log(error);
                       
            });
        },
        getErrorCode() {
            if(this.$route.query.error) {
                this.error = this.$route.query.error;
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>