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