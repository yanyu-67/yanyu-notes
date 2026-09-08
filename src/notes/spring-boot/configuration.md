---
title: 配置与运行环境
description: 外部化配置、Profile 与类型安全的配置绑定。
date: 2026-09-08
category: [Spring Boot]
tag: [配置, Profile]
order: 2
---

## 配置存在多个来源

**结论**：应用可以从配置文件、环境变量、系统属性和命令行参数等来源读取属性，不同来源有明确的优先级。默认启用命令行属性时，命令行参数可覆盖配置文件中的同名属性。

```yaml
server:
  port: 8080
spring:
  application:
    name: notes-service
```

**实践**：把配置放进已有项目的 `application.yml`，用 `java -jar app.jar --server.port=9090` 启动，观察日志中的实际端口。此例需要一个已打包的 Web 应用，不是在知识库中执行。

**易错点**：不能只检查一个配置文件就断定最终值。还要检查激活环境、外部文件和启动参数；完整优先级随具体版本查官方说明。

## Profile 用来选择环境配置

**结论**：`application-dev.yml` 可以保存开发环境的差异项，通过 `--spring.profiles.active=dev` 激活。一个应用可以同时激活多个 Profile。

**易错点**：文件名中包含 dev 不会自动激活该环境；Profile 也不是密钥保护机制。不要把真实密码写入仓库，示例中只保留配置项名称和安全的非敏感值。

## @ConfigurationProperties 与 @Value

**结论**：`@ConfigurationProperties` 适合按前缀绑定一组结构化、类型明确的配置；`@Value` 适合注入少量单值或表达式。

**易错点**：只写绑定注解并不保证类已注册为 Bean，应结合配置属性扫描或显式启用方式。需要校验配置时还应配置相应校验依赖和注解。