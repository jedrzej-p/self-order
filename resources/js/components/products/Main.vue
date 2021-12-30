<template>
    <main class="main">
        <div class="container p-3" style="background-color: rgb(245, 245, 245)">
            <div class="mb-4"> 
                <!-- <form> -->
                    <div class="row">
                        <div class="col-6">
                            <input class="form-control" type="text" v-model="search" placeholder="Szukaj potraw" autocomplete="off" @keyup="searchProducts">
                        </div>
                        <div class="col-6">
                            <select class="form-control" v-model="select_category" @change="searchProducts">
                                <option v-bind:value="0">Wszystkie kategorie</option>
                                <option v-for="category in categories" :key="category.id" v-bind:value="category.id">{{category.name}}</option>
                            </select>
                        </div>
                    </div>
                <!-- </form> -->
            </div>
            <div v-if="search_bool==0">
                <div class="category" v-for="category in categories" :key="category.id">
                    <h3 class="mb-3 font-weight-bold text-center">{{category.name}}</h3>
                    <div class="products">
                        <div class="row mx-0 mb-3 product" v-for="product in category.products" :key="product.id">
                            <div class="col-4 pr-0" v-if="product.product_images.length == 0">
                                <img class="img-fluid" src="/images/no-photo.png" style="width: 120px; height: 120px;" />
                            </div>
                            <div class="col-4 pr-0" v-for="(image, index) in product.product_images" :key="image.id">
                                <img class="img-fluid" v-if="index == 0" v-bind:src="`/images/products/${image.url}`"/>
                            </div>
                            <div class="col-8 pr-0">
                                <h5 class="card-title pt-1 mb-1">{{product.name}}</h5>
                                <p class="card-text">{{product.price}}</p>
                                <router-link :to="{name: 'product', params: { id: product.id }}" :title="product.name" class="btn btn-primary">Szczegóły</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div v-else> 
                <div> 
                     <div class="products">
                         <div class="col-12 d-flex justify-content-end p-2"> 
                <button class="btn btn-danger py-1 px-2" @click="close_search">X</button>
            </div>
                         <h2 class="text-center">Lista potraw, które spełniają kryteria wyszukiwania ({{products.length}})</h2>
                        <div class="row mb-3" v-for="product in products" :key="product.id">
                            <div class="col-4" v-if="product.product_images.length == 0">
                                <img src="/images/no-photo.png" style="width: 120px; height: 120px;" />
                            </div>
                            <div class="col-4" v-for="(image, index) in product.product_images" :key="image.id">
                                <img v-if="index == 0" v-bind:src="`/images/products/${image.url}`" style="width: 120px; height: 120px;" />
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
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {
            categories: [],
            products: [],
            search: '',
            select_category: 0,
            search_bool: 0,
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
        searchProducts: function() {
            console.log('search: '+this.search+'category: '+this.select_category,)
            axios.post('api/search_products', {
                search: this.search,
                select_category: this.select_category,
            }).then(res=>{
                if(res.status==200)
                {
                    
                        this.products = res.data;
                        this.search_bool=1
                    
                }
            })
        },

        close_search: function()
        {
            this.search_bool=0
        }
    },
};
</script>

<style lang="scss" scoped></style>
