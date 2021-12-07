<template>
    <main class="main">
        <div class="container mt-4">
            <div class="category" v-for="category in categories" :key="category.id">
                <h3 class="mb-3 font-weight-bold text-center">{{category.name}}</h3>
                <div class="products">
                    <div class="row mb-3" v-for="product in category.products" :key="product.id">
                         <div class="col-4" v-if="product.product_images.length == 0">
                            <img src="/images/static/no-photo.png" style="width: 120px; height: 120px;" />
                        </div>
                        <div class="col-4" v-for="(image, index) in product.product_images" :key="image.id">
                            <img v-if="index == 0" v-bind:src="image.url" style="width: 120px; height: 120px;" />
                        </div>
                        <div class="col-8">
                            <h5 class="card-title">{{product.name}}</h5>
                            <p class="card-text">{{product.price}}</p>
                            <router-link :to="{name: 'product', params: { id: product.id }}" :title="product.name" class="btn btn-primary">Szczegóły</router-link>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {
            categories: [],
        };
    },
    mounted(){
        this.loadCategories();
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods:{
        loadCategories:function(){
            axios.get('/api/categories').then(res=>{
                if(res.status==200){
                    this.categories=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>