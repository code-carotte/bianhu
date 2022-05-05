<template>
    <div class="file-upload">
        <!-- 点击按钮来触发 <input type='file' /> 的上传文件功能 -->
        <div class="file-upload-container" @click.prevent="tirggerUpload" v-bind="$attrs">
            <slot v-if="fileStatus === 'loading'" name="loading"> 
                <button class="btn btn-primary" disabled> 正在上传... </button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData"> 
                <button class="btn btn-primary"> 上传成功 </button>
            </slot>
            <slot v-else name="default"> 
                <button class="btn btn-primary"> 点击上传 </button>    
            </slot>
        </div>
        <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChnage"> <!-- d-none: display: none -->
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file: File) => boolean    

export default defineComponent({
    name: 'uploader',
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpload: { // 接收一个函数, 用于在上传操作前, 对选择文件进行一些操作筛选
            type: Function as PropType<checkFunction>
        },
        uploaded: {
            type: Object
        }
    },
    inheritAttrs: false,
    emits: ['file-uploaded', 'file-uploaded-error'],    // 文件上传成功和失败后发出自定义事件
    setup(props, { emit }) {
        const fileInput = ref<null | HTMLInputElement>(null);
        const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready');
        const uploadedData = ref(props.uploaded);
        const tirggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click()
            }
        };
        // 选择文件后触发
        const handleFileChnage = (e: Event) => {
            // console.log(e.target); // <input type="file" class="file-input d-none" />
            // console.dir(e.target); // 该DOM元素上有一个files属性, 它是一个对象: { {file1}, {file2}, {file3}, ... }, 存储着选择的文件的相关信息。默认情况下每次只能选择一个文件, 添加 multiple 属性则可以一次选择多个文件。

            const currentTarget = e.target as HTMLInputElement;
            // 如果选择了文件
            if (currentTarget.files) {
                // Array.from() 静态方法可以对一个类数组或可迭代对象创建一个新的浅拷贝的数组。
                const files = Array.from(currentTarget.files); // [ {file} ... ]
                if (props.beforeUpload) {
                    const result = props.beforeUpload(files[0]);
                    // 如果result为false, 即验证不通过的话, 结束代码执行。
                    if (!result) {
                        return 
                    }
                };
                fileStatus.value = 'loading';
                const formData = new FormData();
                formData.append('file', files[0]);

                axios.post(props.action, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    console.log(res.data, 'response file msg');
                    fileStatus.value = 'success';
                    uploadedData.value = res.data;
                    emit('file-uploaded', res.data);
                }).catch(error => {
                    console.log(error, 'upload error');
                    fileStatus.value = 'error';
                    emit('file-uploaded-error', { error });
                }).finally(() => {
                    if (fileInput.value) { // fileInput.value 为 <input type="file" class="file-input d-none" />
                        fileInput.value.value = ''
                    }
                });
            }
        }

        watch(() => props.uploaded, (newValue) => {
            if (newValue) {
                fileStatus.value = 'success'
                uploadedData.value = newValue
            }
        })

        return {
            fileInput,
            tirggerUpload,
            fileStatus,
            handleFileChnage,
            uploadedData
        }
    },
})
</script>


<style>

</style>