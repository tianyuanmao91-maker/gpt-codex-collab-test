$ErrorActionPreference='Stop'
$root=$PSScriptRoot
function Find-Cli([string]$name){$c=Get-Command $name -ErrorAction SilentlyContinue;if($c){return $c.Source};$null}
$node=Find-Cli 'node';$git=Find-Cli 'git';$gh=Find-Cli 'gh';$codex=Find-Cli 'codex'
Write-Host 'AutoLoop Portable dependency check'
foreach($x in @(@('Node.js',$node),@('Git',$git),@('GitHub CLI',$gh),@('Codex CLI',$codex))){if($x[1]){Write-Host "[PASS] $($x[0]): $($x[1])"}else{Write-Warning "[MISSING] $($x[0]): install or expose it on PATH; deployment will not install software."}}
if($node){& $node --version};if($git){& $git --version};if($gh){& $gh --version};if($codex){& $codex --version}
$local=Join-Path $root 'config.local.json'
if(-not (Test-Path $local)){
  $repository=Read-Host 'GitHub repository (owner/name)'
  $projectPath=Read-Host 'Local project path (existing Git repository)'
  $cfg=[ordered]@{repository=$repository;projects=[ordered]@{'collab-test'=[ordered]@{localPath=$projectPath}};codexCli='';ghCli='';gitCli='';pollIntervalMs=30000;proxy='';logDir=(Join-Path $root 'logs');stateDir=(Join-Path $root 'state');triggerIssueNumbers=@()}
  $cfg | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $local -Encoding utf8
  Write-Host "Created $local"
}
New-Item -ItemType Directory -Force (Join-Path $root 'logs'),(Join-Path $root 'state') | Out-Null
if($gh){& $gh auth status; if($LASTEXITCODE -ne 0){Write-Warning 'GitHub CLI is not authenticated. Run official: gh auth login'}}
Write-Host 'Deployment bootstrap complete. Review config.local.json, then run verify.ps1.'
