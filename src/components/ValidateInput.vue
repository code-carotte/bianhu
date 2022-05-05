<template>
    <div class="validate-input-container pb-3">
        <input 
            v-if="tag !== 'textarea'"
            class="form-control"
            :class="{'is-invalid': input.error}"
            @blur="validateInput"
            v-model="input.value"
            v-bind="$attrs" 
        >
        <textarea
            v-else
            class="form-control"
            :class="{'is-invalid': input.error}"
            @blur="validateInput"
            v-model="input.value"
            v-bind="$attrs" 
        >
        </textarea>
        <!-- v-bind="$attrs" 为input元素绑定上$attrs对象 -->
        <div class="invalid-feedback" v-if="input.error"> {{input.message}} </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import mitt from 'mitt' // mitt 事件总线用于兄弟组件之间通信
export const mitter = mitt()
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export interface IRulesProp {
    type: 'required' | 'email' | 'custom';
    message: string;
    validator?: () => boolean;
}
export type TagType = 'input' | 'textarea'
export default defineComponent({
    name: 'ValuidateInput',
    props: {
        rules: Array as PropType<IRulesProp[]>, 
        modelValue: String,
        tag: {
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    emits: ['update:modelValue'],
    // 如果你不希望组件的根元素继承 attribute，可以在组件的选项中设置 inheritAttrs: false。(组件标签上添加的属性会默认继承在组件的根元素上, 是保存在$attrs上的, 在props上声明的属性, 会从$attrs上提取到props上)
    inheritAttrs: false,
    setup(props, {emit}) {
        const input = reactive({
            value: computed({
                get: () => props.modelValue || '',
                set: value => {
                    emit('update:modelValue', value)
                }
            }),
            error: false,
            message: ''
        });
        // validate: 验证
        const validateInput = () => {
            if (props.rules) {
                // Array.prototype.every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值(如果回调函数的每一次返回都为 truthy 值，返回 true ，否则返回 false。执行期间有一次返回false的话, 其结果也会是false, 执行也会因此停止。)。
                const allPassed = props.rules.every(item => {
                    let passed = true;
                    input.message = item.message;
                    switch (item.type) {
                        case 'required':
                            passed = (input.value.trim() !== '')
                            break;
                        case 'email':
                            passed = emailReg.test(input.value)
                            break;
                        case 'custom':
                            passed = item.validator ? item.validator() : true
                            break;
                        default:
                            break
                    }
                    return passed;
                })
                input.error = !allPassed;
                return allPassed;
            }
            return true;
        };
        onMounted(() => {
            // emit('自定义事件', 要发送的数据)
            mitter.emit('form-item-created', validateInput)
        })

        return {
            input,
            validateInput,
        }
    },
})
</script>


<style>

</style>