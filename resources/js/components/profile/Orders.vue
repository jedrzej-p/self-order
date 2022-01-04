<template>
    <div class="container mb-3">
        <Menu />
        <div class="products" v-if="orders.length > 0">
            <div class="row mb-3" v-for="order in orders" :key="order.id">
                <div class="col-12">
                    <h2>{{ order.nr }}</h2>
                </div>
                <div class="col-12">
                    <p v-if="order.status == 1"><b>Status:</b> Złożony</p>
                    <p v-else-if="order.status == 2"><b>Status:</b> Gotowy</p>
                    <p v-else><b>Status:</b> Zrealizowany</p>
                 </div>
                <div class="col-12">
                    <p style="color: green" v-if="order.is_paid == 1"><b>Opłacone</b></p>
                    <p style="color: red" v-else><b>Nieopłacone</b></p>
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
        <div v-else class="products">
            Brak zamówień.
        </div>
    </div>
</template>

<script>
import Menu from "./Menu";

export default {
    data(){
        return {
            orders: [],
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
            axios.get('/api/user/orders').then(res=>{
                if(res.status==200){
                    this.orders=res.data;
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
