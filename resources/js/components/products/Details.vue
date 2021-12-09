<template>
    <main class="main">
        <div class="container mt-4">
            <div v-if="product.product_images.length > 0" id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                    <div v-for="(image, index) in product.product_images" :key="image.id">
                        <div :class="index == 0 ? 'carousel-item active' : 'carouse-item'">
                            <img class="d-block w-100" v-bind:src="image.url" alt="First slide" />
                        </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
            <div class="row">
                <div class="col-12 text-center">
                    <h2 style="color: #2574A9">{{ product.name }}</h2>
                </div>
                <div class="col-12 col-lg-9">
                    <span style="font-size: 19px;"><strong>Cena: </strong> {{ product.price }} zł</span>
                </div>
                <form class="col-12 col-lg-3" @submit.prevent="addToCart">
                    <div class="input-group mb-3">
                        <input id="quantity" type="number" class="form-control" name="quantity" v-model="quantity" min="1" step="1" required>
                        <span v-if="success" class="invalid-feedback" role="alert">
                            <strong>{{ success }}</strong>
                        </span>
                        <div class="">
                            <button type="submit" class="btn btn-primary">Dodaj</button>
                        </div>
                    </div>
                </form>
                <div class="col-12" v-if="isAddToFavorite == false">
                    <form class="col-12 col-lg-12" @submit.prevent="addProductToFavorite"><button type="submit" class="btn btn-primary">Dodaj do ulubionych</button></form>
                </div>
                <div class="col-12" v-else>
                    <form class="col-12 col-lg-12" @submit.prevent="removeProductFromFavorite"><button type="submit" class="btn btn-primary">Usuń z ulubionych</button></form>
                </div>
                <div class="col-12 pt-4" style="padding-left: 30px;"> 
                    <button class="btn btn-primary" @click="open_opinion_popup">Dodaj opinię</button>
                </div>
                <div v-if="product.description != null" class="col-12 col-lg-9 mt-3">
                    <h3>Opis</h3>
                    <p v-html="product.description"></p>
                </div>
            </div>

            <div class="col-12"> 
                <div class="col-12">
                    <h2 class="text-center">Opinie o produkcie {{product.name}} ({{ratings.length}}) {{avg_round}} </h2>
                </div>
                <div class="col-12 bg-light p-2">
                    <div class="row">
                        <div class="col-2">
                            <span class="text-center">Ocena</span>
                        </div> 
                        <div class="col-10"> 
                            Opinia
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row p-2" v-for="rating in ratings" :key="rating.id">
                        <div class="col-2">
                            <span class="text-center">{{rating.rating}}</span>
                        </div> 
                        <div class="col-10"> 
                            {{rating.opinion}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="opinion_popup" style="display: none; position: absolute; top: 0px; left: 0px; background-color: #E8E8E8; width:100%; height: 100%;">
            <div class="col-12 d-flex justify-content-end p-2"> 
                <button class="btn btn-danger py-1 px-2" @click="close_opinion_popup">X</button>
            </div>
            <div class="d-flex justify-content-center" style="width: 100%; height: 100%;"> 
                <div class="col-12">
                    <form @submit.prevent="send_opinion">
                        <div class="col-12">
                            <div class="col-12">
                                Jak oceniasz danie?
                            </div>
                            <div class="col-12 py-4">
                                <select class="form-control" v-model="rating" required>
                                    <option v-bind:value="5">5</option>
                                    <option v-bind:value="4">4</option>
                                    <option v-bind:value="3">3</option>
                                    <option v-bind:value="2">2</option>
                                    <option v-bind:value="1">1</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12"> 
                            <div class="col-12"> 
                                <textarea class="form-control" rows="4" cols="10" placeholder="Napisz opinię" v-model="opinion" required></textarea>
                            </div>
                        </div>
                        <div class="col-12 py-4">
                            <div class="col-12" style="display: flex; justify-content: center;"> 
                                <input type="submit" class="btn btn-primary" value="Dodaj opinię">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";
import { getSuccessAlert } from "../../helpers/helpers";

export default {
    data() {
        return {
            product: {},
            quantity: '',
            product_id: '',
            success: {},
            isAddToFavorite: false,
            rating: '5',
            opinion: '',
            ratings: [],
            sum: '',
            avg: '',
            avg_round: '',
        };
    },
    mounted(){
        this.loadProduct();
        this.CheckIfProductIsAddToFavorite();
        this.loadRatings();
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods: {
        loadProduct: function() {
        axios.get("/api/product/" + this.$route.params.id).then(res => {
            if (res.status == 200) {
                this.product = res.data;
            }
            }).catch(err => {
                console.log(err);
            });
        },
        addToCart(){
            axios.post('/api/add-to-cart', {product_id: this.product.id, quantity: this.quantity }).then((response)=>{
                this.success = getSuccessAlert(response.data.message);
            })
        },
        addProductToFavorite(){
            axios.post('/api/favorite-add-product',{product_id: this.product.id})
            .then((response)=>{
                this.success = getSuccessAlert(response.data.message);
                window.location.reload();
            })
        },
        CheckIfProductIsAddToFavorite() {
            axios.get('/api/favorite/product/' + this.$route.params.id).then(res=>{
            if(res.status==200){
                if(res.data == 1) {
                    this.isAddToFavorite = true; 
                }
            }
            }).catch(err=>{
                console.log(err)
            });
        },
        removeProductFromFavorite() {
            axios.post('/api/favorite-remove-product',{product_id: this.$route.params.id})
            .then((response)=>{
                this.success = getSuccessAlert(response.data.message);
                window.location.reload();
            })
        },
        open_opinion_popup: function()
        {
            let opinion_popup = document.querySelector('.opinion_popup');

            opinion_popup.style.display = "block";
            
            let body = document.querySelector('body');
            body.style.overflow = "hidden"; 
        },
        close_opinion_popup: function()
        {
            let opinion_popup = document.querySelector('.opinion_popup');

            opinion_popup.style.display = "none";
            let body = document.querySelector('body');
            body.style.overflow = "auto";
        },
        loadRatings: function() {
        axios.get("/api/product/ratings/" + this.$route.params.id).then(res => {
            if (res.status == 200) {
                this.ratings = res.data;
                
                let list=[];

                if(this.ratings.length>0)
                {
                    this.ratings.forEach(e=>{
                        list.push(e.rating);
                        this.sum = list.reduce((a, b) => a + b, 0); 
                    })
                    this.avg = parseInt(this.sum)/this.ratings.length;
                    this.avg_round = this.avg.toFixed(2);
                }
                else
                {
                    this.avg_round = ""
                }

            }
            }).catch(err => {
                console.log(err);
            });
        },
        send_opinion: function()
        {
            axios.post('/api/save_rating', {
                product_id: this.$route.params.id,
                rating: this.rating,
                opinion: this.opinion,
            }).then(res=>{
                if(res.status==200)
                {
                   window.location.reload();
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped></style>
