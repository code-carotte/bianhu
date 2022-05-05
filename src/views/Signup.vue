<template>
    <div class="signup-page mx-auto p-3 w-330">
        <h3 class="my-4 text-center">sign up</h3>
        <ValidateForm @form-submit="onFormSubmit">
            <div class="mb-1">
                <label for="InputEmail" class="form-label">邮箱地址</label>
                <ValidateInput :rules="emailRules" v-model="formData.email" type="text" placeholder="请输入邮箱地址" id="InputEmail" ref="ValidateInput" />
            </div>
            <div class="mb-1">
                <label for="InputName" class="form-label">昵称</label>
                <ValidateInput :rules="nameRules" v-model="formData.nickName" type="text" placeholder="请输入昵称" id="InputName" />
            </div>
            <div class="mb-1">
                <label for="InputPassword" class="form-label">密码</label>
                <ValidateInput :rules="passwordRules" v-model="formData.password" type="password" placeholder="请输入密码" id="InputPassword" />
            </div>
            <div class="mb-1">
                <label for="InputrepeatPassword" class="form-label">重复密码</label>
                <ValidateInput :rules="repeatPasswordRules" v-model="formData.repeatPassword" type="password" placeholder="请再次输入密码" id="InputrepeatPassword" />
            </div>
            <template #submit>
                <button type="submit" class="btn btn-primary btn-block btn-large w-100">注册新用户</button>
            </template>
        </ValidateForm>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ValidateInput, {IRulesProp} from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import axios from 'axios'
import createMessage from '@/components/createMessage'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'signup',
    components: {
        ValidateForm,
        ValidateInput
    },
    setup() {
        // 四个表单的value
        const formData = reactive({
            email: '',
            nickName: '',
            password: '',
            repeatPassword: ''
        })
        const emailRules: IRulesProp[] = [
            {type: 'required', message: '电子邮箱地址不能为空'},
            {type: 'email', message: '请输入正确的电子邮箱格式'}
        ];
        const nameRules: IRulesProp[] = [
            { type: 'required', message: '昵称不能为空' }
        ];
        const passwordRules: IRulesProp[] = [
            { type: 'required', message: '密码不能为空' }
        ];
        const repeatPasswordRules: IRulesProp[] = [
            { type: 'required', message: '重复密码不能为空' },
            {
                type: 'custom',
                validator: () => {
                    return formData.password === formData.repeatPassword
                },
                message: '密码不相同'
            }
        ];
        const router = useRouter();
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    nickName: formData.nickName
                };
                console.log(payload);
                
                axios.post('api/users', payload).then(res => {
                    createMessage('注册成功, 正在跳转到登录页面', 'success');
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                }).catch(err => {
                    console.log(err);
                })
            }
        }

        return {
            formData,
            emailRules,
            nameRules,
            passwordRules,
            repeatPasswordRules,
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