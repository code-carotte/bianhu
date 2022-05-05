<template>
    <div class="column-detail-page mx-auto" style="width: 60%;">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
            <h2>专栏详情</h2>
            <!-- <div class="col-3 text-center">
                <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border border-light w-100">
            </div>
            <div class="col-9">
                <h4>{{column.title}}</h4>
                <p class="text-muted">{{column.description}}</p>
            </div> -->
        </div>
        <PostList :postList="postList" />
        <button class="btn btn-outline-primary mt-2 mb-5 mx-auto d-block w-25" 
            @click="loadMorePage" v-if="!isLastPage"    
        >
            加载更多
        </button>
    </div>
</template>

<script lang="ts"> 
import { defineComponent, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { IColumnProps, IGlobalDataProps } from '../store'
import PostList from '@/components/PostList.vue'
import { addColumnAvatar, objToArr } from '../helper'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
    name: "ColumnDetail",
    components: {
        PostList
    },
    setup() {
        // useRoute 相当于 $route 用于获取当前页面的路由信息
        const route = useRoute();
        const store = useStore<IGlobalDataProps>();
        // currentId 用于表示进入的是首页的哪一个专栏 即currentColumnId 
        const currentId = route.params.id; 
        
        const column = computed(() => {
            const selectColumn = store.getters.getColumn(currentId) as IColumnProps
            if (selectColumn) {
               addColumnAvatar(selectColumn, 100, 100)
            }
            return selectColumn
        });
        
        const postList = computed(() => store.getters.getPostList(currentId));
        
        const record = computed(()=>store.getters.getPostRecord(currentId)) 
        const total = computed(()=>record.value[currentId as string] && record.value[currentId as string].total)
        const currentPage = computed(()=>record.value[currentId as string] && record.value[currentId as string].currentPage)
        const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, currentId as string, { pageSize: 5, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })
        
        onMounted(() => {
            store.dispatch('fetchPosts', {params: { pageSize: 5 }, columnId: currentId});
        })

        return {
            column,
            postList,
            loadMorePage,
            isLastPage
        }
    },
})
</script>


<style>

</style>