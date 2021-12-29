<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body">
            <div class="products">
                <div class="col-12 d-flex justify-content-between"> 
                    <div> 
                        <a :href="'/admin/category/create'" class="btn btn-secondary">Dodaj</a>
                    </div>
                    <div> 
                        <input type="text" placeholder="Szukaj" v-model="search" @keyup="loadCategories">
                    </div>
                </div>
                <div class="row" v-if="categories.length>0">
                    <div class="row col-12 p-2 bg-light">
                        <div class="col-2"> Id </div>
                        <div class="col-6"> Nazwa </div>
                        <div class="col-4 text-center"> Akcje </div> 
                    </div>
                    <div class="row col-12 p-2" v-for="category in categories" :key="category.id">
                        <div class="col-2"> {{category.id}}</div>
                        <div class="col-6"> {{category.name}} </div>
                        <div class="col-2 d-flex justify-content-center"> <a class="btn btn-info" :href="'/admin/category/edit/'+category.id">Edytuj</a> </div> 
                        <div class="col-2 d-flex justify-content-center"> <a class="btn btn-danger" @click.prevent="deleteCategory(category.id)">Usuń</a> </div>
                        
                    </div>
                </div>
                <div v-else> 
                    <div class="col-12">Brak kategorii</div>
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
            categories: [],
            search: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadCategories();
    },
    methods: {
        loadCategories:function(){
            axios.post('/api/admin/categories',{ 
                search: this.search,
            }).then(res=>{
                if(res.status==200){
                    this.categories=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        deleteCategory:function(id)
        {
            axios.get('/api/admin/category/delete/'+id).then(res=>{
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
