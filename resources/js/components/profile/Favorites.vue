<template>
    <div class="container mb-3">
        <Menu />
        <div class="card-body table-responsive p-0">
            <div class="products">
                <div class="row mb-3" v-for="favorite in favorites" :key="favorite.id">
                    <div class="col-4" v-if="favorite.product_images.length == 0">
                        <img src="/images/no-photo.png" style="width: 120px; height: 120px;" />
                    </div>
                    <div class="col-4" v-for="(image, index) in favorite.product_images" :key="image.id">
                        <img v-if="index == 0" v-bind:src="image.url" style="width: 120px; height: 120px;" />
                    </div>
                    <div class="col-8">
                        <h5 class="card-title">{{favorite.name}}</h5>
                        <p class="card-text">{{favorite.price}}</p>
                        <router-link :to="{name: 'product', params: { id: favorite.id }}" :title="favorite.name" class="btn btn-primary">Szczegóły</router-link>
                    </div>
                </div>
            </div>
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
