import { navbar } from "vuepress-theme-hope";

// 导航只保留三个内容板块，具体专题由各板块索引及侧边栏承载。
export default navbar([
  { text: "首页", link: "/" },
  { text: "学习笔记", link: "/notes/" },
  { text: "工具集", link: "/tools/" },
  { text: "作品集", link: "/portfolio/" },
]);
