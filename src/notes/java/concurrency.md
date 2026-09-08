---
title: 线程与并发
description: volatile、互斥锁和线程启动的常见考点。
date: 2026-09-08
category: [Java]
tag: [线程, 并发, 锁]
order: 3
---

## volatile 不保证复合操作的原子性

**结论**：`volatile` 提供可见性及相关的有序性约束，但 `count++` 仍包含读取、加一、写回多个步骤。多个线程可能读取到同一个旧值，造成更新丢失。

**易错点**：不能因为变量声明为 `volatile`，就认为它上的所有操作都是线程安全的。独立计数可使用 `AtomicInteger.incrementAndGet()`；多个字段间的一致性通常需要更完整的同步设计。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger counter = new AtomicInteger();
        Runnable task = () -> {
            for (int index = 0; index < 1000; index++) {
                counter.incrementAndGet();
            }
        };
        Thread first = new Thread(task);
        Thread second = new Thread(task);
        first.start();
        second.start();
        first.join();
        second.join();
        System.out.println(counter.get());
    }
}
```

**预期结果**：等待两个线程结束后，输出 `2000`。

## synchronized 锁定的对象

**结论**：实例同步方法锁定当前实例；静态同步方法锁定对应的 `Class` 对象。只有竞争同一把锁的执行路径才互斥。

**易错点**：两个不同实例上的实例同步方法不一定互斥。同步块退出时会释放监视器，包括由于异常退出的情况。

## start 与 run

**结论**：调用 `start()` 启动新线程，由新线程执行 `run()`；直接调用 `run()` 是当前线程中的普通方法调用。

**易错点**：同一个 `Thread` 对象不能重复 `start()`，即使它已经运行结束。