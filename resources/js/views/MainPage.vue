<template>
    <main-layout>
        <div class="container">
           <p>test</p>
        </div>
    </main-layout>
</template>
<style scoped>

</style>
<script>
    import MainLayout from '@views/layout/Main'

    export default {
        data() {
            return {
                
            }
        },
        mounted(){
           
        },
        components: {
            MainLayout,
        },
        computed: {

        },
        methods:{

        
        },
        beforeRouteEnter (to, from, next) {
        if ( ! localStorage.getItem('jwt')) {
            return next('login')
        }
        next()
        }
    }
</script>
