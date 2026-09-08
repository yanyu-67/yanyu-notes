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