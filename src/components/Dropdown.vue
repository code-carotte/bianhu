<template>
    <div class="dropdown" ref="dropdownRef">
        <a href="#" class="btn btn-outline-light dropdown-toggle my-2" @click.prevent="toggleOpen">{{title}}</a>
        <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
            <slot></slot>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
    name: 'Dropdown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup() {
        const isOpen = ref(false);
        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
        };
        const dropdownRef = ref<null | HTMLElement>(null);
        const handler = (e: MouseEvent) => {
            if(dropdownRef.value) {     
                // node.contains(otherNode)：返回一个boolean, 判断node是否包含otherNode节点.
                if(!dropdownRef.value.contains(e.target as HTMLElement) && isOpen) {
                    isOpen.value = false
                }
            }
        };
        onMounted(() => {
            document.addEventListener('click', handler);
        });
        onUnmounted(() => {
            document.removeEventListener('click', handler);
        });

        return {
            isOpen,
            toggleOpen,
            dropdownRef
        }
    }
})
</script>


<style>

</style>