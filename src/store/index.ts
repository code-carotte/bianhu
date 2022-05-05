import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '../helper'
export interface IResponseType<P = {}> {
    code: number;
    msg: string;
    data: P;
}
export interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
    fitUrl?: string;
}
export interface IColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface IPostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    createdAt?: string;
    column: string; //columnListId 表示的是首页的哪个专栏
    author?: string | IUserProps;
    isHTML?: boolean;
} 
export interface IUserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string;
}
export interface IGlobalErrorProps {
    status: boolean;
    message?: string;
}
export interface IGlobalDataProps {
    error: IGlobalErrorProps,
    token: string;
    loading: boolean;
    columnList: { data: IListProps<IColumnProps>; currentPage: number, total: number };
    // postList: { data: IListProps<IPostProps>; loadedColumns: string[] };
    postList: { data: IListProps<IPostProps>; currentPostPage:IListProps<IReadPostRecord>};
    user: IUserProps;
}
export interface IListProps<P> {
    [id: string]: P;
}
export interface IReadPostRecord{
    currentPage?:number
    total?:number
}

const asyncAndCommit = async(url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get'}, extraData?: any) => {
    const { data } = await axios(url, config);
    if (extraData) {
        commit(mutationName, { data, extraData });
    } else {
        commit(mutationName, data);
    }
    return data
}
const store = createStore<IGlobalDataProps>({
    state: {
        error: { status: false }, 
        token: localStorage.getItem('token') || '',
        loading: false, // 用于添加loading效果
        columnList: { data: {}, currentPage: 0, total: 0 },
        postList: { data: {}, currentPostPage:{} },
        user: { isLogin: false }
    },
    mutations: {
        // login(state) {
        //     state.user = { ...state.user, isLogin: true, name: 'echo' }
        // },
        createPost(state, newPost) {
            state.postList.data[newPost._id] = newPost
        },
        fetchColumns(state, rawData) {
            const { data } = state.columnList
            const { list, count, currentPage } = rawData.data 
            state.columnList = {
                data: { ...data, ...arrToObj(list) },
                total: count,
                currentPage: currentPage * 1
            }
        },
        fetchColumn(state, payload) {
            state.columnList.data[payload.data._id] = payload.data
        },
        fetchPosts(state, { data: rawData, extraData: columnId}) {
            const { data } = state.postList
            const { list, count, currentPage } = rawData.data
            state.postList.data = {...data,...arrToObj(list)}
            //每一个专栏都有读文章的记录，记录的是主要内容是读到哪里了，这个专栏的文章总数是多少
            state.postList.currentPostPage[columnId] = { currentPage:currentPage*1, total:count }
            // state.postList.data = { ...state.postList.data, ...arrToObj(rawData.data.list) }
            // state.postList.loadedColumns.push(columnId)
        },
        fetchPost(state, payload) {
            state.postList.data[payload.data._id] = payload.data
        },
        updatePost(state, { data }) {
            state.postList.data[data._id] = data
        },
        deletePost(state, { data }) {
            delete state.postList.data[data._id]
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, e:IGlobalErrorProps) {
            state.error = e
        },
        login(state, rawData) {
            const { token }= rawData.data;
            state.token = token;
            // window.localStorage在会话结束后还能保存和window.session在会话结束后则清空, cookie不支持跨域。
            localStorage.setItem('token', token);   // 将token存储在本地
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        fetchCurrentUser(state, rawData) {
            state.user = { isLogin: true, ...rawData.data }
        },
        loginOut(state) {
            state.token = ''
            state.user = { isLogin: false }
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization 
        }
    },
    actions: {
        // 首页(Home)的专栏列表 默认一次只能查询5条数据
        fetchColumns({ state, commit }, params = {}) {
            const { currentPage = 1, pageSize = 3 } = params
            if (state.columnList.currentPage < currentPage) {
                return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
            }
        },
        // 首页的某一个专栏中的详情页中的该专栏信息
        fetchColumn({ state, commit }, columnId) {
            if (!state.columnList.data[columnId]) {
                return asyncAndCommit(`/api/columns/${columnId}`, 'fetchColumn', commit)
            }
        },
        // 首页的某一个专栏中的详情页中的posts文章列表
        fetchPosts({ state, commit }, {params, columnId}) {  
            const { currentPage = 1, pageSize = 6 } = params
            const record = state.postList.currentPostPage[columnId]
            //state.posts.currentPage是目前已显示到的页数,currentPage是用户想看的下一页
            if((record && record.currentPage && record.currentPage <= currentPage) || !record){  
                return asyncAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,'fetchPosts',commit,{method:'get'},columnId) 
            }
            // if (!state.postList.loadedColumns.includes(columnId)) {
            //     return asyncAndCommit(`/api/columns/${columnId}/posts`, 'fetchPosts', commit, { method: 'get' }, columnId)   
            // }
        },
        // 某一个post文章的详情页
        fetchPost({ state, commit }, postId) {
            const currentPost = state.postList.data[postId]
            if (!currentPost || !currentPost.content) {
                return asyncAndCommit(`/api/posts/${postId}`, 'fetchPost', commit)
            } else {
                return Promise.resolve({ data: currentPost })
            }
        },
        // 更新某篇文章
        updatePost({ commit }, { id, payload }) {
            return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
                method: 'patch',    // 更新部分数据请求 
                data: payload
            })
        },
        // 删除某篇文章
        deletePost({ commit }, id) {
            return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, { method: 'delete' })
        },
        // 登录
        login({ commit }, payload) {
            return asyncAndCommit('/api/user/login', 'login', commit, { method: 'post', data: payload })
        },
        createPost({ commit }, payload) {
            return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload })
        },
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit)
        },
        // 组合 Action 先通过login获取token, 设置headers。再通过fetchCurrentUser获取登录用户信息。
        loginAndFetch({dispatch}, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser')
            })
        }
    },
    getters: {
        getColumnList: (state) => {
            return objToArr(state.columnList.data)
        },
        getColumn: (state) => (columnId: string) => {
            return state.columnList.data[columnId]
        },
        getPostList: (state) => (columnId: string) => {
            // Array.prototype.filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 
            return objToArr(state.postList.data).filter( item => item.column === columnId )
        },
        getCurrentPost: (state) => (postId: string) => {
            return state.postList.data[postId]
        },
        getPostRecord:(state) => (columnId:string) => {
            return state.postList.currentPostPage
        }
    }
})

export default store