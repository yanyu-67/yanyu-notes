---
title: 言羽的知识库
description: 基于 VuePress 2 与 Hope 主题的扁平化个人知识库。
date: 2026-09-08
category: [作品集]
tag: [VuePress, Markdown, 知识管理]
order: 1
---

## 项目目标

将选择题中遇到的知识、课程理解和编码实践归入同一套技术专题，而不是为每次学习建立零散文件。保留工具笔记和项目作品两个独立入口。

## 页面实览

![言羽的知识库首页，包含三个板块入口和技术专题](/assets/knowledge-base-home.png)

## 技术方案

| 部分 | 选择 |
| --- | --- |
| 页面生成 | VuePress 2，Vite 构建 |
| 文档布局 | vuepress-theme-hope |
| 内容存储 | Markdown 与 frontmatter |
| 内容导航 | structure 自动侧边栏与 Catalog 索引 |
| 代码展示 | Shiki 高亮、行号及复制按钮 |

## 关键设计

每个技术方向只有一层专题文件。侧边栏表达“技术方向 → 专题”，文章目录表达具体知识点。新增文章通过 frontmatter 决定标题和顺序，不需要维护第二份文章链接清单。

课程与练习的结果就近归入知识点；只有具备明确目标及完整实现的项目进入作品集，避免混淆过程记录和项目成果。

## 本地运行

```bash
npm ci
npm run docs:dev
```

发布前执行 `npm run docs:build`，输出目录为 `src/.vuepress/dist`。部署域名、远程仓库和评论服务尚未配置，页面不展示虚构链接。

## 后续完善

- 随日常学习修订专题，记录结论的适用版本。
- 在实际内容规模需要时评估搜索功能。
- 确定部署位置后配置域名、子路径及站点地图。

进入 [学习笔记](../notes/README.md) 或 [工具集](../tools/README.md)。