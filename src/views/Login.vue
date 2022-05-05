<template>
    <div class="login-page mx-auto p-3 w-330">
        <h3 class="my-4 text-center">Login</h3>
        <ValidateForm @form-submit="onFormSubmit">
            <div class="mb-1">
                <label for="InputEmail" class="form-label">邮箱地址</label>
                <ValidateInput :rules="emailRules" v-model="emailValue" type="text" placeholder="请输入邮箱地址" id="InputEmail" ref="ValidateInput" />
            </div>
            <div class="mb-1">
                <label for="InputPassword" class="form-label">密码</label>
                <ValidateInput :rules="passwordRules" v-model="passwordValue" type="password" placeholder="请输入密码" id="InputPassword" />
            </div>
            <template v-slot:submit>
                <button type="submit" class="btn btn-primary btn-block btn-large w-100">登录</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, {IRulesProp} from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import createMessage from '@/components/createMessage'

export default defineComponent({
    name: 'Login',
    components: {
        ValidateInput,
        ValidateForm
    },
    setup() {
        const emailValue = ref('');
        const emailRules: IRulesProp[] = [
            {type: 'required', message: '电子邮箱地址不能为空'},
            {type: 'email', message: '请输入正确的电子邮箱格式'}
        ]
        const passwordValue = ref('');
        const passwordRules: IRulesProp[] = [
            {type: 'required', message: '密码不能为空'},
        ]
        const ValidateInput = ref<any>(); // 获取组件ValidateInput实例

        const router = useRouter();
        const store = useStore();
        const onFormSubmit = (result: boolean) => {
            // result 为true表示验证通过
            if (result) {
                const payload = {
                    email: emailValue.value,
                    password: passwordValue.value
                };
                store.dispatch('loginAndFetch', payload).then(() => {
                    createMessage('登录成功, 2秒后跳转到首页', 'success');
                    setTimeout(() => {
                        router.push('/')
                    }, 2000)
                }).catch(err => {
                    console.log(err);
                })
            }
        }

        return {
            emailRules,
            passwordRules,
            emailValue,
            passwordValue,
            ValidateInput,
            onFormSubmit
        }   
    },
})
</script>

<style scoped>
.w-330 {
    max-width: 330px;
}
</style>