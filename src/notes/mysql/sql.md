---
title: SQL 查询基础
description: NULL、聚合与外连接中的常见误区。
date: 2026-09-08
category: [MySQL]
tag: [SQL, 查询]
order: 1
---

## NULL 不是零，也不是空字符串

**结论**：`NULL` 表示缺失或未知值。判断空值使用 `IS NULL` 或 `IS NOT NULL`，不能使用 `= NULL`。

```sql
SELECT NULL = NULL AS ordinary_comparison,
       NULL IS NULL AS null_test,
       NULL <=> NULL AS null_safe_comparison;
```

**预期结果**：依次为 `NULL`、`1`、`1`。`<=>` 是 MySQL 的 NULL 安全等于运算符。

**易错点**：`WHERE` 只保留条件结果为真的行；未知值不会被保留。`NOT IN` 的子查询若包含 NULL，可能使本想保留的非匹配行也被过滤。

## COUNT(*) 与 COUNT(列)

**结论**：`COUNT(*)` 统计行数，`COUNT(列)` 仅统计该列非 NULL 的行。

```sql
WITH sample AS (
  SELECT 1 AS score
  UNION ALL
  SELECT NULL
)
SELECT COUNT(*) AS total_rows, COUNT(score) AS scored_rows FROM sample;
```

**预期结果**：`total_rows` 为 2，`scored_rows` 为 1。示例需要 MySQL 8.0 的公用表表达式支持。

## LEFT JOIN 的过滤位置

**结论**：`ON` 决定右表哪些行参与匹配，`WHERE` 在连接之后过滤结果。

**易错点**：左连接后在 `WHERE` 写右表字段必须等于某值，会排除右表为空的未匹配行。如果需要保留左表所有行，通常应把右表匹配条件放在 `ON` 中，并核对业务语义。