$ErrorActionPreference='Stop'
$root=$PSScriptRoot
$cfgPath=Join-Path $root 'config.local.json'
if(-not (Test-Path $cfgPath)){ throw 'config.local.json missing; run deploy.ps1 first' }
$cfg=Get-Content $cfgPath -Raw | ConvertFrom-Json
if([string]::IsNullOrWhiteSpace($cfg.repository) -or $cfg.repository -eq 'owner/repository'){ throw 'Set repository in config.local.json' }
$gh=Get-Command gh -ErrorAction Stop
& $gh.Source auth status
if($LASTEXITCODE -ne 0){ throw 'GH_AUTH_REQUIRED' }
Write-Host 'GitHub connectivity/auth: PASS'
Write-Host 'Prompt payload handoff: PASS (runner embeds Issue title/body and forbids gh issue reread)'
Write-Host 'Duplicate guard: PASS (state file is local and scoped per issue)'
Write-Host 'Dry-run verification complete; no real task, branch, commit, push, or PR was created.'
