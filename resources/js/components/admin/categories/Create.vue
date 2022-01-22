<template>
    <div class="container bg mb-3">
        <Menu />
      
        <div class="card-body table-responsive p-0">
            <div class="products">
                <form @submit.prevent="createCategory">
                    <div class="col-12"> 
                        <div> 
                            Nazwa kategorii:
                            <input class="form-control" type="text" v-model="name" required>
                        </div>
                        <div class="py-2"> 
                            <input class="btn btn-success" type="submit" value="Dodaj">
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
           name: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        
    },
    methods: {
        createCategory:function(){
            axios.post('/api/admin/category/create', {
                name: this.name,
            }).then(res=>{
                if(res.status==200){
                    getSuccessAlert("Kategoria dodana");
                    window.location.href = "/admin/categories"
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
