<template>
    <nav class="navbar navbar-dark bg-primary mb-4">
        <div class="container">
            <!-- <a class="navbar-brand" href="javascript: void(0)">编乎</a> -->
            <router-link to="/" class="navbar-brand">编乎</router-link>
            <ul v-if="!user.isLogin" class="list-inline mb-0">
                <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
                <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
            </ul>
            <ul v-else class="list-inline mb-0">
                <li class="list-inline-item">
                     <Dropdown :title=" `你好 ${user.nickName}` ">
                        <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem> 
                        <DropdownItem>
                            <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
                        </DropdownItem>
                        <DropdownItem :disabled="true"><a href="#" class="dropdown-item">编辑资料</a></DropdownItem> 
                        <DropdownItem>
                            <a href="#" class="dropdown-item" @click.prevent="loginOut">退出登录</a>
                        </DropdownItem> 
                    </Dropdown> 
                </li>
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { IUserProps } from '../store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
    name: 'Header',
    components: {
        Dropdown,
        DropdownItem
    },
    props: {
        user: {
            type: Object as PropType<IUserProps>,
            required: true
        }
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        // 退出登录
        const loginOut = () => {
            store.commit('loginOut')
            router.push('/')
        }

        return {
            loginOut
        }
    }
})
</script>

<style>

</style>