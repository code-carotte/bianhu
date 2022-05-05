<template>
    <div class="home-page">
        <section class="py-3 text-center container">
            <div class="row py-lg-3">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <img src="../assets/callout.svg" alt="callout" class="w-50"/>
                    <h2 class="font-weight-light my-2">随心写作，自由表达</h2>
                    <p>
                        <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
                    </p>
                </div>
            </div>
        </section>
        <ColumnList :list="columnList" />
        <button class="btn btn-outline-primary mt-2 mb-5 mx-auto d-block w-25" 
            @click="loadMorePage" v-if="!isLastPage"    
        >
            加载更多
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { IGlobalDataProps } from '../store'
import useLoadMore from '../hooks/useLoadMore'
import ColumnList from '@/components/ColumnList.vue'

export default defineComponent({
    name: 'Home',
    components: {
        ColumnList
    },
    setup() {
        const store = useStore<IGlobalDataProps>();
        const columnList = computed(() => store.getters.getColumnList);

        const total = computed(() => store.state.columnList.total);
        const currentPage = computed(() => store.state.columnList.currentPage)
        const { loadMorePage, isLastPage } =  useLoadMore('fetchColumns', total, '', { pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })

        onMounted(() => {
            store.dispatch('fetchColumns', { pagesize: 3 })
        })

        return {
            columnList,
            loadMorePage,
            isLastPage
        }
    },
})
</script>

<style>

</style>