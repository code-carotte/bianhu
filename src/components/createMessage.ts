import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
    // createApp 返回一个提供应用上下文的应用实例 它接收2个参数：根组件选项对象(可以是组件实例), 组件的props
    const messageInstance = createApp(Message, {
        message,
        type
    });
    const mountNode = document.createElement('div'); // 创建div元素
    messageInstance.mount(mountNode);   // 挂载组件到div元素
    setTimeout(() => {
        messageInstance.unmount(); // 卸载组件 同时 会删除掉div元素
        // document.body.removeChild(mountNode); // 删除div元素
    }, timeout)
}

export default createMessage