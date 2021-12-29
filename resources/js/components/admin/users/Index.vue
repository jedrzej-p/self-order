<template>
    <div class="container mb-3">
        <Menu />
      
        <div class="card-body">
            <div class="products">
                <div class="col-12 d-flex justify-content-end"> 
                    <div> 
                        <input type="text" placeholder="Szukaj" v-model="search" @keyup="loadUsers">
                    </div>
                </div>
                <div class="row" v-if="users.length>0">
                    <div class="row col-12 p-2 bg-light">
                        <div class="col-2"> Id </div>
                        <div class="col-2"> Imię </div>
                        <div class="col-2"> Nazwisko </div>
                        <div class="col-2"> E-mail </div>
                        <div class="col-2 text-center"> Akcje </div> 
                    </div>
                    <div class="row col-12 p-2" v-for="user in users" :key="user.id">
                        <div class="col-2"> {{user.id}}</div>
                        <div class="col-2"> {{user.name}} </div>
                        <div class="col-2"> {{user.surname}} </div>
                        <div class="col-4"> {{user.email}} </div>
                        <div class="col-2" v-if="user.is_admin==1">
                            <label class="switch">
                                <input type="checkbox" @click="changePermission(user.id, user.is_admin)" checked>
                                <span class="slider round"></span>
                            </label>     
                        </div>
                        <div class="col-2" v-else>
                            <label class="switch">
                                <input type="checkbox" @click="changePermission(user.id, user.is_admin)">
                                <span class="slider round"></span>
                            </label>     
                        </div>
                    
                        
                    </div>
                </div>
                <div v-else> 
                    <div class="col-12">Brak użytkowników</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from "../Menu";
import { showAlertifyConfirm } from '../../../helpers/helpers';
import { getSuccessAlert } from '../../../helpers/helpers';

export default {
    data(){
        return {
            users: [],
            search: '',
        }
    },
    components: {
        Menu
    },
    mounted(){
        this.loadUsers();
    },
    methods: {
        loadUsers:function(){
            axios.post('/api/admin/users',{ 
                search: this.search,
            }).then(res=>{
                if(res.status==200){
                    this.users=res.data;
                }
            }).catch(err=>{
                console.log(err)
            });
        },

        changePermission: function(id, admin)
        {
            axios.post('/api/admin/user/permission', {
                user_id: id,
                is_admin: admin,
            }).then(res=>{
                if(res.status==200)
                {
                    getSuccessAlert("Zmieniono uprawnienia");
                    window.location.reload()
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
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>
