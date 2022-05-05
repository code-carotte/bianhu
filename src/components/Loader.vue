<template>
    <teleport to="#back">
        <div class="loading-container d-flex justify-content-center align-items-center h-100" :style="{backgroundColor: background || ''}">
            <div class="loading-content">
                <!-- The border spinner  -->
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden"> {{ text || 'loading' }} </span>
                </div>
                <p v-if="text" class="text-primary small">{{text}}</p>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

export default defineComponent({
    name: 'loader',
    props: {
        text: {
            type: String
        },
        background: {
            type: String
        }
    },
    setup() {
        useDOMCreate('back')
    }
})
</script>


<style scoped>
.loading-container {
    background: rgba(255, 255, 255, .5);
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
}
</style>