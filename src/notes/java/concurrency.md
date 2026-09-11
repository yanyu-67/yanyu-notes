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

## 监视器（Monitor）与同步机制

**结论**：Java 通过监视器（Monitor）机制实现线程同步。每个对象都有一个关联的内部锁（监视器），通过 `synchronized` 关键字获取锁，保证同一时刻最多只有一个线程执行受保护的代码块，从而实现互斥访问。

**监视器核心特性**：
- **互斥性**：同一时刻只有一个线程能持有对象的监视器锁，其他线程试图进入同步块会被阻塞。
- **可见性**：线程释放锁前对共享变量的修改会刷新到主存，后续获取该锁的线程能读到最新值。
- **协作能力**：`Object` 类的 `wait()`、`notify()`、`notifyAll()` 方法基于监视器实现线程间的等待与唤醒（必须在同步块/方法内调用）。

**`synchronized` 使用方式**：
- 修饰实例方法：锁为当前对象（`this`）。
- 修饰静态方法：锁为当前类的 Class 对象（`Class<T>`）。
- 修饰代码块：锁为括号中指定的对象。

**易错点**：
- `synchronized` 是**可重入锁**：同一线程可多次获取同一对象的锁，不会死锁。
- `wait()` 会释放锁并进入等待状态，`sleep()` 不释放锁——两者不要混淆。
- Java 6 后对 `synchronized` 进行了优化（偏向锁、轻量级锁、重量级锁的升级），但在编程层面使用方式不变。

## Java 线程基础与双重检查锁定

**结论**：线程内部可以创建新线程并并行执行；实现 Runnable 是创建线程的方式之一；线程池可复用线程、降低创建销毁开销。双重检查锁定若不加 volatile，不能保证线程绝对安全。

**线程创建方式**：实现 Runnable、继承 Thread、实现 Callable 配合 FutureTask、通过线程池提交任务。实现 Runnable 更常用，因为不占用继承、便于组合。

**线程池的作用**：复用已创建的线程，避免频繁创建与销毁，适合大量短期任务，降低系统开销。

**双重检查锁定（double-check）的问题**：

- 单例的双重检查写法涉及“检查—加锁—再检查”。
- 若实例引用不加 volatile，指令重排序可能让引用先指向对象、构造尚未完成，其他线程可能读到半初始化对象。
- 加 volatile 后禁止相关重排序并保证可见性，双重检查才可靠。因此“双重检查绝对安全”的说法不成立。

**易错点**：把线程池只当性能优化而忽略其参数与队列对稳定性的影响；把 HashMap 当线程安全类使用。HashMap 的线程安全问题见集合专题。