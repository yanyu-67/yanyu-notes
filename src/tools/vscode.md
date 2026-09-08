---
title: VS Code 与 Markdown 写作
description: 在编辑器中定位专题、预览 Markdown 并验证知识库。
date: 2026-09-08
category: [工具集]
tag: [VS Code, Markdown]
order: 2
---

## 适用场景

VS Code 把文件管理、全文检索和终端放在一起，适合边做题、边查已有知识点、边更新文档。

## 写之前先搜索

新增知识点前先搜索术语，例如 `volatile` 或 `COUNT`。已有对应标题就修订或补充，避免同一个结论分散在多处后逐渐不一致。

**易错点**：搜索构建目录可能看到重复或过时页面，应把内容搜索限制在 `src/notes`，或排除 `.vuepress/.temp`、`.cache`、`dist`。

## 两种预览各有用途

**结论**：编辑器 Markdown 预览适合快速检查普通标题、表格和代码；主题容器、自动目录和导航必须在 VuePress 页面中验证。

在项目根目录执行：

```bash
npm run docs:dev
```

**易错点**：工作区外层还有一层同名项目目录。如果终端提示找不到 package.json，应先进入包含该文件的内层目录。

## 编程实践的验证边界

文档构建能检查 Markdown 和链接，不会自动执行正文中的 Java、SQL、Shell 或 Vue 示例。实践记录应写明环境、执行命令及观察结果，而不是把高亮成功当作代码测试通过。

参考：[VS Code Markdown 文档](https://code.visualstudio.com/docs/languages/markdown)。