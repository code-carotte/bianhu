/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 为 .vue 文件创建的定义文件。.vue 文件在TS中是不认可的, 该文件用于告诉TS .vue 文件是什么文件。