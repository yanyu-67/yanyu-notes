---
title: 自动化测试基础
description: 测试分层、稳定断言与最小可运行测试。
date: 2026-09-08
category: [软件测试]
tag: [自动化, 单元测试]
order: 4
---

## 自动化适合重复验证稳定规则

**结论**：高频回归、规则明确且结果可判断的场景适合自动化。探索性测试和体验评估仍需要人工判断。

**易错点**：自动化不是把所有操作录制一遍。测试需要明确断言，否则“脚本跑完了”不代表行为正确。

## 单元、集成与端到端

**结论**：单元测试关注小范围逻辑，集成测试关注模块协作，端到端测试关注完整用户路径。越接近完整环境，通常越慢、故障来源越多。

**易错点**：不能只靠大量 UI 用例覆盖底层规则，也不能只用单元测试替代关键业务路径验证。

## 实践：Node.js 内置测试

保存以下内容为 `age.test.mjs`，在 Node.js 22 中运行 `node --test age.test.mjs`，无需安装测试库。

```js
import test from "node:test";
import assert from "node:assert/strict";

function isEligible(age) {
  return Number.isInteger(age) && age >= 18 && age <= 60;
}

test("accepts inclusive boundaries", () => {
  assert.equal(isEligible(18), true);
  assert.equal(isEligible(60), true);
});

test("rejects invalid ages", () => {
  for (const age of [17, 61, 18.5, "18", null]) {
    assert.equal(isEligible(age), false);
  }
});
```

**预期结果**：两个测试通过。可把边界判断临时改错，确认测试会失败，再恢复代码；这能检验断言是否真的覆盖了规则。

## 不稳定测试的常见来源

共享可变数据、依赖执行顺序、真实外部网络和固定延时都可能导致偶发失败。优先等待明确的状态条件，并隔离测试数据，而不是不断增加等待秒数。