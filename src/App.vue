<template>
    <Header :user="userState" />
    <div class="container">
        <Loader v-if="isLoading" />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from '@/components/Header.vue'
import Loader from '@/components/Loader.vue'
import Uploader from '@/components/Uploader.vue'
import { IGlobalDataProps } from './store'
import createMessage from '@/components/createMessage'

export default defineComponent({
    name: 'App',
    components: {
        Header,
        Loader,
        Uploader
    },
    setup() {
        const store = useStore<IGlobalDataProps>();
        const userState = computed(() => store.state.user);
        const isLoading = computed(() => store.state.loading);
        const error = computed(() => store.state.error);

        watch(() => error.value.status, () => {
            const { status, message } = error.value;
            if (status && message) {
                createMessage(message, 'error')
            }
        });

        return {
            userState,
            isLoading,
            error
        }
    }
})
</script>

<style>

</style>