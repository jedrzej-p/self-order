<template>
<div>
<div>
<ul class="flex">
  <li class="mr-6">
    <a class="text-blue-500 hover:text-blue-800" href="#">Test</a>
  </li>
  <li class="mr-6">
    <a class="text-blue-500 hover:text-blue-800" href="#">Test 1</a>
  </li>
  <li class="mr-6">
    <a class="text-blue-500 hover:text-blue-800" href="#">Test 2</a>
  </li>
  <li class="mr-6">
    <a v-on:click="logout" v-if="isLoggedIn" style="cursor: pointer">Wyloguj</a>
  </li>
</ul>
</div>
    <main id="content" class="pt-3">
        <slot></slot>
    </main>
</div>
</template>
<script>

export default {
    data(){
        return {
            isLoggedIn: null,
        }
    },
    props: {
    },
    methods: {
        logout: function () {
            localStorage.removeItem('jwt')
            localStorage.removeItem('user')
            this.$router.go('/login')
        }
    },
    mounted(){
        this.isLoggedIn = localStorage.getItem('jwt')
        this.name = localStorage.getItem('user')
    }
}
</script>
