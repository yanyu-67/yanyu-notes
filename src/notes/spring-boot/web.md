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

## Spring Security 认证流程

**结论**：Spring Security 认证由 `AuthenticationManager` 作为入口，委托给 `AuthenticationProvider` 执行具体认证逻辑，`UserDetailsService` 负责加载用户信息，`PasswordEncoder` 负责密码的加密与匹配。`SecurityContext` 中的认证信息默认通过 `ThreadLocal` 存储，且在请求结束后被清除，但若已存入 Session，则在会话有效期内持续存在。

**核心组件与职责**：

| 组件 | 职责 |
|------|------|
| `AuthenticationManager` | 认证入口（通常为 `ProviderManager`），管理一组 `AuthenticationProvider`，依次尝试认证。 |
| `AuthenticationProvider` | 执行具体认证逻辑，如根据用户名密码验证、JWT 令牌验证等。 |
| `UserDetailsService` | 根据用户名加载用户信息（`UserDetails` 对象），包含密码、权限、是否锁定等状态。 |
| `PasswordEncoder` | 加密明文密码（`encode`）和匹配明文与编码密码（`matches`），常见实现：`BCryptPasswordEncoder`、`SCryptPasswordEncoder`。 |
| `SecurityContext` | 存储当前认证用户信息（`Authentication` 对象），通过 `SecurityContextHolder` 获取（默认 `ThreadLocal` 策略）。 |
| `SecurityContextRepository` | 负责在请求间保存和加载 `SecurityContext`，默认实现会在认证后将上下文存入 `HttpSession`。 |

**认证流程简述**：
1. 用户提交凭证（如用户名密码）生成 `UsernamePasswordAuthenticationToken`（未认证）。
2. `AuthenticationManager` 接收该 token，遍历其持有的 `AuthenticationProvider`。
3. `AuthenticationProvider` 调用 `UserDetailsService.loadUserByUsername()` 获取 `UserDetails`，并用 `PasswordEncoder.matches()` 验证密码。
4. 认证成功后返回已认证的 `Authentication` 对象，存入 `SecurityContext`。
5. 若启用会话管理，`SecurityContext` 被保存到 `HttpSession`；请求结束后 `ThreadLocal` 被清除，但 Session 中的上下文持续存在直到会话失效。

**易错点**：
- `SecurityContext` 中的 `Authentication` 并非仅在单次请求有效。若通过 Session 持久化，后续请求可恢复，直到会话过期或显式退出。
- 默认 `SecurityContextHolder` 策略为 `MODE_THREADLOCAL`，在同一个请求的线程内可访问，跨线程需注意传递（如 `@Async` 场景需配置 `SecurityContextHolder.setStrategyName()`）。
- `UserDetailsService` 仅加载用户信息，不负责认证逻辑；认证由 `AuthenticationProvider` 完成，二者职责分离。

## HttpServletResponse 响应头设置

**结论**：`HttpServletResponse` 提供 `setHeader(String name, String value)` 和 `addHeader(String name, String value)` 两个标准方法，均接受两个 `String` 参数用于设置或添加自定义响应头。`setHeader` 覆盖已存在的头，`addHeader` 追加值。不存在接受 `HttpHeader` 或 `ServletHeader` 对象的重载方法。

**方法区别与用途**：

| 方法 | 行为 | 适用场景 |
|------|------|----------|
| `setHeader(name, value)` | 若头不存在则新增；若已存在则覆盖旧值（替换） | 单一值的响应头，如 `Content-Type`、`Cache-Control` |
| `addHeader(name, value)` | 若头不存在则新增；若已存在则追加（允许多值） | 多值头，如 `Set-Cookie`（多个 Cookie） |

**示例**：
```java
// 设置或覆盖响应头
response.setHeader("X-MyHeader", "34");

// 追加响应头（若已存在则追加为多个值）
response.addHeader("X-MyHeader", "34");
```

**其他常用方法**：
- `setIntHeader(String name, int value)` / `addIntHeader(...)`：整数值响应头。
- `setDateHeader(String name, long date)` / `addDateHeader(...)`：日期值响应头（毫秒时间戳）。
- `containsHeader(String name)`：检查头是否已存在。
- `getHeader(String name)`（Servlet 3.0+）：获取头值。

**易错点**：
- 响应头方法均接受两个 `String` 参数，不需要传入自定义对象。
- 若需设置相同头名为多个值时，使用 `addHeader`；使用 `setHeader` 会覆盖已有值，而非追加。
- 包名变更：Servlet 5.0+ 为 `jakarta.servlet.http.HttpServletResponse`，方法签名不变。