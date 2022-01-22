<template>
    <div class="container bg mb-3">
        <Menu />
        <div class="card-body px-0">
            <div class="products">
                <div class="col-12 px-0 d-flex justify-content-between mb-3"> 
                    <div> 
                        <a :href="'/admin/category/create'" class="btn btn-primary">Dodaj</a>
                    </div>
                    <div> 
                        <input class="form-control" type="text" placeholder="Szukaj" v-model="search" @keyup="loadCategories">
                    </div>
                </div>
                <div class="col-12 px-0 content-list" v-if="categories.length>0">
                    <div class="row mx-0 p-2 content-list-header">
                        <div class="col-1"> Id </div>
                        <div class="col-6"> Nazwa </div>
                        <div class="col-4 text-center"> Akcje </div> 
                    </div>
                    <div class="row p-2" v-for="category in categories" :key="category.id">
                        <div class="col-1"> {{category.id}}</div>
                        <div class="col-6"> {{category.name}} </div>
                        <div class="col-2 px-0 d-flex justify-content-center"> <a class="btn btn-info" :href="'/admin/category/edit/'+category.id"><i class="fas fa-edit"></i></a> </div> 
                        <div class="col-2 px-0 d-flex justify-content-center"> <a class="btn btn-danger" @click.prevent="deleteCategory(category.id)"><i class="far fa-trash-alt"></i></a> </div>
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
