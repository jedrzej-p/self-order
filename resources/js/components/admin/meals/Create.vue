<template>
    <div class="container bg mb-3">
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
                        <div>
                            Zdjęcie: 
                            <input class="form-control" type="file" v-on:change="onFileChange" required>
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
           categories: [],
           name: '',
           category: '',
           price: '',
           description: '',
           photo: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadCategory();
    },
    methods: {
        onFileChange(e){
                console.log(e.target.files[0]);
                this.photo = e.target.files[0]; 
        },

        loadCategory: function(){
            axios.get('/api/admin/meal/categories').then(res=>{
                if(res.status==200)
                {
                    this.categories = res.data;
                }
            })
        },

        createMeal:function(){
            const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                let data = new FormData();
                data.append('name', this.name);
                data.append('category', this.category);
                data.append('price', this.price);
                data.append('description', this.description);
                data.append('photo', this.photo);

            axios.post('/api/admin/meal/create', data, config).then(res=>{
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
