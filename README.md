# 言羽的知识库

基于 VuePress 2 与 vuepress-theme-hope 的中文个人知识库。以技术方向分类，每个方向保留几篇专题 Markdown；选择题知识点、课程理解和编码验证直接补充到对应专题，不为每道题建一页。

## 运行

当前 VS Code 工作区比实际项目根目录高一层。先进入包含 package.json 的目录：

```powershell
cd yanyu-notes
npm ci
npm run docs:dev
```

如果终端已经在项目根目录，不要重复 `cd yanyu-notes`。当前环境验证使用 Node.js `v22.22.1`、npm 锁文件及现有依赖版本，未新增依赖。

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件重装依赖；已有完整依赖时日常写作不需要执行 |
| `npm run docs:dev` | 开发预览，访问终端给出的地址 |
| `npm run docs:clean-dev` | 清理 VuePress 缓存后启动，适合缓存异常时使用 |
| `npm run docs:build` | 生产构建，输出到 `src/.vuepress/dist/` |

VuePress `2.0.0-rc.31`，Vite bundler `2.0.0-rc.31`，Hope `2.0.0-rc.109`。不要仅为写一篇笔记运行依赖升级命令；主题与 VuePress 的升级应另行核对兼容性。

## 最终目录

以下为交付源码树，不展开可重新生成的 node_modules、.cache、.temp、dist；这些目录已加入 Git 忽略规则。

```text
yanyu-notes/
├─ README.md                         # 本维护说明，不发布为站点页面
├─ CONFIGURATION.md                  # 完整配置快照、中文说明及官方依据
├─ .gitignore                        # 依赖、缓存、产物与环境文件忽略规则
├─ package.json                      # 保留原有依赖与四个命令
├─ package-lock.json                 # npm 锁文件，未改动
├─ tsconfig.json                     # 原有 TypeScript 配置，未改动
└─ src/
   ├─ README.md                      # 主题首页
   ├─ .vuepress/
   │  ├─ config.ts                   # 中文站点信息与根路径
   │  ├─ theme.ts                    # 页脚、增强功能、主题行为
   │  ├─ navbar.ts                   # 首页与三个板块入口
   │  ├─ sidebar.ts                  # 按文件结构自动生成侧边栏
   │  ├─ styles/
   │  │  ├─ config.scss              # 保留模板默认主题色
   │  │  ├─ index.scss               # 保留自定义样式入口
   │  │  └─ palette.scss             # 保留配色入口
   │  └─ public/
   │     ├─ favicon.ico              # 保留浏览器图标
   │     └─ assets/
   │        └─ knowledge-base-home.png # 当前知识库首页截图
   ├─ notes/
   │  ├─ README.md                   # 学习笔记总索引
   │  ├─ java/
   │  │  ├─ README.md                # Java 导读及自动目录
   │  │  ├─ basics.md                # 语法、值传递、面向对象
   │  │  ├─ collections.md           # 集合、泛型
   │  │  ├─ concurrency.md           # 线程、可见性、锁
   │  │  ├─ jvm.md                   # 内存、类初始化、垃圾回收
   │  │  └─ io-exceptions.md         # 字节与字符、异常、资源关闭
   │  ├─ mysql/
   │  │  ├─ README.md                # MySQL 导读及自动目录
   │  │  ├─ sql.md                   # NULL、聚合、连接
   │  │  ├─ indexes.md               # 联合索引、覆盖索引、执行计划
   │  │  ├─ transactions.md          # ACID、隔离级别、锁
   │  │  └─ design.md                # 数据类型、约束、表设计
   │  ├─ linux/
   │  │  ├─ README.md                # Linux 导读及自动目录
   │  │  ├─ commands.md              # 文件、管道、文本处理
   │  │  ├─ permissions.md           # 用户、目录权限、umask
   │  │  ├─ processes.md             # 进程、信号、systemd
   │  │  └─ networking.md            # 网络与连接排查
   │  ├─ testing/
   │  │  ├─ README.md                # 测试导读及自动目录
   │  │  ├─ fundamentals.md          # 测试目的、回归、缺陷
   │  │  ├─ test-design.md           # 等价类、边界、判定表
   │  │  ├─ api-testing.md           # HTTP 与接口断言
   │  │  └─ automation.md            # 自动化分层及 Node 测试示例
  │  ├─ vue/
  │  │  ├─ README.md                # Vue 3 导读及自动目录
  │  │  ├─ basics.md                # 模板、条件与列表
  │  │  ├─ reactivity.md            # ref、computed、watch
  │  │  ├─ components.md            # 通信、生命周期
  │  │  └─ routing-state.md         # 路由、状态归属
  │  └─ spring-boot/
  │     ├─ README.md                # Spring Boot 导读及自动目录
  │     ├─ basics.md                # 基础、依赖注入、自动配置
  │     ├─ configuration.md         # 外部化配置与 Profile
  │     ├─ web.md                   # Web 接口、参数绑定与校验
  │     └─ data-transactions.md     # 数据访问与声明式事务
   ├─ tools/
   │  ├─ README.md                   # 工具自动索引
   │  ├─ git.md                      # 版本管理与提交前检查
   │  └─ vscode.md                   # 编辑、预览与验证
   └─ portfolio/
      ├─ README.md                   # 项目自动索引
      └─ knowledge-base.md           # 当前知识库项目介绍，不虚构经历
```

## 每天怎么记录

1. 先按术语搜索已有专题，已有知识点直接修订，不复制多份结论。
2. 选择题只提炼知识结论及易错点，题干和选项按需用自己的话概括。
3. 课程理解写进对应知识点，按需注明课程来源、课时及时间点，不整段转载课程内容。
4. 编码实践补充环境、关键代码、实际输出和结论；未运行的代码明确标为预期结果。
5. 保存后查看开发预览，发布前执行生产构建。

**分类规则**：目录表示技术，文件表示专题，二级标题表示知识点。分类和标签是辅助元数据；本项目不启用博客标签聚合页、自动错题统计或复习提醒。

## 示例一：追加一条 Java 知识点

这是默认工作流，不需要新建文件。打开 [集合与泛型](src/notes/java/collections.md)，在文末追加：

````markdown
## Arrays.asList 返回的列表能否增删

**结论**：Arrays.asList 返回由原数组支持的固定大小列表，可以替换元素，但不支持改变列表长度。

**易错点**：不能把“固定大小”理解为“完全不可修改”；set 可以使用，add 和 remove 等改变长度的操作会抛出 UnsupportedOperationException。

```java
import java.util.Arrays;
import java.util.List;

public class FixedSizeList {
    public static void main(String[] args) {
        String[] topics = {"Java", "Vue"};
        List<String> values = Arrays.asList(topics);
        values.set(0, "MySQL");
        System.out.println(topics[0]);
    }
}
```

**预期结果**：输出 MySQL，因为列表修改反映到原数组。
````

保存后访问 `/notes/java/collections.html`，该标题会出现在文章目录中。文件顶部 frontmatter 只保留一份，不给每个知识点重复添加。

## 示例二：新增一篇 Java 专题

仅当现有专题不适合承载内容时新增。比如创建 `src/notes/java/strings.md`，完整内容可以是：

```markdown
---
title: 字符串与文本处理
description: String 不可变性与字符串内容比较。
date: 2026-09-08
category: [Java]
tag: [字符串, 基础]
order: 6
---

## String 的不可变性

**结论**：String 对象创建后，其字符内容不能被修改。拼接或替换等操作不会改变原对象的内容，而是返回结果字符串。

**易错点**：变量可以重新指向另一个 String；“对象不可变”不等于“变量不能重新赋值”。

## 内容比较

**结论**：判断两个字符串的字符内容是否相等使用 equals，而不是引用比较运算符 ==。

**易错点**：字符串常量池可能让某些 == 比较返回 true，但不能据此把 == 当成内容比较。
```

日期填写实际记录日期。保存后，Java 索引的 `<Catalog />` 和自动侧边栏会收录新页，访问地址为 `/notes/java/strings.html`，无需改导航或侧边栏配置。此例仅是操作演示，交付时没有提前创建该文件。

## 可选：新增章节目录

当前不需要更深嵌套。以后某个专题确实过长时，可创建 `src/notes/java/networking/README.md`：

```markdown
---
title: 网络编程
description: Java 网络连接与 HTTP 客户端相关笔记。
date: 2026-09-08
category: [Java]
tag: [索引, 网络]
dir:
  order: 7
  link: true
  collapsible: true
  expanded: false
---

先理解超时、连接与协议，再记录客户端实现及异常处理。

## 专题

<Catalog />
```

再在同目录新增带 frontmatter 的专题 Markdown 即可。`dir.order` 控制目录顺序，普通页面的 `order` 控制文件顺序。每个内容目录都保留 README，避免出现英文目录名或缺失导读。

## 新增技术方向与顶层板块

**新增技术方向**：例如在 `src/notes/redis/` 创建 README 和专题，参考现有 Java 索引设置 `dir.order`。学习笔记索引与侧边栏自动收录。首页的技术方向表格是人工精选入口，需要展示 Redis 时单独补一行。

**新增顶层板块**：例如新增“阅读摘记”：

1. 创建 `src/reading/README.md`，使用上一节索引格式，改成阅读摘记的标题、描述、分类和 `dir.order: 4`；正文保留 `<Catalog />`。
2. 在同目录新增内容 Markdown，引用书籍时写明来源，优先记录自己的理解。
3. 在 `navbar.ts` 数组末尾加入 `{ text: "阅读摘记", link: "/reading/" }`。
4. 为保持板块内独立导航，在 `sidebar.ts` 的根路径回退项前加入 `"/reading/": "structure"`。即使暂不添加，根路径回退也会自动收录。
5. 首页需要展示时，在 `highlights` 的 `features` 中增加对应的标题、说明和链接。
6. 检查新入口，再运行 `npm run docs:build`。

## 常用写作语法

- `## 知识点` 生成文章目录项；`###` 用于真正需要的小节，不必为“结论”单独建标题。
- `[[toc]]` 在正文插入目录；主题右侧文章目录已全局开启，短文可以不写正文目录。
- 代码围栏注明 `java`、`sql`、`bash`、`js` 或 `vue`，自动获得高亮、行号和复制按钮。
- 提示容器使用 `::: tip 标题` 或 `::: warning 标题`，正文之后用 `:::` 结束。
- 图片放在 `src/.vuepress/public/assets/`，正文使用 `![描述](/assets/文件名.png)`，主题启用原生懒加载。
- 页面链接优先使用相对 Markdown 路径，例如 `[集合](./collections.md)`；标题链接尽量通过页面复制，避免猜测中文锚点。
- `- [ ]` 与 `- [x]` 是 Markdown 状态。复选框不是带持久化能力的任务应用，需要编辑源文件更新。

## 自动导航为何这样配置

三大板块使用 `structure`，目录分组信息由 README 的 `dir` 决定。它让文件结构成为唯一的文章清单，减少写完笔记却忘记添加导航的情况。索引使用官方 `<Catalog />` 同步列出内容，不重复维护文章链接。

`hotReload: true` 适合当前小型知识库，可跟踪新增文章及元数据变化；内容很多时可关闭以降低重算成本，然后通过重启开发服务刷新结构。若遇到开发缓存异常，先停止旧服务再运行 `docs:clean-dev`。不要让构建与开发服务长期并发修改同一个临时目录。

## 模板处理记录

| 原内容 | 处理 |
| --- | --- |
| src/README.md 宣传首页 | 改为言羽知识库首页，三大板块与六方向入口 |
| src/portfolio.md 柯南档案 | 删除，改为 portfolio 目录及真实知识库项目介绍 |
| demo 的 README、disable、encrypt、layout、markdown、page | 全部删除，日常语法整理在本说明 |
| guide 的 README、bar/README、bar/baz、foo/README、foo/ray | 全部删除，以六个技术方向替代 |
| Mr.Hope 作者、演示域名、主题仓库及默认页脚 | 移除或替换，不虚构个人仓库和部署地址 |
| 示例密码、测试 Giscus、未使用的组件与 PWA 演示配置 | 删除；评论、Git 信息、SEO 与站点地图暂不启用 |
| 旧 Logo、assets/image 宣传图、assets/icon PWA 图标 | 确认无引用后删除；保留 favicon，新增真实首页截图 |
| styles、package.json、package-lock.json、tsconfig.json | 保留，不进行无关重写或依赖升级 |

## 验证与发布边界

完整配置及官方参考见 [CONFIGURATION.md](CONFIGURATION.md)。文档构建不执行代码围栏中的示例，未在对应技术环境运行的示例仅提供预期行为。

部署到域名根路径时保留 `base: "/"`；部署到 `/yanyu-notes/` 等子路径时先调整 config.ts 的 base，重新构建，并检查图片及直接刷新页面。填入真实域名后再启用 SEO、站点地图；配置真实 Git 仓库后再开启编辑链接和 Git 更新时间。

当前没有自动初始化 Git、创建提交、部署到公网、配置评论服务或增加搜索依赖。