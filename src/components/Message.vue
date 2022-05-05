<template>
    <teleport to="#message">
        <div class="message-info alert fixed-top w-50 mx-auto d-flex justify-content-between mt-2" :class="classObject" v-if="isVisible" >
            <span>{{message}}</span>
            <button type="button" class="btn-close" aria-label="Close" @click.prevent="hide"></button>    
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
    name: 'message',
    props: {
        message: String,
        type: {
            type: String as PropType<MessageType>,
            default: 'default'
        }
    },
    emits: ['close-message'],
    setup(props, {emit}) {
        useDOMCreate('message');
        
        const isVisible = ref(true);
        const classObject = {
            'alert-success': props.type === 'success',
            'alert-danger': props.type === 'error',
            'alert-primary': props.type === 'default',
        };
        const hide = () => {
            isVisible.value = false;
            emit('close-message', true);
        };

        return {
            isVisible,
            classObject,
            hide
        }
    }
})
</script>


<style>

</style>