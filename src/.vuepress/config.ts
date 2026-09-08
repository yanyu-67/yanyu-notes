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
