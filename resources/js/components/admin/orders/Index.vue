<template>
    <div class="container mb-3">
        <Menu />
        <div class="card-body table-responsive p-0">
            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th>ID</th>
                        <th>Numer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.id }}</td>
                        <td>{{ order.nr }}</td>
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
