---
title: Web 接口与参数校验
description: REST 控制器、请求参数绑定、校验与异常处理。
date: 2026-09-08
category: [Spring Boot]
tag: [Spring MVC, HTTP, 参数校验]
order: 3
---

## @RestController 与 @Controller

**结论**：`@RestController` 组合了控制器标记和响应体语义，其方法返回值通常经消息转换器写入 HTTP 响应体；普通 `@Controller` 返回的字符串常用于解析视图名称。

```java
package com.example.notes;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello, Spring Boot");
    }
}
```

**实践前提**：放入已有 Spring Boot 3.x Web 项目、启动类扫描范围内，项目包含 Web starter 和默认 JSON 转换支持。访问 `/hello`，预期收到含 message 字段的 JSON。

## 三种常见参数来源

| 注解 | 常见用途 |
| --- | --- |
| @PathVariable | 获取路径中的变量，例如资源 ID |
| @RequestParam | 获取查询参数或表单参数 |
| @RequestBody | 通过消息转换器读取请求体，例如 JSON |

**易错点**：JSON 请求体字段不是查询参数，不能仅靠 `@RequestParam` 按同样方式读取。Content-Type、方法签名和实际请求格式需要一致。

## 校验与统一异常处理

**结论**：Spring Boot 3.x 使用 Jakarta 命名空间的校验注解。需要相应校验依赖，并在支持的绑定位置使用 `@Valid` 等触发校验。

**易错点**：Java 字段加了约束不代表所有手工创建对象的路径都会自动校验。参数校验也不能代替身份认证、授权和业务规则检查。

使用 `@RestControllerAdvice` 与 `@ExceptionHandler` 可以统一响应错误，但应区分客户端输入错误与服务端故障，不把所有异常都返回 HTTP 200，也不向客户端泄露堆栈或数据库细节。