# 迁移说明

## 可导出

- `autoloop-portable` 源码、脚本、模板和文档。

## 禁止导出

- GitHub/Codex Token、hosts.yml 敏感字段、keyring、Credential Manager、Cookie、私人配置和包含凭据的日志。

## 新电脑步骤

1. Clone/copy 包。
2. 运行 `deploy.ps1`。
3. 完成 GitHub 官方登录。
4. 完成 Codex 官方登录。
5. 选择项目目录。
6. 运行 `verify.ps1`。
7. 运行 `start.ps1`。
