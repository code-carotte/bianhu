import {createRouter, createWebHashHistory} from 'vue-router'
import store from '../store'
import axios from 'axios'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import ColumnDetail from '@/views/ColumnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import Signup from '@/views/Signup.vue'
import PostDetail from '@/views/PostDetail.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home', 
        name: 'home',
        component: Home
    },
    {
        path: '/login', 
        name: 'login',
        component: Login,
        meta: { redirectAlreadyLogin: true }
    },
    {
        path: '/signup',
        name: 'signup',
        component: Signup,
        meta: { redirectAlreadyLogin: true }
    },
    {
        path: '/column/:id',
        name: 'column',
        component: ColumnDetail
    },
    {
        path: '/posts/:id',
        name: 'post',
        component: PostDetail
    },
    {
        path: '/create',
        name: 'create',
        component:  CreatePost,
        meta: { requriedLogin: true }
    }
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 全局前置守卫 to：即将要进入的目标路由 from：当前导航正要离开的路由
router.beforeEach((to, from, next) => {
    const { user, token } = store.state;
    const { requriedLogin, redirectAlreadyLogin } = to.meta;
    if (!user.isLogin) { // 未登录
        if (token) { // 如果已有token的话
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            store.dispatch('fetchCurrentUser').then(() => { // fetchCurrentUser为异步函数,始终返回一个Promise.then()封装的数据
                if (redirectAlreadyLogin) { // 如果去往的路由为login和signup
                    next('/')
                } else {
                    next()
                }
            }).catch(err => {   // token有时效行, 会过期
                console.error(err)
                store.commit('logout')
                next('login')
            })
        } else { // 还没有token
            if (requriedLogin) { // 如果去往的路由需要先登录
                next('login')   // 跳转到登录页面
            } else {
                next()  // 继续下去
            }
        }
    } else {    // 已登录
        if (redirectAlreadyLogin) { // 如果去往的路由为login和signup
            next('/')   // 跳转到首页
        } else {
            next()  // 继续下去
        }
    }
})

export default router;