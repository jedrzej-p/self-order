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
            <div id="success" style="display: none" class="alert alert-info" role="alert"></div>
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
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">Dodaj</button>
                        </div>
                    </div>
                </form>
                <div v-if="product.description != null" class="col-12 col-lg-9 mt-3">
                    <h3>Opis</h3>
                    <p v-html="product.description"></p>
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
            product: {},
            quantity: '',
            product_id: '',
        };
    },
    mounted(){
        this.loadProduct();
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
                $('#success').css("display", "block");
                $('#success').html(response.data.message);
            })
        },
    }
};
</script>

<style lang="scss" scoped></style>