---
title: 基础与自动配置
description: Spring 与 Spring Boot 的关系、组件扫描及自动配置条件。
date: 2026-09-08
category: [Spring Boot]
tag: [基础, 自动配置, 依赖注入]
order: 1
---

## Spring 与 Spring Boot 的关系

**结论**：Spring 提供依赖注入、事务等基础能力；Spring Boot 基于 Spring，通过自动配置、依赖管理和运行支持减少应用搭建工作。

**易错点**：Spring Boot 不是另一套替代 Spring 容器的框架，也不意味着完全不需要配置。

## @SpringBootApplication 的作用

**结论**：它组合了 Spring Boot 配置类标记、自动配置启用和组件扫描等能力。默认组件扫描从启动类所在包开始，覆盖其子包。

**易错点**：启动类放得过深可能扫描不到其他包的组件。实体扫描、Repository 扫描与普通组件扫描不能简单视为完全相同的机制。

## 自动配置是有条件的

**结论**：自动配置根据类路径、配置属性和已有 Bean 等条件决定是否生效。例如某些配置在用户尚未提供对应 Bean 时才创建默认 Bean。

**易错点**：引入 starter 不代表所有相关功能无条件开启，也不代表所有默认 Bean 都能被同名 Bean 安全覆盖。排查时应查看具体自动配置类和条件报告。

## 构造器注入

**结论**：构造器注入显式表达必要依赖，便于测试及使用 final 字段。Spring 管理的组件只有一个构造器时，通常无需再加 `@Autowired`。

**易错点**：自己通过 `new` 创建的普通对象不会因此自动获得容器注入。出现循环依赖时应先检查职责设计，不把开启循环引用作为首选修复。

## 实践：查看条件报告

对已经打包好的 Spring Boot 应用，可以运行 `java -jar app.jar --debug` 查看自动配置条件信息，实际 JAR 名称按项目替换。记录 Spring Boot 版本、依赖、匹配条件和未匹配原因，日志中不要保留密钥。

## Spring 核心特性与常见误区

**结论**：Spring 提供 IoC/DI、AOP 基础设施、声明式事务管理等核心能力，但**不内置日志系统**。日志功能需集成第三方日志框架（如 Log4j、SLF4J、Logback），并通过 Spring AOP 或直接调用的方式实现日志记录。

**Spring 核心特性**：
- **依赖注入（DI）**：通过 IoC 容器管理对象创建和依赖关系，降低耦合度。
- **AOP（面向切面编程）**：提供切面、通知、切点等基础设施，用于横切关注点（事务、日志、安全、性能监控等）。
- **声明式事务管理**：通过 `@Transactional` 或 XML 配置管理事务边界，无需手动编码。
- **Spring MVC**：Web 层框架，简化 RESTful API 和 Web 应用开发。
- **数据访问抽象**：统一的数据访问异常体系，简化 JDBC、ORM 集成。

**常见误区**：
- Spring 提供 AOP 机制，但**不提供内置日志实现**。日志记录是应用层的 AOP 实践，需配合日志框架使用。
- Spring Boot 默认使用 Logback 作为日志实现，但这属于 Spring Boot 的自动配置，而非 Spring 框架本身的能力。
- Spring 本身不包含日志功能，`commons-logging` 是门面（接口），具体实现由 `log4j`、`logback` 等提供。

**AOP 日志示例**（需依赖 SLF4J/Logback）：
```java
@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.example.service.*.*(..))")
    public void logMethodCall(JoinPoint jp) {
        log.info("调用方法: " + jp.getSignature().getName());
    }
}
```

## Spring AOP 通知类型与执行时机

**结论**

Spring AOP 中不同通知注解的执行时机不同：`@Before` 在目标方法前执行；`@Around` 可控制目标方法是否执行；`@AfterReturning` 只在正常返回时执行；`@After` 无论正常返回还是异常都会执行；`@AfterThrowing` 只在抛出异常时执行。

**原因**

- `@Before`：目标方法执行前运行。
- `@Around`：通过 `ProceedingJoinPoint.proceed()` 决定是否调用目标方法，可以修改参数、返回值，是控制力最强的通知类型。
- `@AfterReturning`：目标方法正常返回后执行，抛出异常时不执行 [citation:5][citation:8]。
- `@AfterThrowing`：目标方法抛出异常后执行，与 `@AfterReturning` 互斥。
- `@After`：类似 `finally` 块，无论正常返回还是异常都会执行。

**易错点**

- `@AfterReturning` 与 `@After` 不同：前者只在正常返回时执行，后者总会执行。
- `@Around` 必须显式调用 `proceed()`，否则目标方法不会被执行。
- 若使用 `@Around` 且不调用 `proceed()`，其他通知（如 `@Before`、`@After`）可能也不会按预期触发，因为目标方法未被实际调用。