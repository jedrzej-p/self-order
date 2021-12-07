<template>
    <main class="main">
        <div class="container mt-4">
            <div v-if="!cart.id">Brak produktów w koszyku.</div>
            <div v-else class="row mx-0 py-3">
            <div class="col-12 text-center">
                <h2 style="color: #2574A9">Twoje zamówienie</h2>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="fw-bold" scope="col">Produkt</th>
                            <th class="fw-bold" scope="col">Ilość</th>
                            <th class="fw-bold" scope="col">Cena</th>
                            <th class="fw-bold" scope="col">Wartość</th>
                            <th class="fw-bold text-end" scope="col">Usuń</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="position in cart.positions" :key="position.id">
                            <th scope="row">{{position.product.name}}</th>
                            <td>{{position.quantity}}</td>
                            <td>{{position.price}}</td>
                            <td>{{position.price * position.quantity}} zł</td>
                            <td>
                                <form @submit.prevent="removeFromCart(position.id)"><button type="submit" class="btn btn-danger">Usuń</button></form>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr>
            </div>
            <div class="form-group col-12">
                <label for="table" class="col-form-label">Stolik:</label>
                <select v-model="table_id" class="form-control" id="table" @change="onChangeTables($event)" >
                    <option v-for="table in tables" :value="table.id" :key="table.id">
                        {{ table.table_nr }}
                    </option>
                </select>
            </div>
            <div class="form-group col-12">
                <label for="additional_informations" class="col-form-label">Dodatkowe informacje:</label>
                <div>
                    <input class="form-control" type="text" name="additional_informations" v-model="additional_informations" @input="updateAdditionalInformations">
                </div>
            </div>
            <div class="col-12 text-right">
                <p><b>Suma:</b> {{cart.value}}</p>
            </div>
            <form method="POST" action="https://merch-prod.snd.payu.com/api/v2_1/orders">
                <input type="hidden" name="customerIp" value="123.123.123.123"> 
                <input type="hidden" name="merchantPosId" value="425910"> 
                <input type="hidden" name="description" value="Opis zamówienia"> 
                <input type="hidden" name="totalAmount" :value="cart.value * 100"> 
                <input type="hidden" name="currencyCode" value="PLN"> 
                <input type="hidden" name="products[0].name" value="Produkt 1"> 
                <input type="hidden" name="products[0].unitPrice" value="1000"> 
                <input type="hidden" name="products[0].quantity" value="1">
                <input type="hidden" name="notifyUrl" :value="'https://dariusz-ptaszynski.pl/notify/' + cart.id">
                <input type="hidden" name="continueUrl" value="https://dariusz-ptaszynski.pl/summary">
                <input type="hidden" name="OpenPayu-Signature" :value="signature">
                <div class="text-center">
                    <p>Zapłać przez:</p>
                    <button type="submit" class="payu-btn d-flex justify-content-center"></button>
                </div>
            </form>
            <!-- <div class="col-12 text-right">
                <form class="mx-0 pt-0 mb-3" @submit.prevent="storeCarts">
                    <button type="submit" class="btn btn-primary">Złóż zamówienie</button>
                </form>
            </div> -->
        </div>
        </div>
    </main>
</template>

<script>
import { isLoggedIn } from "../../utils/jwt";

export default {
    data() {
        return {
            cart: {},
            tables: [],
            table_id: '',
            additional_informations: '',
            signature: '',
        };
    },
    mounted(){
        this.loadCart();
        this.loadTables();
        this.loadSignature();
    },
    computed: {
        isLoggedIn() {
            return isLoggedIn();
        },
    },
    methods: {
        onChangeTables(event) {
            axios.post('/api/updateTables', {table_id: event.target.value }).then((response)=>{
            })
        },
        updateAdditionalInformations(){
            axios.post('/api/updateAdditionalInformations', {additional_informations: this.additional_informations }).then((response)=>{
            })
        },
        loadCart: function() {
        axios
            .get(
            "/api/cart")
            .then(res => {
            if (res.status == 200) {
                
             
                    this.cart = res.data;
                
            }
            })
            .catch(err => {
            console.log(err);
            });
        },
        loadTables: function() {
        axios
            .get(
            "/api/tables")
            .then(res => {
            if (res.status == 200) {
                
             
                    this.tables = res.data;
                
            }
            })
            .catch(err => {
            console.log(err);
            });
        },

        removeFromCart(id){
            axios.post('/api/remove-from-cart/' + id).then((response)=>{
                $('#success').css("display", "block");
                $('#success').html(response.data.message)
                this.loadCart();
            })
        },
        storeCarts() {
            axios.post('/api/store-cart').then( response => {
                this.$router.push('/');
            }).catch((error) => {
                console.log(error);
                       
            });
        },
        loadSignature: function() {
        axios
            .get(
            "/api/signature")
            .then(res => {
            if (res.status == 200) {
                
             
                    this.signature = res.data;
                
            }
            })
            .catch(err => {
            console.log(err);
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.payu-btn {
    border: none;
    background: url('https://poland.payu.com/wp-content/uploads/sites/14/2020/05/PAYU_LOGO_LIME-990x640.png') no-repeat;
    background-size: contain;
    display: block;
    width: 350px;
    height: 100px;
    margin: 0 auto;
}
</style>