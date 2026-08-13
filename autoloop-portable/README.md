# AutoLoop Portable for Windows

可迁移部署包：watcher 从 GitHub 读取 READY Issue，将完整 Issue 快照交给 Codex，由 Codex 完成 Branch、修改、Commit、Push 和 Draft PR。

本目录不包含 Token、keyring、Credential Manager、Cookie、日志或本机配置。首次使用运行 `deploy.ps1`，完成 GitHub/Codex 官方登录后运行 `verify.ps1` 和 `start.ps1`。
