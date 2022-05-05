<template>
    <div class="post-detail-page mx-auto" style="width: 750px;">
        <Modal title="删除文章" :visible="modalIsVisable"
            @modal-on-close="modalIsVisable = false"
            @modal-on-confirm="hideAndDelete"
        >
            <p>确定要删除这篇文章吗?</p>
        </Modal>
        <article class="mb-5 pb-3" v-if="currentPost">
            <!-- img-fluid:随父元素进行缩放 -->
            <img :src="currentImageUrl" :alt="currentPost.title" class="rounded-3 img-fluid my-4" v-if="currentImageUrl"> 
            <h2 class="mb-4">{{currentPost.title}}</h2>
            <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
                <div class="col">
                    <UserProfile :user="currentPost.author" v-if="typeof currentPost.author === 'object'" />
                </div>
                <span class="text-muted col text-end fst-italic">发表于：{{currentPost.createdAt}}</span>
            </div>
            <div v-html="currentHTML"></div>
            <div v-if="showEditArea" class="btn-group mt-5">
                <router-link :to="{ name: 'create', query: { id: currentPost._id }}" type="button" class="btn btn-success">
                    编辑
                </router-link>
                <button type="button" class="btn btn-danger" @click.prevent="modalIsVisable = true">删除</button>
            </div>  
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { IGlobalDataProps, IPostProps, ImageProps, IUserProps, IResponseType } from '../store'
import UserProfile from '@/components/UserProfile.vue'
import Modal from '@/components/Modal.vue'
import MarkdownIt from 'markdown-it'
import createMessage from '@/components/createMessage'

export default defineComponent({
    name: 'post-detail',
    components: {
        UserProfile,
        Modal 
    },  
    setup() {
        const store = useStore<IGlobalDataProps>()
        const route = useRoute()
        const router = useRouter()
        const currentId = route.params.id
        const currentPost = computed<IPostProps>(() => store.getters.getCurrentPost(currentId)) 
        const currentImageUrl = computed(() => {
            if (currentPost.value && currentPost.value.image) {
                const { image } = currentPost.value
                return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
            } else {
                return null
            }
        })
        // markdown的解析
        const md = new MarkdownIt()
        const currentHTML = computed(() => {
            const { content, isHTML } = currentPost.value
            if (currentPost.value && content) {
                return isHTML ? content : md.render(content)
            }
        })  
        // 编辑、删除区域
        const showEditArea = computed(() => {
            const { isLogin, _id } = store.state.user
            if (currentPost.value && currentPost.value.author && isLogin) {
                const postAuthor = currentPost.value.author as IUserProps
                return postAuthor._id === _id //如果登录用户id和文章id一样, 则说明该文章为登录用户所写, 则用户有权限对文章进行编辑 
            } else {
                return false
            }
        })

        // modal
        const modalIsVisable = ref(false)
        const hideAndDelete = () => {
            modalIsVisable.value = false
            store.dispatch('deletePost', currentId).then((res: IResponseType<IPostProps>) => {
                createMessage('删除成功,2秒后跳转到专栏首页', 'success')
                setTimeout(() => {
                    router.push({ name: 'column', params: { id: res.data.column } })
                }, 2000)
            })
        }
    
        onMounted(() => {
            store.dispatch('fetchPost', currentId)
        })

        return {
            currentPost,
            currentImageUrl,
            currentHTML,
            showEditArea,
            modalIsVisable,
            hideAndDelete
        }
    },
})
</script>

<style>

</style>