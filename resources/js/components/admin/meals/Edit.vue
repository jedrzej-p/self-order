<template>
    <div class="container bg mb-3">
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
                            <div class="py-4">
                                Zdjęcie główne:
                                <div v-for="(meal, index) in meal.product_images" :key="meal.id">
                                    <div v-if="index==0">
                                        <img class="w-50" v-bind:src="`/images/products/${meal.url}`" alt="First slide"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                Zdjęcie: 
                                <input class="form-control" type="file" v-on:change="onFileChange">
                            </div>

                            <div class="py-4"> 
                                Zdjęcia dodane przez użytkowników
                                <div class="row">
                                    <div class="col-3 d-flex position-relative" v-for="(meal_user) in meal.product_user_image" :key="meal_user.id"> 
                                        <button style="right: 10px; top: 10px" class="btn btn-danger px-2 py-1 position-absolute" @click.prevent="deleteUserImage(meal_user.id)">X</button>
                                        <img class="w-100" v-bind:src="`/images/products_users/${meal_user.url}`" alt="First slide"/>
                                    </div>
                                </div>
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
        onFileChange(e){
                console.log(e.target.files[0]);
                this.photo = e.target.files[0]; 
        },

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
                    console.log(res.data)
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        updateMeal: function()
        {
            const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                let data = new FormData();
                data.append('id', this.$route.params.id);
                data.append('name', this.meal.name);
                data.append('category', this.meal.category_id);
                data.append('price', this.meal.price);
                data.append('description', this.meal.description);
                data.append('photo', this.photo);
                data.append('old_photo_id', this.meal.product_images[0].id);

            axios.post('/api/admin/meal/update', data, config).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Danie zaktualizowane");
                    window.location.href = '/admin/meals/'
                }
            })
        },

        deleteUserImage: function(id)
        {
            axios.post('/api/user/image_delete', {
                image_id: id,
            }).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Usunięto zdjęcie");
                    window.location.reload();
                }
                else
                {
                    getErrorsOrAlert("Wystąpił błąd");
                }
            })
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
