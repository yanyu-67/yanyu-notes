---
title: 语言基础与面向对象
description: Java 值传递、对象比较与多态的关键区别。
date: 2026-09-08
category: [Java]
tag: [基础, 面向对象]
order: 1
---

## Java 只有值传递

**结论**：调用方法时，实参的值被复制给形参。基本类型复制数值，对象类型复制引用值，不是复制整个对象。

**易错点**：方法可以通过复制的引用修改同一个对象，但重新给形参赋值不会改变调用者变量指向的对象。

```java
import java.util.ArrayList;
import java.util.List;

public class PassByValue {
    static void change(List<String> values) {
        values.add("Java");
        values = new ArrayList<>();
        values.add("MySQL");
    }

    public static void main(String[] args) {
        List<String> topics = new ArrayList<>();
        change(topics);
        System.out.println(topics);
    }
}
```

**预期结果**：输出 `[Java]`。保存为 `PassByValue.java` 后可用 `javac PassByValue.java` 和 `java PassByValue` 验证。

## == 与 equals

**结论**：对引用类型，`==` 比较是否指向同一个对象；`equals()` 的语义由类决定。`Object` 默认按身份比较，`String` 重写后按字符序列比较。

**易错点**：不能把所有类的 `equals()` 都理解成“比较内容”。重写 `equals()` 时通常也必须重写 `hashCode()`，保证相等对象有相同哈希值。

## 重载与重写

**结论**：重载是同名方法的参数列表不同，主要在编译期选择；重写是子类提供父类实例方法的实现，运行时根据实际对象进行动态分派。

**易错点**：仅改变返回类型不能构成重载。静态方法属于隐藏，不属于实例方法的多态重写。

## final 关键字与不可变性

**结论**：`final` 修饰类表示该类不可被继承；`String` 和 `StringBuffer` 均为 final 类，`HashMap` 和 `Hashtable` 则不是。

**原因**：
- `final class` 禁止派生，旨在保护类的核心行为不被篡改，多见于不可变类或线程安全类。
- `String` 的 final 设计保障了不可变性，使字符串常量池、哈希码缓存和类加载安全成为可能。
- `StringBuffer` 的 final 设计防止子类覆盖其同步方法，确保线程安全语义不被破坏。

**典型 final 类**：
- `String`、`StringBuilder`、`StringBuffer`
- 基本类型包装类：`Integer`、`Long`、`Double` 等
- 枚举类型（`enum`）隐式为 final

**易错点**：
- final 类 ≠ 不可变对象：`StringBuffer` 是 final 类但其对象内容可变（通过 `append` 等方法）；`String` 则是 final + 不可变。
- 线程安全类不一定是 final 类（如 `Hashtable`、`Vector`），final 类也不一定线程安全（`Integer` 虽不可变但无同步需求）。
- 判断 final 类应以源码声明为准，不能凭“常见用法”或“是否线程安全”推断。