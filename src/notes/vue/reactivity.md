---
title: 响应式与计算属性
description: ref、reactive、computed、watch 与 DOM 更新时机。
date: 2026-09-08
category: [Vue]
tag: [Vue3, 响应式]
order: 2
---

## ref 与 reactive

**结论**：`ref()` 可以包装基本类型或对象，在 JavaScript 中通过 `.value` 访问；`reactive()` 返回对象的响应式代理。

**易错点**：在模板中顶层 ref 通常会自动解包，但不能推断所有嵌套场景都会解包。把 `reactive` 对象的基本类型字段直接解构为局部变量，会脱离原属性的响应式访问。

```js
import { reactive, toRefs } from "vue";

const state = reactive({ count: 0 });
const { count } = toRefs(state);
state.count++;
console.log(count.value);
```

**预期结果**：输出 `1`。此示例在安装 Vue 的 ES 模块环境运行。

## computed 与 watch

**结论**：`computed` 表达由响应式依赖派生出的值，具有基于依赖的缓存；`watch` 用于响应数据变化执行副作用，例如请求数据。

**易错点**：不要把网络请求或修改外部状态放入计算属性 getter。侦听 `state.count` 时应提供 `() => state.count`，不能把当前数值作为侦听源。

## DOM 更新不是同步完成

**结论**：响应式状态改变后，Vue 会批量调度 DOM 更新。需要读取更新后的 DOM 时可等待 `nextTick()`。

**易错点**：状态值已经变化不代表页面 DOM 已在同一行之后同步更新。`nextTick` 等待的是 Vue 更新，不是任意网络请求完成。