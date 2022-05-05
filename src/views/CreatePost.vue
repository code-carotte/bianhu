<template>
    <div class="create-post-page">
        <h3>{{isEditMode ? '编辑文章' : '新建文章'}}</h3>
        <Uploader
            action="/api/upload"
            class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
            :beforeUpload="uploadCheck" 
            @file-uploaded="handleFileUploaded"
            :uploaded="uploadedData"
        >   <!-- beforeUpload：上传文件之前对文件格式、大小进行检验 file-uploaded：文件上传完成后获取文件信息 -->
            <h3>点击上传图片</h3>
            <template #loading>
                <div class="d-flex">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h3>正在上传</h3>
                </div>
            </template>
            <template #uploaded="slotProps"> 
                <img :src="slotProps.uploadedData.data.url" width="500" />
            </template>
        </Uploader>
        <ValidateForm @form-submit="onFormSubmit">
            <div class="mb-1">
                <label for="post-title" class="form-label">文章标题:</label>
                <ValidateInput :rules="titleRules" v-model="titleValue" type="text" placeholder="请输入文章标题" 
                id="post-title" />
            </div>
            <div class="mb-1">
                <label for="post-content" class="form-label">文章详情:</label>
                <ValidateInput :rules="contentRules" v-model="contentValue" type="text" tag="textarea" rows="10" placeholder="请输入文章详情" id="post-content" />
            </div>
            <template v-slot:submit>
                <span class="btn btn-primary btn-large">{{isEditMode ? '更新文章' : '发表文章'}}</span>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput, { IRulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/Uploader.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { IGlobalDataProps, IPostProps, IResponseType, ImageProps } from '../store'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'

export default defineComponent({
    name: 'createPost',
    components: {
        ValidateForm,
        ValidateInput,
        Uploader
    },
    setup() {
        const router = useRouter();
        const store = useStore<IGlobalDataProps>();
        const titleValue = ref('');
        const titleRules: IRulesProp[] = [
            { type: 'required', message: '文章标题不能为空' }
        ];
        const contentValue = ref('');
        const contentRules: IRulesProp[] = [
            { type: 'required', message: '文章详情不能为空' }
        ];

        let imageId = ''
        const handleFileUploaded = (rawData: IResponseType<ImageProps>) => {
            if (rawData.data._id) {
                imageId = rawData.data._id
            }
        };

        const onFormSubmit = (result: boolean) => {
            if (result) {
                const { column, _id } = store.state.user;   // column: 当前登录用户的专栏id,  _id: 当前登录用户id
                if (column) {
                    const newPost: IPostProps = {
                        title: titleValue.value,
                        content: contentValue.value,
                        column,
                        author: _id
                    }
                    if (imageId) {
                        newPost.image = imageId
                    }
                    const actionName = isEditMode ? 'updatePost' : 'createPost'
                    const sendData = isEditMode ? {
                        id: route.query.id,
                        payload: newPost
                    } : newPost       

                    store.dispatch(actionName, sendData).then(() => {
                        createMessage('发表成功, 2秒后跳转到文章页', 'success')
                        setTimeout(() => {
                            router.push({ name: 'column', params: { id: column } })
                        }, 2000)
                    }) 
                    
                } 
            }
        };

        const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 }) // size: 1M
            const { passed, error } = result
            if (error === 'format') {
                createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
            }
            if (error === 'size') {
                createMessage('上传图片大小不能超过 1Mb', 'error')
            }
            return passed
        }

        // PostDetail详情页的编辑按钮通过query参数跳转到该页面, 来进行编辑操作
        const route = useRoute()
        const isEditMode = !!route.query.id // 通过2个!将string转换为boolean, 该变量用于判断是否是编辑模式
        const uploadedData = ref()
        onMounted(() => {
            if (isEditMode) {
                store.dispatch('fetchPost', route.query.id).then((res: IResponseType<IPostProps>) => {
                    const currentPost = res.data
                    if (currentPost.image) {
                        uploadedData.value = { data: currentPost.image }
                    }
                    titleValue.value = currentPost.title
                    contentValue.value = currentPost.content || ''
                })
            }
        })

        return {
            titleValue,
            titleRules,
            contentValue,
            contentRules,
            handleFileUploaded,
            onFormSubmit,
            uploadCheck,
            uploadedData,
            isEditMode
        }
    }
})
</script>


<style>
    .create-post-page .file-upload-container {
        height: 400px;
        cursor: pointer;
    }

    .create-post-page .file-upload-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>