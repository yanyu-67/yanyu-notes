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
