<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body">
            <div class="products">
                <div class="col-12 d-flex justify-content-between"> 
                    <div> 
                        <a :href="'/admin/meal/create'" class="btn btn-secondary">Dodaj</a>
                    </div>
                    <div> 
                        <input type="text" placeholder="Szukaj" v-model="search" @keyup="loadMeals">
                    </div>
                </div>
                <div class="row"  v-if="meals.length>0">
                    <div class="row col-12 p-2 bg-light">
                        <div class="col-1"> Id </div>
                        <div class="col-4"> Nazwa </div>
                        <div class="col-1"> Cena </div>
                        <div class="col-2"> Kategoria </div>
                        <div class="col-4 text-center"> Akcje </div> 
                    </div>
                    <div class="row col-12 p-2" v-for="meal in meals" :key="meal.id">
                        <div class="col-1"> {{meal.id}}</div>
                        <div class="col-4"> {{meal.name}} </div>
                        <div class="col-1"> {{meal.price}}</div>
                        <div class="col-2"> {{meal.category.name}}</div>
                        <div class="col-2 d-flex justify-content-center"> <a class="btn btn-info" :href="'/admin/meal/edit/'+meal.id">Edytuj</a> </div> 
                        <div class="col-2 d-flex justify-content-center"> <a class="btn btn-danger" @click.prevent="deleteMeal(meal.id)">Usuń</a> </div>
                        
                    </div>
                </div>
                <div v-else> 
                    <div class="col-12">Brak produktów</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from "../Menu";
import { showAlertifyConfirm } from '../../../helpers/helpers';

export default {
    data(){
        return {
            meals: [],
            search: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadMeals();
    },
    methods: {
        loadMeals:function(){
            axios.post('/api/admin/meals',{ 
                search: this.search,
            }).then(res=>{
                if(res.status==200){
                    this.meals=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        deleteMeal:function(id)
        {
            axios.get('/api/admin/meal/delete/'+id).then(res=>{
                if(res.status==200){
                   
                    window.location.reload();
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
