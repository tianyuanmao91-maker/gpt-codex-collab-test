# 当前环境依赖清单（脱敏）

本清单只记录版本、工具来源和依赖关系，不包含 Token、Cookie、keyring 或凭据内容。

- Windows：Windows PowerShell 主机；部署脚本使用标准 PowerShell cmdlet。
- Node.js/npm：通过 `Get-Command node` / `Get-Command npm` 动态探测。
- Git：通过 `Get-Command git` 动态探测；Git 元数据写入需要当前用户对目标仓库有权限。
- GitHub CLI：通过 `Get-Command gh` 动态探测；认证只运行 `gh auth status`，未导出凭据。
- Codex CLI：通过 `Get-Command codex` 动态探测；可在 `config.local.json` 中显式填写可执行文件。
- AutoLoop：部署包内 `autoloop/`，日志和 state 位于包目录，不依赖当前电脑绝对路径。
- watcher：`start.ps1` 启动 `autoloop/src/runner.js --watch`，PID 写入包内 `state/watcher.pid`。
- supervisor：迁移包不依赖本机 supervisor；由 `start.ps1` 提供最小单实例启动入口。
- 项目路由：`config.local.json` 的 `repository` 和 `projects.<name>.localPath`。
- 代理：优先读取 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` 和 Windows 系统代理；不修改全局代理。
- GitHub 配置：使用目标电脑自己的 gh 配置和官方登录流程；不复制当前电脑 keyring。
- Codex 认证：使用目标电脑自己的官方 Codex 登录状态；不复制当前电脑凭据。
