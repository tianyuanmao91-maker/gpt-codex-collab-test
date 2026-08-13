# Codex AutoLoop MVP

最小本地 doorbell：轮询 GitHub Issue，按 `project` 路由配置发现 `READY` 任务，并在项目目录唤醒 Codex。Branch、修改、测试、Commit、Push 和 Draft PR 全部由 Codex 根据 Issue 自行完成。

## Issue 标记

```markdown
<!-- AUTOLOOP
project: collab-test
state: READY
-->
```

复制 `config.example.json` 为 `config.json`，填入真实本地项目路径。使用 `GH_TOKEN` 或已认证的 `gh` 提供 GitHub 访问；凭据不写入配置、日志或仓库。

## Codex 工作模式

运行 `codex-work-mode.ps1` 会在需要时启动官方 Codex App，并以单实例方式启动 AutoLoop watcher。它不注册开机或登录自启。
