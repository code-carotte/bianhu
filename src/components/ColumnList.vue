<template>
    <div class="row">
        <!-- col-4 一行最多12格 -->
        <div v-for="item in columnList" :key="item._id" class="col-4 mb-4">
            <div class="card h-100 shadow">
                <div class="card-body text-center">
                    <img :src="item.avatar && item.avatar.url" :alt="item.title" class="rounded-circle border border-light my-3">
                    <h5 class="card-title text-truncate"> {{item.title}} </h5>
                    <p class="card-text text-start text-secondary"> {{item.description}} </p>
                    <router-link :to="`/column/${item._id}`" class="btn btn-outline-primary">进入专栏</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType, computed} from 'vue'
import { IColumnProps } from '../store'
import { addColumnAvatar } from '../helper'
export default defineComponent({
    name: 'ColumnList',
    props: {
        list: {
            // props中的类型检查填入的是构造函数而非具体的类型。因此使用ts相关需借用vue中的 PropType 函数
            type: Array as PropType<IColumnProps[]>,
            required: true
        }
    },
    setup(props) {
        const columnList = computed(() => {
            return props.list.map(item => {
                addColumnAvatar(item, 50, 50)
                return item
            })
        })

        return {
            columnList
        }
    }
})
</script>

<style scoped>
.card-body img{
    width: 50px;
    height: 50px;
}
.card-body .card-text {
    height: 6rem;
	overflow: hidden;
}
</style>
