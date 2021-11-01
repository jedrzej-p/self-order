<template>
    <div class="row">
        <div class="col-lg-3 col-12 menu">
            <router-link :to="{ name: 'user-orders' }" class="nav-link text-center">Zamówienia</router-link>
        </div>
    </div>
</template>

<script>
</script>

<style lang="scss" scoped>
    .menu {
        background-color: azure; 
    }
</style>
