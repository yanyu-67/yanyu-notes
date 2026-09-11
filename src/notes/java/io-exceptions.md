---
title: IO 与异常处理
description: 字节和字符流、受检异常及资源关闭。
date: 2026-09-08
category: [Java]
tag: [IO, 异常]
order: 5
---

## 字节流与字符流

**结论**：`InputStream` 和 `OutputStream` 处理字节；`Reader` 和 `Writer` 处理字符。字节与字符转换需要编码，文本读取应明确字符集。

**易错点**：字符不是固定占一个字节。图片、压缩包等二进制文件不能用字符流随意转换，否则可能损坏数据。

## 受检异常与非受检异常

**结论**：受检异常需要捕获或在方法签名中声明。`RuntimeException` 及其子类和 `Error` 及其子类不受此编译期检查约束。

**易错点**：`throws` 声明可能抛出的异常，并不等于处理异常；捕获后什么也不做可能隐藏真实故障。

## try-with-resources 自动关闭资源

**结论**：实现 `AutoCloseable` 的资源可交给 try-with-resources 管理，多资源按声明的反向顺序关闭。

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class ReadNote {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("note.txt");
        try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            System.out.println(reader.readLine());
        }
    }
}
```

**实践前提**：在运行目录准备 UTF-8 编码的 `note.txt`。如果文件不存在会抛出异常，而不是自动创建文件。

**易错点**：不要在 `finally` 中随意 `return`，它可能覆盖原有返回值或异常。


## Integer.parseInt 与 NumberFormatException

**结论**：`Integer.parseInt(String s)` 要求字符串必须为合法整数格式，否则抛出 `NumberFormatException`。

**合法格式规则**：
- 允许包含数字 `0` ~ `9`；
- 允许前导正负号 `+` 或 `-`；
- 不允许包含字母、小数点、空格、下划线等其他字符；
- 数值必须在 `int` 范围内（-2^31 ~ 2^31-1）。

**常见抛出场景**：
- 字符串包含非数字字符，如 `"123a"`、`"12.3"`；
- 字符串为空或仅有空格，如 `""`、`" "`；
- 数值溢出，如 `"2147483648"`（超过 `Integer.MAX_VALUE`）。

**易错点**：
- `NumberFormatException` 是 `IllegalArgumentException` 的子类，在方法参数不合法时抛出。
- 传入 `null` 会抛出 `NullPointerException`，而非 `NumberFormatException`——两者需区分。
- 诊断异常时优先选最具体的子类，而非泛化的父类（如 `RuntimeException`）。

## finally、throw、throws 与 final 辨析

**结论**：`finally` 保证代码执行；`throws` 声明方法可能抛出的检查型异常；`throw` 主动抛出异常对象；`final` 与异常无关，用于限制类、方法或变量。

**各关键字定义**：
- **finally**：`try-catch-finally` 结构中的可选块，无论是否捕获异常（或异常未被捕获）均会执行，常用于释放资源（关闭流、连接等）。若 `System.exit()` 或 JVM 崩溃则不执行。
- **throws**：写在方法签名尾部，声明该方法可能抛出一种或多种检查型异常（非运行时异常）。调用方必须处理或继续向上声明。
- **throw**：方法体内语句，后跟异常对象实例，用于主动触发异常（检查型或非检查型均可）。
- **final**：关键字，修饰类时类不可被继承；修饰方法时方法不可被子类重写；修饰变量时变量引用不可变（基本类型值不变，引用类型不可指向新对象，但对象内容可变）。

**易错点**：
- `throws` 声明异常时，方法内部不一定会抛出该异常，仅作声明；`throw` 则是确定抛出。
- 不要把 `final` 与 `finally` 或 `finalize()` 混淆——三者功能完全不同，`finalize()` 是 `Object` 的废弃方法，用于对象回收前回调，不推荐使用。
- `finally` 块中若抛出异常或执行 `return`，会覆盖 `try/catch` 中的异常或返回值，应避免此类写法。

## 字节流与字符流的区分

**结论**：字节流继承自 `InputStream`/`OutputStream`，处理原始字节；字符流继承自 `Reader`/`Writer`，处理字符（Unicode）。`InputStreamReader` 是转换流，属于字符流；`PrintStream` 和 `FileInputStream` 为字节流。

**典型字节流类**：
- `FileInputStream`、`FileOutputStream`：文件字节读写。
- `BufferedInputStream`、`BufferedOutputStream`：带缓冲的字节流。
- `PrintStream`：字节输出流，提供 `print`/`println` 方法，`System.out` 是其典型实例。
- `ObjectInputStream`、`ObjectOutputStream`：对象序列化字节流。

**典型字符流类**：
- `FileReader`、`FileWriter`：文件字符读写（便捷类，底层实为 `InputStreamReader`/`OutputStreamWriter`）。
- `BufferedReader`、`BufferedWriter`：带缓冲的字符流，`BufferedReader.readLine()` 常用。
- `CharArrayReader`、`CharArrayWriter`：操作 `char[]` 的字符流。
- `InputStreamReader`、`OutputStreamWriter`：字节与字符间的转换桥梁，属于字符流。

**易错点**：
- 判断依据不是“是否读写文件”或“是否包含 Stream 字样”，而是**继承体系**：`InputStream`/`OutputStream` 子类为字节流，`Reader`/`Writer` 子类为字符流。
- `PrintStream` 虽提供字符友好的打印方法，但其继承自 `FilterOutputStream`，本质是字节流，注意与 `PrintWriter`（字符流）区分。
- `System.out` 是 `PrintStream`（字节流），`System.in` 是 `InputStream`（字节流），`System.err` 也是 `PrintStream`（字节流）。

## 异常处理最佳实践

**结论**：异常处理应遵循以下原则：自定义业务异常优先继承 `RuntimeException`；异常转换时需保留原始异常链；`finally` 块中避免使用 `return`；异常仅用于异常情况，不作为流程控制。

**最佳实践详解**：

1. **自定义异常优先继承 `RuntimeException`**
   - 现代框架（如 Spring）更倾向非受检异常，减少代码侵入性，调用方无需强制处理。
   - 若需调用方强制处理，仍可选择继承 `Exception`（受检异常）。

2. **异常链保留**
   - 捕获异常后抛出新异常时，务必传入原始异常作为 `cause`：
     ```java
     try {
         // 业务操作
     } catch (IOException e) {
         throw new BusinessException("业务处理失败", e);
     }
     ```
   - 保留堆栈链便于快速定位根因。

3. **`finally` 中避免 `return`**
   - `finally` 中的 `return` 会覆盖 `try`/`catch` 中的返回值，甚至抑制异常传播（异常被“吞掉”）。
   - 若 `finally` 中必须执行清理逻辑，不应包含 `return`。

4. **异常不是流程控制**
   - 异常创建需要收集堆栈信息，性能开销大。
   - 用异常做条件分支使代码难以理解和维护，应使用 `if-else` 等正常控制结构。

**易错点**：
- 不要在 `finally` 块中使用 `return`，这是常见陷阱。
- 异常链丢失会导致排查问题困难，务必在抛出新异常时传入原异常。
- 避免捕获异常后什么都不做（空 `catch` 块），至少记录日志。

## Socket 编程服务端与客户端操作

**结论**：`getInputStream()` 是 `Socket` 类的通用方法，在服务端和客户端均可使用，不属于服务端专用操作。服务端核心操作包括 `bind()`、`accept()`、`close()`；客户端核心操作包括 `connect()`、`getInputStream()`、`getOutputStream()`、`close()`。

**服务端（ServerSocket）典型操作**：
- `bind(SocketAddress endpoint)`：绑定端口和地址。
- `accept()`：阻塞等待客户端连接，返回 `Socket` 对象。
- `close()`：关闭 `ServerSocket`，释放端口资源。

**客户端（Socket）典型操作**：
- `connect(SocketAddress endpoint)`：连接指定服务端（构造时可指定）。
- `getInputStream()`：获取输入流，读取服务端发送的数据。
- `getOutputStream()`：获取输出流，向服务端发送数据。
- `close()`：关闭连接。

**服务端与客户端共享操作**：
- `getInputStream()` / `getOutputStream()`：连接建立后，双方均通过 `Socket` 获取流进行数据交换。
- `close()`：双方均可主动关闭连接。

**服务端完整流程示例**：
```java
// 服务端
ServerSocket server = new ServerSocket(8080);   // 绑定
while (true) {
    Socket socket = server.accept();            // 接受连接
    InputStream in = socket.getInputStream();   // 读取数据
    OutputStream out = socket.getOutputStream(); // 发送数据
    socket.close();                             // 关闭
}
```
```java
// 客户端
Socket socket = new Socket("localhost", 8080);  // 连接
OutputStream out = socket.getOutputStream();    // 发送数据
InputStream in = socket.getInputStream();       // 读取响应
socket.close();                                 // 关闭
```

**易错点**：
- `accept()` 只存在于 `ServerSocket`，是服务端独有操作。
- `getInputStream()` 和 `getOutputStream()` 存在于 `Socket`，服务端和客户端均可用。
- `bind()` 是 `ServerSocket` 的常用操作，但 `Socket` 也提供 `bind()` 方法（较少使用），本题语境下关注的是服务端的典型操作。


## 文本文件、二进制文件与 File 类

**结论**：Java 中所有文件底层都是字节序列，文本文件和二进制文件都可以当作二进制（用字节流）处理。文本与二进制的区别在内容编码方式，不在后缀名。

**要点**：

- 后缀名不能决定文件类型：`.java`、`.xml` 是文本文件，`.txt` 也可能存二进制数据。文本文件指内容按某种字符编码存储、可被文本编辑器正常解读的文件。
- File 类只表示文件或目录的路径名，用于获取属性、创建、删除、重命名等，不负责读写。读写必须使用 IO 流类。
- 字节流（FileInputStream / FileOutputStream）可处理所有类型文件；字符流在字节流之上按字符编码转换，只适合文本。

**文件末尾的判断**：

- 字节流 `read()` 返回 -1 表示到达末尾。
- `BufferedReader.readLine()` 返回 null 表示到达末尾。
- 以上都不抛 EOFException。EOFException 主要出现在 DataInputStream 等按数据类型读取、但数据提前结束的场景。

**易错点**：认为 File 类能读写文件；认为后缀名决定文本或二进制；认为读到末尾必然抛 EOFException。