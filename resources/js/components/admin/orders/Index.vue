<template>
    <div class="container mb-3">
        <Menu />
      <!--   <select name="changeStatus" @change="getOrdersByStatus($event)" class="form-control">
            <option value="2">Złożony</option>
            <option value="3">Gotowy</option>
            <option value="4">Zrealizowany</option>
            <option value="5">Wszystkie</option>
        </select> -->
        <div class="card-body table-responsive p-0">
            <div class="products">
                <div class="row mb-3" v-for="order in orders" :key="order.id">
                    <div class="col-12">
                        <h3>{{ order.nr }}</h3>
                    </div>
                    <div class="col-12">
                        <label for="status">Status:</label>
                        <select name="changeStatus" @change="changeStatus(order.id, $event)" class="form-control">
                            <option value="1" :selected="1 == order.status">Złożony</option>
                            <option value="2" :selected="2 == order.status">Gotowy</option>
                            <option value="3" :selected="3 == order.status">Zrealizowany</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <h4 style="color: green" v-if="order.is_paid == 1">Opłacone</h4>
                        <h4 style="color: red" v-else>Nieopłacone</h4>
                    </div>
                    <div style="display: flex" class="mt-2" v-for="position in order.positions" :key="position.id"> 
                        <div class="col-6" v-if="position.product.product_images.length == 0">
                            <img src="/images/no-photo.png" style="width: 120px; height: 120px;" />
                        </div>
                        <div class="col-6" v-for="(image, index) in position.product.product_images" :key="image.id">
                            <img v-if="index == 0" v-bind:src="image.url" style="width: 120px; height: 120px;" />
                        </div>
                        <div class="col-6">
                            <h5 class="card-title">{{position.product.name}}</h5>
                            <p class="card-text">{{position.product.price}}</p>
                            <router-link :to="{name: 'product', params: { id: position.product.id }}" :title="position.product.name" class="btn btn-primary">Szczegóły</router-link>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from "../Menu";

export default {
    data(){
        return {
            orders: [],
            status: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadOrders();
    },
    methods: {
        loadOrders:function(){
            axios.get('/api/admin/orders').then(res=>{
                if(res.status==200){
                    this.orders=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },
        changeStatus(id, event) {
            axios.post('/api/admin/orders/change-status/' + id, {status: event.target.value }).then((response)=>{
                // $('#success').css("display", "block");
                // $('#success').html(response.data.message);
            })
        },
        getOrdersByStatus(event) {
            console.log(event.target.value);
            axios.get('/api/admin/orders/status/' + event.target.value).then(res=>{
                if(res.status==200){
                    this.orders=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        }
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
