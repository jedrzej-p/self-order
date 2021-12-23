<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body table-responsive p-0">
            <div class="products">
                <div class="col-12"> 
                    <form @submit.prevent="updateMeal">
                        <div> 
                            <div> 
                                Nazwa produktu:
                                <input class="form-control" type="text" v-model="meal.name" required>
                            </div>
                            <div> 
                                Opis
                                <textarea class="form-control" v-model="meal.description" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div> 
                                Kategoria:
                                <select class="form-control" v-model="meal.category_id" required>
                                    <option v-for="category in categories" :key="category.id" v-bind:value="category.id">{{category.name}}</option>
                                </select>
                            </div>
                            <div> 
                                Cena:
                                <input class="form-control" type="number" step="0.01" v-model="meal.price" required>
                            </div>
                            <div class="py-2"> 
                                <input class="btn btn-success" type="submit">
                            </div>
                        </div>
                    </form>
                </div>
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
           meal: {},
           categories: [],
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadMeal();
        this.loadCategories();
    },
    methods: {
        loadCategories: function(){
            axios.get('/api/admin/meal/categories').then(res=>{
                if(res.status==200)
                {
                    this.categories = res.data;
                }
            })
        },

        loadMeal:function(){
            axios.get('/api/admin/meal/edit/'+this.$route.params.id).then(res=>{
                if(res.status==200)
                {
                    this.meal=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        updateMeal: function()
        {
            axios.post('/api/admin/meal/update', {
                id: this.$route.params.id,
                name: this.meal.name,
                description: this.meal.description,
                category: this.meal.category_id,
                price: this.meal.price,
            }).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Danie zaktualizowane");
                    window.location.href = '/admin/meals/'
                }
            })
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
