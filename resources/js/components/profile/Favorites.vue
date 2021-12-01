<template>
    <div class="container mb-3">
        <Menu />
        <div class="card-body table-responsive p-0">
            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Nazwa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="favorite in favorites" :key="favorite.id">
                        <td>{{ favorite.id }}</td>
                        <td>{{ favorite.name }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Menu from "./Menu";

export default {
    data(){
        return {
            favorites: [],
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadFavorites();
    },
    methods: {
        loadFavorites:function(){
            axios.get('/api/user/favorites').then(res=>{
                if(res.status==200){
                    this.favorites=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },
    },
    computed: {
        loggedUser() {
            return this.$store.state.loggedUser;
        },
    },
};

</script>

<style lang="scss" scoped>


</style>
