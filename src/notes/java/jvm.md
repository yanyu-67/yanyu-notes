---
title: JVM 与内存管理
description: 运行时内存、类初始化与垃圾回收的基础区别。
date: 2026-09-08
category: [Java]
tag: [JVM, 内存, 垃圾回收]
order: 4
---

## 堆与虚拟机栈

**结论**：堆是线程共享的运行时区域，通常存放对象；每个线程有自己的虚拟机栈，方法调用对应栈帧，包含局部变量表和操作数栈等内容。

**易错点**：局部引用变量与它指向的对象不是同一个概念。不要把“局部变量在线程栈中”简化成“局部创建的对象一定在栈上”。具体分配还可能受逃逸分析等优化影响。

## 垃圾回收判断的是可达性

**结论**：主流 Java 垃圾收集器通过从 GC Roots 出发的可达性判断对象是否仍被使用；仅有互相引用的两个对象，如果都无法从 Roots 到达，仍可能被回收。

**易错点**：把引用赋值为 `null` 不会立刻释放对象。`System.gc()` 也只是请求，并不保证马上完成回收。

## 类加载不等于类初始化

**结论**：加载负责获得类的二进制表示；链接包括验证、准备和解析；初始化执行类变量的显式初始化及静态初始化块。

**易错点**：准备阶段的默认值与 Java 源码中的显式赋值不是同一回事。编译期常量有特殊处理，不能用普通静态字段的规则一概而论。

## 实践：观察运行参数

```bash
java -version
java -XshowSettings:vm -version
```

记录 JDK 版本、虚拟机实现和内存设置后再比较运行结果。不同收集器、堆大小和 JDK 版本下的结果可能不同，不能把一次观察当作 JVM 规范。

## 引用类型：软引用与弱引用

**结论**：软引用（SoftReference）在内存不足时回收，弱引用（WeakReference）在每次 GC 时都可能回收。二者回收时机不同，均可通过 `get()` 获取对象（可能为 null）。

**回收时机对比**：

| 引用类型 | 回收时机 | 典型用途 |
|---------|---------|---------|
| 软引用（SoftReference） | JVM 内存不足时（OOM 前） | 内存敏感缓存（图片、结果集） |
| 弱引用（WeakReference） | 下一次 GC 运行时（无论内存） | WeakHashMap、ThreadLocal 键 |

**使用方式**：
- 创建：`SoftReference<Object> ref = new SoftReference<>(obj);` / `WeakReference<Object> ref = new WeakReference<>(obj);`
- 获取：`ref.get()` 返回引用对象，若已被回收则返回 `null`。

**其他引用类型**：
- **强引用**：最常见的 `new` 创建，永不回收（只要可达）。
- **虚引用（PhantomReference）**：无法通过 `get()` 获取对象，仅用于跟踪对象回收（多用于 NIO 堆外内存清理）。

**易错点**：
- 弱引用“可能被回收”意味着不保证每次 GC 都回收，但 JVM 实现通常会在每次 GC 时清理弱引用。
- 软引用对象回收前可通过引用队列（ReferenceQueue）进行回调处理，但普通使用只需关注 `get()` 返回值是否为 null。

## JVM 堆内存参数与分代比例计算

**结论**：`-Xms` 指定 JVM 初始堆内存（最小堆），`-Xmx` 指定最大堆，`-Xmn` 指定新生代大小，`-XX:SurvivorRatio=N` 表示 Eden:单个 Survivor = N:1，两个 Survivor 区合计占比为 2/(N+2)。

**关键参数**：
- `-Xms<size>`：堆内存初始值（最小堆），JVM 启动时分配。
- `-Xmx<size>`：堆内存最大值，JVM 运行时最多可扩展至此。
- `-Xmn<size>`：新生代（Young Generation）大小，包含 Eden + 两个 Survivor。
- `-XX:SurvivorRatio=<N>`：Eden 与单个 Survivor 的大小比例，默认为 8（即 Eden:S0:S1 = 8:1:1）。

**计算示例**（SurvivorRatio=3）：
- 新生代比例 = Eden : S0 : S1 = 3 : 1 : 1，总份数 = 3+1+1=5。
- 单个 Survivor 大小 = 新生代 / 5。
- 两个 Survivor 合计 = 新生代 × 2/5。

**易错点**：
- SurvivorRatio 指定的是 Eden:单个 Survivor 的比例，两个 Survivor 区通常大小相等，合计占比需乘以 2。
- 不要混淆 `-Xms`（最小堆）和 `-Xmn`（新生代大小）的含义。
- 若 `-Xms` 与 `-Xmx` 不相等，JVM 堆可在二者之间动态伸缩；相等时可避免扩容开销，适用于对响应时间敏感的场景。

## String 对象创建与字符串常量池

**结论**：`String s = new String("xyz")` 在堆上必定创建一个新 `String` 对象；字符串常量池中的 `"xyz"` 是否新增取决于该字面量是否首次出现，因此总创建数为 1 或 2，不可能固定为 2。

**创建数判断规则**：
- **堆上对象**：`new` 操作必定在堆中新建一个 `String` 对象，无论常量池状态如何。
- **常量池对象**：字符串字面量 `"xyz"` 在类加载时检查常量池：
  - 若常量池中尚无内容相同的字符串 → 在常量池中创建对应对象，总对象数为 2（池中 1 个 + 堆上 1 个）。
  - 若常量池中已存在内容相同的字符串 → 复用已有对象，总对象数为 1（仅堆上 1 个）。

**示例**：
```java
// 首次出现 "xyz"（常量池创建 + 堆上 new）
String s1 = new String("xyz");  // 2 个对象

// 再次出现 "xyz"（常量池复用 + 堆上 new）
String s2 = new String("xyz");  // 1 个对象（仅堆上新建）
```

**易错点**：
- 不能简单认为“字面量 + new”总是创建两个对象，需要判断常量池中是否已存在。
- `String.intern()` 方法可主动将堆中的字符串加入常量池，但本题不涉及。
- Java 7+ 将字符串常量池从方法区移至堆中，但创建行为逻辑不变。

## JVM 运行时内存区域

**结论**：JVM 运行时内存分为线程私有区域（程序计数器、虚拟机栈、本地方法栈）和线程共享区域（堆、方法区、直接内存）。程序计数器是唯一不会发生 OOM 的区域；方法区在 JDK 8 由 Metaspace 实现；直接内存不受 `-Xmx` 限制。

**内存区域一览**：

| 区域 | 线程私有/共享 | 存储内容 | 可能错误 | 关键参数 |
|------|-------------|---------|---------|---------|
| 程序计数器 | 私有 | 当前线程执行的字节码行号 | 无 | — |
| 虚拟机栈 | 私有 | 栈帧（局部变量表、操作数栈、动态链接等） | StackOverflowError / OOM | `-Xss` |
| 本地方法栈 | 私有 | native 方法调用状态 | StackOverflowError / OOM | — |
| 堆 | 共享 | 对象实例、数组 | OOM: Java heap space | `-Xms` / `-Xmx` |
| 方法区 | 共享 | 类信息、常量、静态变量、JIT 代码 | OOM: Metaspace | `-XX:MaxMetaspaceSize` |
| 直接内存 | 共享 | NIO 直接缓冲区（堆外） | OOM: Direct buffer memory | `-XX:MaxDirectMemorySize` |

**关键特性**：
- **程序计数器**：唯一不会 OOM 的区域，线程私有，记录当前执行位置。
- **虚拟机栈局部变量表**：存放基本数据类型和对象引用，不存放对象本身。
- **方法区**：JDK 8 前由 PermGen 实现（堆内），JDK 8 起由 Metaspace 实现（本地内存）。
- **直接内存**：不受 `-Xmx` 限制，由 `-XX:MaxDirectMemorySize` 控制（默认与 `-Xmx` 相同），用于 NIO 高性能 I/O。

**易错点**：
- Direct Memory 不受 `-Xmx` 直接限制，需单独关注 `-XX:MaxDirectMemorySize`。
- 局部变量表存放的是对象引用，而非对象本身（对象在堆中）。
- 方法区是 JVM 规范中的逻辑概念，JDK 8 后 Metaspace 是其具体实现，使用本地内存。
- 程序计数器是唯一规范未定义 OOM 的区域。

## JVM 内存映像与常用诊断工具

**结论**：生成 JVM 内存映像（堆转储，heap dump）用 jmap。其他 JDK 工具各有分工，不生成完整内存映像。

**常用工具与用途**：

- jmap：生成堆转储、查看堆内存与对象统计。生成转储：`jmap -dump:format=b,file=heap.hprof <pid>`；查看对象统计：`jmap -histo:live <pid>`。
- jstat：监控 GC 次数、堆内存使用率等运行时统计，只提供动态数据。
- jinfo：查看或修改 JVM 运行时参数，如系统属性、启动参数。
- jhat：分析已生成的堆转储文件并通过 HTTP 展示结果，本身不生成内存映像；较新 JDK 中已移除，可用 MAT 等替代。

**易错点**：混淆“生成转储”和“分析转储”。jmap 负责生成，jhat 负责分析。另需注意，生成堆转储不只 jmap 一种方式，HotSpot 还支持 `-XX:+HeapDumpOnOutOfMemoryError` 在 OOM 时自动转储，以及 jcmd 的 GC.heap_dump。