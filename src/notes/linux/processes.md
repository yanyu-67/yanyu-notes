---
title: 进程与服务
description: 进程查看、信号及 systemd 服务排查。
date: 2026-09-08
category: [Linux]
tag: [进程, systemd]
order: 3
---

## 程序与进程

**结论**：程序是静态的代码及数据，进程是程序的一次运行实例，有自己的进程标识及资源。同一个程序可以有多个进程实例。

```bash
ps -ef
ps -p $$ -o pid,ppid,stat,comm
```

**预期结果**：第二条命令查看当前 Shell 进程，`$$` 在 Shell 中展开为其进程号。

## SIGTERM 与 SIGKILL

**结论**：`kill` 默认发送 SIGTERM，目标进程可以处理该信号并清理资源；SIGKILL 不能被目标进程捕获、阻塞或忽略。

**易错点**：`kill` 的含义是发送信号，不是任何时候都立刻终止。`kill -9` 应作为必要时的最后手段，避免跳过清理流程。

## systemd 的启动与开机启用

**结论**：`start` 启动当前服务，`enable` 配置相应的开机或目标依赖关系，单独 `enable` 不代表立即启动。

```bash
systemctl --failed
journalctl -b -p warning --no-pager
```

**实践前提**：系统使用 systemd，且当前用户有权限查看相应日志。记录服务名称、首次报错时间及上下文，不要只摘取最后一行错误。