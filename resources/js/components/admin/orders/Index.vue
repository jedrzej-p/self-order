<template>
    <div class="container mb-3">
        <Menu />
        <label for="sort" class="font-weight-bold">Sortuj:</label>
        <select name="changeStatus" @change="getOrdersByStatus($event)" class="form-control mb-3">
            <option value="4">Wszystkie</option>
            <option value="1">Złożony</option>
            <option value="2">Gotowy</option>
            <option value="3">Zrealizowany</option>
        </select>
        <hr>
            <div class="products" v-if="orders.length > 0">
                <div class="row mb-3" v-for="order in orders" :key="order.id">
                    <div class="col-12">
                        <h3>{{ order.nr }}</h3>
                    </div>
                    <div class="col-12">
                        <label for="status" class="font-weight-bold">Status:</label>
                        <select name="changeStatus" @change="changeStatus(order.id, $event)" class="form-control">
                            <option value="1" :selected="1 == order.status">Złożony</option>
                            <option value="2" :selected="2 == order.status">Gotowy</option>
                            <option value="3" :selected="3 == order.status">Zrealizowany</option>
                        </select>
                    </div>
                     <span v-if="success" class="invalid-feedback" role="alert">
                        <strong>{{ success }}</strong>
                    </span>
                    <div class="col-12 mt-1">
                        <p style="color: green" v-if="order.is_paid == 1">Opłacone</p>
                        <p style="color: red" v-else>Nieopłacone</p>
                    </div>
                    <div class="col-12">
                        <h4>Pozycje:</h4>
                    </div>
                    <div class="col-12">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">Produkt</th>
                                    <th scope="col">Ilość</th>
                                    <th scope="col">Cena</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="position in order.positions" :key="position.id">
                                    <td>{{position.product.name}}</td>
                                    <td>{{position.quantity}}</td>
                                    <td>{{position.product.price}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <hr>
            </div>
            <div class="products" v-else>
                Brak zamówień.
            </div>
    </div>
</template>

<script>
import Menu from "../Menu";
import { getSuccessAlert, getErrorsOrAlert } from "../../../helpers/helpers";

export default {
    data(){
        return {
            orders: [],
            status: '',
            success: {},
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
                this.success = getSuccessAlert(response.data.message);
            })
        },
        getOrdersByStatus(event) {
            console.log(event.target.value);
            axios.get('/api/admin/orders/status/' + event.target.value).then(res=>{
                if(res.status==200){
                    console.log('test');
                    this.orders=res.data;
                    console.log(this.orders);
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
