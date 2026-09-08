---
title: 索引与执行计划
description: 联合索引、覆盖索引和 EXPLAIN 的基础判断。
date: 2026-09-08
category: [MySQL]
tag: [索引, 性能]
order: 2
---

## 联合索引的最左前缀

**结论**：索引 `(department_id, created_at)` 按第一列再按第二列组织顺序，适合从 `department_id` 开始的检索条件。

**易错点**：SQL 中条件书写顺序不是索引列顺序。仅按第二列过滤通常无法像按最左前缀那样定位，但优化器可能使用索引扫描或特定优化，不能绝对断言“一定不走索引”。

## 覆盖索引与回表

**结论**：InnoDB 的二级索引记录包含主键值。查询需要的列都能从所用索引取得时，可避免再根据主键访问聚簇索引，这称为覆盖索引。

**易错点**：`SELECT *` 更可能需要索引外的数据。索引也占空间并增加写入维护成本，不是越多越好。

## 实践：比较执行计划

在独立练习数据库中执行以下语句，不要在生产库创建练习表：

```sql
CREATE TEMPORARY TABLE index_lab (
  id BIGINT PRIMARY KEY,
  department_id INT NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_department_created (department_id, created_at)
);
EXPLAIN SELECT id FROM index_lab WHERE department_id = 10;
EXPLAIN SELECT id FROM index_lab WHERE created_at >= '2026-01-01';
```

观察 `type`、`key`、`rows` 和 `Extra`。空表只适合熟悉输出格式，性能结论需要有代表性的数据量和分布。`EXPLAIN ANALYZE` 会实际执行查询，使用前确认代价。