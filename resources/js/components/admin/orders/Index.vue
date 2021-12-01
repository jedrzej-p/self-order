<template>
    <div class="container mb-3">
        <Menu />
         <select name="changeStatus" @change="getOrdersByStatus()" class="form-control">
            <option value="2">Złożony</option>
            <option value="3">Gotowy</option>
            <option value="4">Zrealizowany</option>
            <option value="5">Wszystkie</option>
        </select>
        <div class="card-body table-responsive p-0">
            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Numer</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ order.nr }}</td>
                        <td>
                        <select name="changeStatus" @change="changeStatus(order.id)" class="form-control">
                            <option value="1">Złożony</option>
                            <option value="2">Gotowy</option>
                            <option value="3">Zrealizowany</option>
                        </select>
                        </td>
                    </tr>
                </tbody>
            </table>
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
