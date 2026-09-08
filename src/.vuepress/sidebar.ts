import { sidebar } from "vuepress-theme-hope";

// 按板块从文件结构生成；README 的 dir 控制分组，文章的 order 控制顺序。
export default sidebar({
  "/notes/": "structure",
  "/tools/": "structure",
  "/portfolio/": "structure",
  // 精确匹配放在前面，根路径回退也自动支持以后新增的板块。
  "/": "structure",
});
