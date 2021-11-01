<template>
    <nav v-if="pages > 1" class="d-flex justify-content-center">
        <ul class="pagination mb-0">
            <li v-if="page === 1" class="page-item disabled" aria-disabled="true">
                <span class="page-link"><i class="fas fa-angle-double-left" /></span>
            </li>
            <li v-else class="page-item">
                <router-link :to="prevPageUrl" class="page-link" rel="prev"><i class="fas fa-angle-double-left" /> Poprzednia</router-link>
            </li>

            <li v-if="pages > page" class="page-item">
                <router-link :to="nextPageUrl" class="page-link" rel="next">Następna <i class="fas fa-angle-double-right" /></router-link>
            </li>
            <li v-else class="page-item disabled" aria-disabled="true">
                <span class="page-link"><i class="fas fa-angle-double-right" /></span>
            </li>
        </ul>
    </nav>
</template>

<script>

export default {
    props: ["pages"],
    data() {
        return {
            page: +this.$route.query.page || 1,
        };
    },
    computed: {
        prevPageUrl() {
            const routeQuery = this.$route.query ? ({ ...this.$route.query }) : {};
            routeQuery.page = this.page - 1;
            return {
                name: this.$route.name,
                query: routeQuery,
            };
        },
        nextPageUrl() {
            const routeQuery = this.$route.query ? ({ ...this.$route.query }) : {};
            routeQuery.page = this.page + 1;
            return {
                name: this.$route.name,
                query: routeQuery,
            };
        },
    },
};

</script>

<style lang="scss" scoped>


</style>
