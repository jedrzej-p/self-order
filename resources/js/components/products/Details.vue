<template>
    <main class="main">
        <div v-if="isModalOpened == false" class="container mt-4">
            <!-- Karuzela ze zdjęciami -->
            <div v-if="product.product_images.length > 0" id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                    <div v-for="(image, index) in product.product_images" :key="image.id">
                        <div v-if="index==0" :class="index == 0 ? 'carousel-item active' : 'carouse-item'">
                            <img class="img-fluid rounded" v-bind:src="`/images/products/${image.url}`" alt="First slide" />
                        </div>
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Poprzednie zdjęcie</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Następne zdjęcie</span>
                </a>
            </div>
            <div class="row mt-3">
                <div class="col-12 text-center">
                    <h2>{{ product.name }}</h2>
                </div>
                <div class="col-12 col-lg-9 mb-2">
                    <span style="font-size: 22px;"><strong>Cena: </strong> {{ product.price }} zł</span>
                </div>
                <div class="col-12">
                    <div class="row mx-0 justify-content-between">
                        <form @submit.prevent="addToCart" style="min-width: 280px">
                            <div class="input-group mb-3">
                                <input id="quantity" type="number" class="form-control" placeholder="Wybierz ilość" aria-label="Wybór ilości" aria-describedby="basic-addon2" name="quantity" v-model="quantity" min="1" step="1" required>
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit"><i class="fas fa-shopping-basket"></i></button>
                                </div>
                            </div>
                            <span v-if="success" class="invalid-feedback" role="alert">
                                <strong>{{ success }}</strong>
                            </span>
                        </form>
                        <div v-if="isAddToFavorite == false">
                            <form class="px-0" @submit.prevent="addProductToFavorite"><button type="submit" class="btn btn-primary"><i class="far fa-heart"></i></button></form>
                        </div>
                        <div v-else>
                            <form class="px-0" @submit.prevent="removeProductFromFavorite"><button type="submit" class="btn btn-primary"><i class="fas fa-heart"></i></button></form>
                        </div>
                    </div>
                </div>
                <div v-if="product.description != null" class="col-12 col-lg-9 mt-3">
                    <h3>Opis</h3>
                    <p class="product-desc" v-html="product.description"></p>
                </div>
            </div>
            <!--Zdjęcia użytkowników-->
            <div class="col-12 py-4 px-0" v-if="product.product_user_image.length>0">
                <div class="col-12 p-0"> 
                    <h4 class="p-0">Zdjęcia wykonane przez klientów</h4>
                </div>
                <div class="row">
                    <div class="col-3" v-for="(user_image) in product.product_user_image" :key="user_image.id">
                        <div class="col-12 d-flex position-relative">
                            <button class="d-flex position-absolute bg-danger px-2 py-1 rounded" style="right: 10px; top 10px;" v-if="user_image.user_id==current_user.id" @click.prevent="deleteUserImage(user_image.id)">X</button>
                            <img class="d-block py-2 w-100" v-bind:src="`/images/products_users/${user_image.url}`" alt="slide" />
                        </div>
                    </div>
                </div> 

            </div>
            <!-- Opinie o daniu -->
            <div class="row mx-0"> 
                <div class="col-8 pl-0">
                    <h3 class="text-left">Opinie ({{ratings.length}}) {{avg_round}}/5 </h3>
                </div>
                <div class="col-4 px-0 text-right" v-if="isAddRating!=1"> 
                    <button class="btn btn-primary" @click="open_opinion_popup">Dodaj</button>
                </div>
                <div class="col-4 px-0 text-right" v-else> 
                    <button class="btn btn-primary" @click="open_opinion_popup">Edytuj</button>
                </div>
                <div class="col-12 px-0 mt-2">
                    <div class="row mx-0 rating mb-3" v-for="rating in ratings" :key="rating.id">
                        <div class="col-12 rating-name text-left">
                            <span>{{rating.user.name}}</span>
                        </div>
                        <div class="col-12 rating-value text-left">
                            <span>Ocena: {{rating.rating}}</span>
                        </div> 
                        <div class="col-12 rating-desc"> 
                            {{rating.opinion}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal opinii -->
        <div v-else class="opinion_popup" style="position: fixed; top: 0px; left: 0px; width:100%; height: 100%; z-index: 10; background-color: inherit;">
            <div class="col-12 d-flex justify-content-end p-2"> 
                <button class="btn btn-danger py-1 px-2" @click="close_opinion_popup">X</button>
            </div>
            <div class="d-flex justify-content-center" style="width: 100%; height: 100%;"> 
                <!-- Dodawanie opinii -->
                <div class="col-12" v-if="isAddRating!=1">
                    <form @submit.prevent="send_opinion">
                        <div class="col-12 px-0 pb-2">
                            <div class="col-12">
                                Jak oceniasz danie?
                            </div>
                            <div class="col-12 pb-3">
                                <select class="form-control" v-model="rating" required>
                                    <option v-bind:value="5">5</option>
                                    <option v-bind:value="4">4</option>
                                    <option v-bind:value="3">3</option>
                                    <option v-bind:value="2">2</option>
                                    <option v-bind:value="1">1</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 px-0 pb-3"> 
                            <div class="col-12"> 
                                <textarea class="form-control" rows="4" cols="10" placeholder="Napisz opinię" v-model="opinion" required></textarea>
                            </div>
                        </div>
                        <div class="col-12 px-0 pb-3">
                            <div class="col-12">
                                <span class="pb-2">Dodaj swoje zdjęcie do dania</span>
                                <input class="form-control" type="file" v-on:change="onFileChange">
                            </div>
                        </div>
                        <div class="col-12 px-0 mt-3">
                            <div class="col-12" style="display: flex; justify-content: center;"> 
                                <input type="submit" class="btn btn-primary" value="Dodaj opinię">
                            </div>
                        </div>
                    </form>
                </div>
                <!-- Edycja opinii -->
                <div class="col-12" v-else >
                    <form @submit.prevent="update_opinion">
                        <div class="col-12 px-0">
                            <div class="col-12 pb-2">
                                Jak oceniasz danie?
                            </div>
                            <div class="col-12 pb-3">
                                <select class="form-control" v-model="userRating.rating" required>
                                    <option v-bind:value="5">5</option>
                                    <option v-bind:value="4">4</option>
                                    <option v-bind:value="3">3</option>
                                    <option v-bind:value="2">2</option>
                                    <option v-bind:value="1">1</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12 px-0 pb-3"> 
                            <div class="col-12"> 
                                <textarea class="form-control" rows="4" cols="10" placeholder="Edytuj opinię" v-model="userRating.opinion" required></textarea>
                            </div>
                        </div>
                        <div class="col-12 px-0 pb-3">
                            <div class="col-12">
                                <span class="pb-2">Dodaj swoje zdjęcie do dania</span>
                                <input class="form-control" type="file" v-on:change="onFileChange">
                            </div>
                        </div>
                        <div class="col-12 px-0 mt-3">
                            <div class="col-12" style="display: flex; justify-content: center;"> 
                                <input type="submit" class="btn btn-primary" value="Aktualizuj opinię">
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
import { getSuccessAlert, getErrorsOrAlert } from "../../helpers/helpers";

export default {
    data() {
        return {
            product: {},
            quantity: '',
            product_id: '',
            success: {},
            isAddToFavorite: false,
            isModalOpened: false,
            rating: '5',
            opinion: '',
            ratings: [],
            sum: 0,
            avg: '',
            avg_round: '',
            isAddRating: '',
            userRating: {},
            photo: '',
            current_user: {},
            
        };
    },
    mounted(){
        this.loadProduct();
        this.CheckIfProductIsAddToFavorite();
        this.loadRatings();
        this.CheckIfProductIsAddRating();
        this.loadUserRating();
        this.getCurrentUser();
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods: {
        onFileChange(e){
                this.photo = e.target.files[0]; 
        },

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
            this.isModalOpened = true; //Modal zostanie otwarty, strona schowana
        },
        close_opinion_popup: function()
        {
            this.isModalOpened = false; //Modal zostanie schowany, strona otwarta
        },
        loadRatings: function() {
            axios.get("/api/product/ratings/" + this.$route.params.id).then(res => {
                if (res.status == 200) {
                    this.ratings = res.data;
                    
                    let list=[];

                    if(this.ratings.length > 0)
                    {
                        for (let i = 0; i < this.ratings.length; i++) {
                            this.sum = this.sum + parseInt(this.ratings[i].rating);
                        }

                        this.avg = parseInt(this.sum)/this.ratings.length;
                        this.avg_round = this.avg;
                    } else {
                        this.avg_round = ""
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
        send_opinion: function()
        {
            const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                let data = new FormData();
                data.append('product_id', this.$route.params.id);
                data.append('rating', this.rating);
                data.append('opinion', this.opinion);
                data.append('photo', this.photo);


            axios.post('/api/save_rating', data, config).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert('Dodano Twoją opinię do potrawy')
                   window.location.reload();
                }
            })
        },

        CheckIfProductIsAddRating() {
            axios.get('/api/rating/product/' + this.$route.params.id).then(res=>{
            if(res.status==200){
                if(res.data) {
                    this.isAddRating = true; 
                }
            }
            }).catch(err=>{
                console.log(err)
            });
        },

        loadUserRating: function() {
            axios.get("/api/rating/user/product/" + this.$route.params.id).then(res => {
                if (res.status == 200) {
                    this.userRating = res.data;
                }
            })
        },

        update_opinion: function()
        {
            const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                let data = new FormData();
                data.append('product_id', this.$route.params.id);
                data.append('rating_id', this.userRating.id);
                data.append('opinion', this.userRating.opinion);
                data.append('rating', this.userRating.rating);
                data.append('photo', this.photo);


            axios.post('/api/rating/user/product/update', data, config).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert('Zaktualizowano Twoją opinię')
                    window.location.reload();
                }
                else
                {
                    getErrorsOrAlert('Wystąpił błąd');
                }
            })
        },

        getCurrentUser:function()
        {
            axios.get('/api/user').then(res => {
                if(res.status==200)
                {
                   this.current_user = res.data;
                }
            })
        },

        deleteUserImage: function(id)
        {
            axios.post('/api/user/image_delete', {
                image_id: id,
            }).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Usunięto zdjęcie");
                    window.location.reload();
                }
                else
                {
                    getErrorsOrAlert("Wystąpił błąd");
                }
            })
        }

    }
};
</script>

<style lang="scss" scoped></style>
