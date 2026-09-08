---
title: 组件通信与生命周期
description: 单向数据流、事件和组件资源清理。
date: 2026-09-08
category: [Vue]
tag: [Vue3, 组件]
order: 3
---

## Props 向下，事件向上

**结论**：父组件通过 props 提供输入，子组件通过事件表达更新意图，父组件决定如何修改状态。

**易错点**：props 是浅只读的，对象内部仍可能被修改，但这会使数据来源难以追踪。不要把“技术上能修改嵌套字段”当作推荐的数据流。

```vue
<script setup>
defineProps({ count: { type: Number, required: true } });
const emit = defineEmits(["increment"]);
</script>

<template>
  <button @click="emit('increment')">已记录 {{ count }} 个知识点</button>
</template>
```

父组件监听 `increment` 后更新计数，子组件不直接修改传入的 count。

## 生命周期与资源清理

**结论**：`onMounted` 在组件挂载后执行，浏览器 DOM 操作适合放在此阶段；定时器、全局事件监听等资源应在卸载阶段清理。

**易错点**：服务端渲染环境没有浏览器的 `window` 和 `document`，`onMounted` 也不会在服务端执行。本知识库由 VuePress 预渲染，因此不能在模块顶层直接读取浏览器对象。

## 组件事件不会像 DOM 事件一样冒泡

**结论**：组件自定义事件需要直接父组件监听或显式转发。跨层级共享可考虑 provide/inject，更大范围的共享状态再考虑状态管理库。

**易错点**：没有必要为了两个相邻组件之间的通信立即引入全局状态。