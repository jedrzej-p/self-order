<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body table-responsive p-0">
            <div class="products">
                <div class="col-12"> 
                    <form @submit.prevent="updateCategory">
                        <div> 
                            <div> 
                                Nazwa kategorii:
                                <input class="form-control" type="text" v-model="category.name" required>
                            </div>
                            <div class="py-2"> 
                                <input class="btn btn-success" type="submit" value="Aktualizuj">
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
           category: {},
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadCategory();
    },
    methods: {
        loadCategory:function(){
            axios.get('/api/admin/category/edit/'+this.$route.params.id).then(res=>{
                if(res.status==200)
                {
                    this.category=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        updateCategory: function()
        {
            axios.post('/api/admin/category/update', {
                id: this.$route.params.id,
                name: this.category.name,
            }).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Kategoria zaktualizowana");
                    window.location.href = '/admin/categories/'
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
