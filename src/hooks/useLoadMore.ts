import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'
interface ILoadParams {
    currentPage: number;
    pageSize: number;
}

const useLoadMore = (actionName: string, total: ComputedRef<number>, id: string, 
params: ILoadParams = { currentPage: 2, pageSize: 5 }) => {
    const store = useStore()
    const currentPage = ref(params.currentPage)
    const requestParams = computed(() => ({
        currentPage: currentPage.value,
        pageSize: params.pageSize
    }))
    const loadMorePage = () => {
        if (id !== '' as unknown){
            store.dispatch(actionName, { params: requestParams.value, columnId: id }).then(()=>{
                currentPage.value++
            })
        } else {
            store.dispatch(actionName, requestParams.value).then(()=>{
                currentPage.value++ //新加了一页,意思是我想看到的下一页的页数
            })
        }
        
    }
    const isLastPage = computed(() => {
        return Math.ceil(total.value / params.pageSize) < currentPage.value
    })

    return {
        currentPage,
        loadMorePage,
        isLastPage
    }
}

export default useLoadMore