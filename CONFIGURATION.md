# 完整配置与官方依据

以下是本次交付的完整配置快照，没有省略项。实际生效位置是 src/.vuepress 下的配置文件与 src/README.md；后续修改配置时以实际文件为准，并同步本快照。

## src/.vuepress/config.ts

配置站点根路径、简体中文与浏览器标题，主题行为统一交给 theme.ts。

```ts
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  // 部署到域名根路径；若部署到子路径，需同步调整此项。
  base: "/",

  // 站点语言和浏览器标题。
  lang: "zh-CN",
  title: "言羽的知识库",
  description: "言羽的编程知识库，沉淀 Java、MySQL、Linux、软件测试、Vue 与 Spring Boot 知识，记录常用工具与个人作品。",

  // 导航、侧边栏及 Markdown 增强由主题配置统一管理。
  theme,
});
```

## src/.vuepress/theme.ts

代码高亮与行号走主题的 highlighter 配置；提示容器、图片增强、复制按钮使用主题集成插件。toc 是文章目录开关，正文目录可另用 VuePress 的 `[[toc]]` 语法。未提供真实仓库与域名，不显示误导性编辑入口，也不生成错误的 SEO 和站点地图。

```ts
import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  // 未提供真实域名及仓库地址，暂不生成站点地图或编辑链接。
  author: { name: "言羽" },
  docsDir: "src",
  editLink: false,
  contributors: false,
  lastUpdated: false,

  // 小型知识库开启结构热更新，新增 Markdown 后自动更新侧边栏。
  navbar,
  sidebar,
  hotReload: true,
  toc: true,

  // 全站使用统一页脚，内容页不再保留模板作者信息。
  footer: "言羽的知识库 · 编程学习、工具笔记与个人作品",
  copyright: "Copyright © 2026 言羽",
  displayFooter: true,

  // 使用主题内置的 Markdown 增强，无需重复安装独立插件。
  markdown: {
    highlighter: { type: "shiki", lineNumbers: true },
    hint: true,
    imgLazyload: true,
    imgSize: true,
    codeTabs: true,
    tasklist: true,
    mark: true,
  },

  // 尚未初始化 Git，也未配置评论服务和部署域名。
  plugins: {
    copyCode: { showInMobile: true },
    git: false,
    comment: false,
    sitemap: false,
    seo: false,
  },
});
```

## src/.vuepress/navbar.ts

顶层只保留首页与三大板块，全部使用中文命名。

```ts
import { navbar } from "vuepress-theme-hope";

// 导航只保留三个内容板块，具体专题由各板块索引及侧边栏承载。
export default navbar([
  { text: "首页", link: "/" },
  { text: "学习笔记", link: "/notes/" },
  { text: "工具集", link: "/tools/" },
  { text: "作品集", link: "/portfolio/" },
]);
```

## src/.vuepress/sidebar.ts

所有板块均采用官方结构侧边栏，无需手动列出专题文件。更精确的路径在前，根路径回退在后。

```ts
import { sidebar } from "vuepress-theme-hope";

// 按板块从文件结构生成；README 的 dir 控制分组，文章的 order 控制顺序。
export default sidebar({
  "/notes/": "structure",
  "/tools/": "structure",
  "/portfolio/": "structure",
  // 精确匹配放在前面，根路径回退也自动支持以后新增的板块。
  "/": "structure",
});
```

## src/README.md

`home: true` 使用主题项目首页。heroText 是站点主标题，tagline 描述学习定位；官方文档将顶层 features 标为旧版，因此这里使用当前的 highlights[].features。页脚继承 theme.ts，不重复覆盖。

```markdown
---
home: true
title: 首页
description: 言羽的知识库，记录编程知识、常用工具与个人作品。
heroText: 言羽的知识库
tagline: 从一道题理解一个知识点，从一次实践积累一份经验。
actions:
  - text: 学习笔记
    link: /notes/
    type: primary
  - text: 个人作品
    link: /portfolio/
highlights:
  - header: 学习与积累
    features:
      - title: 学习笔记
        details: Java、MySQL、Linux、软件测试、Vue 与 Spring Boot，串联知识结论、易错点和实践验证。
        link: /notes/
      - title: 工具集
        details: 开发环境、版本管理与日常效率工具，留存真正用得上的操作经验。
        link: /tools/
      - title: 作品集
        details: 记录项目目标、技术选择和实现过程，让学习落到可运行的作品上。
        link: /portfolio/
---

## 编程专题

| 技术方向 | 内容 |
| --- | --- |
| [Java](./notes/java/README.md) | 语言基础、集合、并发、JVM、IO 与异常 |
| [MySQL](./notes/mysql/README.md) | SQL、索引、事务与表设计 |
| [Linux](./notes/linux/README.md) | 常用命令、用户权限、进程与网络 |
| [软件测试](./notes/testing/README.md) | 测试基础、用例设计、接口与自动化 |
| [Vue](./notes/vue/README.md) | 模板语法、响应式、组件、路由与状态 |
| [Spring Boot](./notes/spring-boot/README.md) | 自动配置、环境配置、Web 接口与事务 |
```

## 官方参考

核对时间：2026-09-08。以主题官方文档及本地实际构建行为共同验证；Context7 本次未检索到准确的 Hope 主题条目，因此未使用其他模板的配置替代官方说明。

- [主题首页](https://theme-hope.vuejs.press/zh/guide/layout/home.html)
- [自动侧边栏、排序和 dir](https://theme-hope.vuejs.press/zh/guide/layout/sidebar.html)
- [目录页与 Catalog](https://theme-hope.vuejs.press/zh/guide/feature/catalog.html)
- [Markdown 行为与 highlighter](https://theme-hope.vuejs.press/zh/config/markdown/behavior.html)
- [Markdown 语法](https://theme-hope.vuejs.press/zh/config/markdown/grammar.html)
- [主题插件](https://theme-hope.vuejs.press/zh/config/plugins/intro.html)

未增加第三方依赖；保留模板原有 Sass 样式入口。后续需要搜索、评论或 PWA 时再按真实需求安装或配置官方支持的插件。