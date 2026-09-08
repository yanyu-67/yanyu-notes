---
title: 模板与基础语法
description: Vue 3 模板绑定、条件渲染和列表标识。
date: 2026-09-08
category: [Vue]
tag: [Vue3, 模板]
order: 1
---

## v-if 与 v-show

**结论**：`v-if` 按条件创建或销毁对应分支；`v-show` 保留元素，通过 CSS 的 display 切换显示。

**易错点**：`v-show` 不会因为隐藏就卸载组件。频繁切换通常可考虑 `v-show`，但应结合初始渲染开销和生命周期需求。

## 列表的 key

**结论**：`key` 帮助 Vue 在更新时识别节点身份，应使用稳定且唯一的业务标识。

**易错点**：有插入、删除、排序的列表若使用数组下标作 key，可能导致输入状态等被错误复用。每次生成随机 key 又会造成不必要的重建。

## 实践：声明式列表

以下是可放入 Vue 3 项目的单文件组件：

```vue
<script setup>
import { ref } from "vue";

const visible = ref(true);
const topics = [
  { id: "java", title: "Java" },
  { id: "vue", title: "Vue" },
];
</script>

<template>
  <button @click="visible = !visible">切换列表</button>
  <ul v-if="visible">
    <li v-for="topic in topics" :key="topic.id">{{ topic.title }}</li>
  </ul>
</template>
```

**预期行为**：点击按钮在显示和销毁列表之间切换。这里只展示学习代码，不会把代码块当作站点组件执行。