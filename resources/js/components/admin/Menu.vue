<template>
    <div class="row mb-3">
        <div class="col-lg-12 col-12">
            <router-link :to="{ name: 'admin-orders' }" class="'btn btn-menu btn-lg profile-main-btn text-center">Zamówienia</router-link>
            <router-link :to="{ name: 'admin-meals' }" class="'btn btn-menu btn-lg profile-main-btn text-center">Dania</router-link>
        </div>
    </div>
</template>

<script>
</script>

<style lang="scss" scoped>
    .menu {
        background-color: lightgray; 
    }
    .profile-main-btn {
        margin: 0 auto;
        display: block;
        border-radius: 0;
    }
    .btn-menu {
        background-color: rgba(0, 0, 0, .04);
        border-color: rgba(0, 0, 0, .75);
        color: black;
        border-radius: unset;
    }
</style>