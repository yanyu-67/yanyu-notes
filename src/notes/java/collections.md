---
title: 集合与泛型
description: 区分 ArrayList 容量、集合行为和泛型类型约束。
date: 2026-09-08
category: [Java]
tag: [集合, 泛型, 易错点]
order: 2
---

[[toc]]

## ArrayList 的容量与元素数量

**结论**：容量是底层数组能容纳的元素数量，`size()` 是实际元素数量。

```java
import java.util.ArrayList;

public class ListCapacity {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>(10);
        System.out.println(numbers.size());
        numbers.add(1);
        System.out.println(numbers.size());
    }
}
```

**预期结果**：依次输出 `0` 和 `1`。构造参数 `10` 不会自动添加元素。

::: warning 易错点
初始容量不是最大容量，列表仍可扩容。`get(0)` 在空列表上会抛出 `IndexOutOfBoundsException`，即使初始容量是 10。
:::

## HashMap 的键相等条件

**结论**：`HashMap` 使用哈希值定位候选位置，再通过键的相等性判断是否为同一个键。不同键允许哈希冲突。

**易错点**：哈希值相同不代表对象相等；对象相等必须具有相同哈希值。作为键的对象放入 Map 后，不应修改参与 `equals()` 和 `hashCode()` 的字段。

## 泛型不具有普通的子类型协变关系

**结论**：`Integer` 是 `Number` 的子类，但 `List<Integer>` 不是 `List<Number>` 的子类。读取一组数值可使用 `List<? extends Number>`。

**易错点**：不能向 `List<? extends Number>` 随意添加 `Integer`，因为它实际可能是 `List<Double>`。`? super Integer` 适合接收整数写入，但读取时只能静态地保证得到 `Object`。

## 实践：观察集合行为

在 JShell 中比较 `List.of(1, 2)` 与 `new ArrayList<>(List.of(1, 2))` 的 `add(3)` 行为。前者不可修改，会抛出 `UnsupportedOperationException`；后者支持添加。记录异常类型比只记录“执行失败”更有价值。

## Map 的 key 与 value 特性

**结论**：Map 的 key 不可重复（重复 key 会覆盖旧 value），value 可以重复。不同 key 可以映射到同一个 value。

**核心规则**：
- **Key 唯一性**：Map 通过 key 检索 value，因此 key 必须唯一。插入已存在的 key 时，新 value 覆盖旧 value。
- **Value 可重复**：value 没有唯一性限制，多个 key 可对应相同 value。

**与其他集合对比**：
- `Map.keySet()` 本质上是一个 `Set`（不可重复）。
- `Map.values()` 返回一个 `Collection`（可重复）。
- `List` 元素可重复；`Set` 元素不可重复。

**常见误区**：
- “Map 的 key 和 value 都不可重复”是错误说法。
- 覆盖是指 value 被替换，而非插入新条目。
- 检查 Map 是否包含某个 value 时，需注意 value 可能被多个 key 共享。

## HashMap 实现细节与 JDK 8 优化

**结论**：HashMap 在 JDK 8 中引入了红黑树优化，当桶内链表长度 ≥ 8 且表容量 ≥ 64 时，链表树化为红黑树，将最坏情况查询从 O(n) 降至 O(log n)。索引计算采用 `(n-1) & hash`，冲突处理为链表 + 红黑树。

**JDK 8 关键设计**：
1. **索引计算**：`index = (table.length - 1) & hash`（等效于 `hash % capacity`，但按位与效率更高）。
2. **冲突解决**：桶内冲突元素以链表存储；当链表长度达到阈值时升级为红黑树。
3. **树化条件**：链表长度 ≥ **8** 且表容量 ≥ **64**。若表容量 < 64，优先扩容而非树化（避免小表树化低效）。
4. **退树化**：当红黑树节点数 ≤ **6** 时，退化为链表。

**性能对比**：
- 平均查询：O(1)
- 链表桶内查询：O(n)（退化为线性搜索）
- 红黑树桶内查询：O(log n)

**JDK 7 vs JDK 8 对比**：

| 特性 | JDK 7 | JDK 8 |
|------|-------|-------|
| 冲突处理 | 仅链表 | 链表 + 红黑树 |
| 最坏查询 | O(n) | O(log n) |
| 插入顺序 | 头插法（有扩容死循环风险） | 尾插法 |

**易错点**：
- 树化条件是**两个条件同时满足**（链表长度 ≥ 8 且表容量 ≥ 64），而非仅看链表长度。
- 红黑树不是 AVL 树——两者都是自平衡二叉搜索树，但红黑树平衡条件更宽松。
- 平均 O(1) 是哈希冲突较少时的预期表现；极端情况下（所有 key 哈希值相同）会退化到 O(log n)（树化后）。

## 集合类的线程安全性

**结论**：Vector、StringBuffer、Properties（继承 Hashtable）是线程安全的；ArrayList、HashMap、StringBuilder 不是线程安全的。

**原因**：

- Vector、Hashtable、StringBuffer 属于早期集合类，关键方法用 synchronized 修饰，因此线程安全，但单线程下性能低于 ArrayList、HashMap、StringBuilder。
- ArrayList、HashMap、StringBuilder 不做同步，多线程并发修改可能导致数据不一致、并发修改异常或结构损坏。
- Properties 继承自 Hashtable，所以沿用了同步方法，属于线程安全的 Map。

**需要线程安全时的替代方案**：

- Map：ConcurrentHashMap 或 Collections.synchronizedMap()。
- List：Vector 或 Collections.synchronizedList()。
- 字符串拼接：StringBuffer（多线程）、StringBuilder（单线程）。

**易错点**：把“线程安全”等同于“并发性能好”。Vector、Hashtable、StringBuffer 是全局锁，竞争激烈时性能较差；现代并发场景优先使用 java.util.concurrent 下的并发集合（如 ConcurrentHashMap、CopyOnWriteArrayList）。

## Java 泛型的不可协变性与通配符赋值规则

**结论**

Java 泛型不是协变的。即使 `B extends A`，`List<B>` 也不能赋给 `List<A>`。`List<?>` 可接收任意 `List<T>`；`? extends` 支持协变，因此 `List<? extends B>` 可赋给 `List<? extends A>`。

**原因**

泛型不可协变是为了保证类型安全。若 `List<B>` 能赋给 `List<A>`，就能通过 `List<A>` 引用向其中加入 `C` 对象，破坏原本只应存放 `B` 的列表。

常用赋值规则：

- 原始类型 `List` 可接收任意 `List<T>`，编译时有 unchecked 警告。
- `List<?>` 可指向任何 `List<T>`，包括 `List<Object>`。
- `? extends` 上界通配符支持协变：`List<? extends B>` 可赋给 `List<? extends A>`。
- `List<? extends A>` 不能赋给 `List<A>`，因为前者可能实际是 `List<B>`，赋给 `List<A>` 后就能加入 `C`，不安全。
- `List<Object>` 不能赋给任意具体 `List<T>`，例如不能赋给 `List<String>`。

**易错点**

- `List<B>` 与 `List<A>` 之间没有赋值关系，即使 `B extends A`。
- 通过 `List<?>` 读取只能得到 `Object`，且不能安全加入除 `null` 外的元素。
- `? extends` 支持协变读取，但不支持写入；`? super` 支持写入，但读取只能得到 `Object`。

## Java 常见队列实现对比

**结论**

Java 中不同 `Queue` 实现在线程安全性、是否有界、是否允许 `null`、出队顺序上差异明显，不能只按“队列就是 FIFO”理解。

**核心对比**

| 队列 | 线程安全 | 是否有界 | 是否允许 null | 出队顺序 |
|---|---|---|---|---|
| `PriorityQueue` | 否 | 无界 | 否 | 优先级 |
| `LinkedBlockingQueue` | 是 | 可选有界 | 否 | FIFO |
| `ConcurrentLinkedQueue` | 是 | 无界 | 否 | FIFO |

**关键说明**

- `PriorityQueue` 基于二叉堆，默认最小堆，出队的是优先级最高（默认最小值）的元素，不遵循 FIFO。
- `PriorityQueue` 的入队 `offer`/`add` 与出队 `poll`/`remove` 需要维护堆性质，时间复杂度为 `O(log n)`；`peek` 为 `O(1)`。
- `PriorityQueue` 不允许 `null`，插入 `null` 会抛出 `NullPointerException`。
- `LinkedBlockingQueue` 是阻塞队列，内部通过锁保证线程安全。
- `LinkedBlockingQueue` 构造时不指定容量，默认容量为 `Integer.MAX_VALUE`，实践中可视为无界；指定容量后即为有界。
- `LinkedBlockingQueue` 不允许 `null`，插入 `null` 会抛出 `NullPointerException`。
- `ConcurrentLinkedQueue` 是线程安全的无界并发队列，遵循 FIFO，不允许 `null`。

**易错点**

- “无界”不等于绝对不会失败。`PriorityQueue` 和默认容量的 `LinkedBlockingQueue` 只是不预设固定容量上限，仍可能因内存不足等原因失败。
- `PriorityQueue` 非线程安全；多线程环境下不能直接并发使用。
- `LinkedBlockingQueue` 是线程安全的；不要与 `PriorityQueue` 一并归为“线程不安全”。

## Java 常见集合实现类对比

**结论**

Java 集合实现类的差异主要体现在底层数据结构、顺序性和线程安全性上。选择集合时应按这三项判断，而不是只记类名。

**核心对比**

| 集合 | 底层结构 | 顺序性 | 线程安全 |
|---|---|---|---|
| `ArrayList` | 数组 | 按索引 | 否 |
| `LinkedList` | 双向链表 | 按插入 | 否 |
| `HashSet` | 哈希表 | 不保证 | 否 |
| `LinkedHashSet` | 哈希表 + 双向链表 | 插入顺序 | 否 |
| `TreeMap` | 红黑树 | 按键排序 | 否 |
| `HashMap` | 哈希表 | 不保证 | 否 |
| `Vector` | 数组 | 按索引 | 是 |
| `Hashtable` | 哈希表 | 不保证 | 是 |

**关键说明**

- `ArrayList` 基于数组，支持随机访问，容量不足时自动扩容。
- `LinkedList` 基于双向链表，节点持有前驱和后继引用，按索引访问需要遍历。
- `HashSet` 基于哈希表，不保证迭代顺序；`LinkedHashSet` 额外用双向链表维护插入顺序。
- `TreeMap` 基于红黑树，按键的自然顺序或指定 `Comparator` 排序。
- `HashMap` 基于哈希表，不保证键值对顺序。
- `Vector` 是线程安全的动态数组，方法使用 `synchronized` 同步。
- `Hashtable` 是线程安全的映射，方法使用 `synchronized` 同步，不是线程不安全的。

**易错点**

- `LinkedHashSet` 的“有序”指迭代顺序可预测，默认是插入顺序，不是按元素大小排序；按大小排序要用 `TreeSet`。
- `Vector`、`Hashtable` 虽线程安全，但并发场景下更常用 `ConcurrentHashMap`、`CopyOnWriteArrayList` 等替代。
- `HashMap` 与 `Hashtable` 都不保证顺序，区别之一是 `Hashtable` 线程安全且不允许 `null` 键值，而 `HashMap` 允许一个 `null` 键和多个 `null` 值。