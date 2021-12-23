<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body table-responsive p-0">
            <div class="products">
                <form @submit.prevent="createMeal">
                    <div class="col-12"> 
                        <div> 
                            Nazwa produktu:
                            <input class="form-control" type="text" v-model="name" required>
                        </div>
                        <div> 
                            Opis
                            <textarea class="form-control" v-model="description" id="" cols="30" rows="10"></textarea>
                        </div>
                        <div> 
                            Kategoria:
                            <select class="form-control" v-model="category" required>
                                <option v-for="category in categories" :key="category.id" v-bind:value="category.id">{{category.name}}</option>
                            </select>
                        </div>
                        <div> 
                            Cena:
                            <input class="form-control" type="number" step="0.01" v-model="price" required>
                        </div>
                        <div class="py-2"> 
                            <input class="btn btn-success" type="submit">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from "../Menu";
import { getSuccessAlert } from '../../../helpers/helpers';

export default {
    data(){
        return {
           categories: [],
           name: '',
           category: '',
           price: '',
           description: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadCategory();
    },
    methods: {
        loadCategory: function(){
            axios.get('/api/admin/meal/categories').then(res=>{
                if(res.status==200)
                {
                    this.categories = res.data;
                }
            })
        },

        createMeal:function(){
            axios.post('/api/admin/meal/create/', {
                name: this.name,
                category: this.category,
                price: this.price,
                description: this.description,
            }).then(res=>{
                if(res.status==200){
                    getSuccessAlert("Produkt dodany");
                    window.location.href = "/admin/meals"
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
