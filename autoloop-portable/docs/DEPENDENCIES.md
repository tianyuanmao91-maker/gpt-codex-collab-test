# 环境依赖清单

部署时动态检测：Windows PowerShell、Node.js/npm、Git、GitHub CLI、Codex CLI、目标 Git 仓库、GitHub API、代理和用户项目目录。

路径优先来自 `Get-Command`/`where.exe` 或配置；不依赖当前电脑绝对路径。认证仅检测状态，不导出凭据。日志/state 位于部署包目录下。
