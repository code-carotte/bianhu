<template>
    <div class="post-list">
        <article v-for="post in postList" :key="post._id" class="card mb-3 shadow">
            <div class="card-body">
                <h4><router-link :to="`/posts/${post._id}`">{{post.title}}</router-link></h4>
                <div class="row my-3 align-items-center">
                    <div class="col-4" v-if="post.image">
                        <img :src="post.image.url" :alt="post.title" class="rounded-3 w-100">
                    </div>
                    <p :class="{'col-8': post.image}" class="text-muted">{{post.excerpt}}</p>
                </div>
                <span class="text-muted">{{post.createdAt}}</span>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IPostProps } from '../store'

export default defineComponent({
    name: 'postList',
    props: {
        postList: {
            type: Array as PropType<IPostProps[]>,
            required: true
        }
    },
})
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
</style>
