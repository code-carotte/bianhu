<template>
    <form class="validate-form-container">
        <slot></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit"> <button type="submit" class="btn btn-primary">提交</button> </slot>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import {mitter} from './ValidateInput.vue'
type ValidateFunc = () => boolean
export default defineComponent({
    name: 'ValidateForm',
    emits: ['form-submit'],
    setup(props, {emit}) {
        let funArr: ValidateFunc[] = [];
        const submitForm = () => {
            const result = funArr.map(func => func()).every(result => result);
            emit('form-submit', result);
        };
        const callback = (data: ValidateFunc) => {
            funArr.push(data)
        };
        // on('自定义事件', (data) => {})  创建侦听器,监听mitt.emit()发出的自定义事件 通过callback接收数据
        mitter.on('form-item-created', callback);
        onUnmounted(() => {
            // off() 移除侦听器
            mitter.off('form-item-created', callback);
            funArr = [];
        })

        return {
            submitForm
        }

    },
})
</script>


<style>

</style>