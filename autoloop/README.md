# Codex AutoLoop MVP

最小本地 watcher：轮询 GitHub Issue，按 `project` 路由配置发现 `READY` 任务，记录 JSONL 状态。执行器、Git 与 Draft PR 适配器保持独立，默认不 Merge。

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
