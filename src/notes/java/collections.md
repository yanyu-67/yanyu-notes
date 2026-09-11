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