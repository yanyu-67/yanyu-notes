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