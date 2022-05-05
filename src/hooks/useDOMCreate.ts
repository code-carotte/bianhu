import { onUnmounted } from 'vue'

// 创建一个div元素添加到body, 其id为nodeId, 组件卸载后再删除div元素。 
function useDOMCreate(nodeId: string) {
    const node = document.createElement('div');
    node.id = nodeId;
    document.body.appendChild(node);
    onUnmounted(() => {
        document.body.removeChild(node)
    })
}

export default useDOMCreate