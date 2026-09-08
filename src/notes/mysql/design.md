---
title: 数据类型与表设计
description: 主键、唯一约束、金额类型和规范化设计。
date: 2026-09-08
category: [MySQL]
tag: [表设计, 数据类型]
order: 4
---

## 主键与唯一约束

**结论**：一张表最多定义一个主键，它可以由多列组成，主键列不能为 NULL；可以定义多个唯一约束。

**易错点**：MySQL 中允许为空的唯一索引通常允许多条 NULL 记录，不能把它当成主键的完全替代品。

## 金额优先使用精确表示

**结论**：`DECIMAL` 是定点精确数值类型；`FLOAT` 和 `DOUBLE` 是近似数值类型。金额可采用合适精度的 `DECIMAL`，也可按业务使用以最小货币单位计量的整数。

```sql
CREATE TEMPORARY TABLE product_lab (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);
```

**适用范围**：MySQL 8.0.16 起执行 CHECK 约束。`DECIMAL(10, 2)` 总精度为 10，小数位为 2，不是整数位为 10。

## 规范化与冗余

**结论**：把同一事实尽量保存在明确的单一位置，可以减少更新异常。为性能引入冗余时，应同时定义数据同步和修复机制。

**易错点**：不能机械地宣称“越多表越规范”或“反规范化一定更快”。设计需要结合数据依赖关系、访问模式和一致性要求。