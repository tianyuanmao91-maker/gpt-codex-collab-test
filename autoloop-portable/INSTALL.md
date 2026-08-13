# 安装

1. Clone 或复制本目录到新 Windows 电脑。
2. 在 PowerShell 中运行 `Set-ExecutionPolicy -Scope Process Bypass`。
3. 运行 `./deploy.ps1`，按提示填写仓库和项目目录。
4. 如未登录，按提示运行官方 `gh auth login` 和 Codex 官方登录流程。
5. 运行 `./verify.ps1` 做无写入验收。
6. 运行 `./start.ps1` 启动唯一 watcher。

部署脚本不会自动安装软件，也不会导入任何凭据。
