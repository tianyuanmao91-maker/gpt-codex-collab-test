$ErrorActionPreference='Stop'
$appRoot=$PSScriptRoot
$workspace=Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $appRoot))
$config=Join-Path $workspace 'autoloop-real-config.json'
$node=(Get-Command node.exe).Source
$runner=Join-Path $appRoot 'src\runner.js'
$state=Join-Path $appRoot 'state'
$pidFile=Join-Path $state 'watcher.pid'
$log=Join-Path $appRoot 'logs\work-mode.log'
$env:GH_CLI='C:\Users\11516\Documents\Codex\2026-08-06\w\outputs\gh-cli\bin\gh.exe'
$env:CODEX_CLI='C:\Users\11516\Documents\Codex\2026-08-06\w\outputs\autoloop-node1-test\node_modules\@openai\codex-win32-x64\vendor\x86_64-pc-windows-msvc\bin\codex.exe'
New-Item -ItemType Directory -Force $state,(Split-Path $log) | Out-Null

if(-not (Get-Process ChatGPT -ErrorAction SilentlyContinue)){
  $codexApp='C:\Program Files\WindowsApps\OpenAI.Codex_26.803.10989.0_x64__2p2nqsd0c76g0\app\ChatGPT.exe'
  if(Test-Path $codexApp){Start-Process -FilePath $codexApp}
  else{Start-Process 'shell:AppsFolder\OpenAI.Codex_2p2nqsd0c76g0!App'}
}

$running=$false
if(Test-Path $pidFile){
  $oldPid=[int](Get-Content $pidFile -Raw)
  $running=$null -ne (Get-Process -Id $oldPid -ErrorAction SilentlyContinue)
  if(-not $running){Remove-Item $pidFile -Force}
}
if(-not $running){
  $p=Start-Process -FilePath $node -ArgumentList @($runner,$config,'--watch') -WorkingDirectory $appRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput $log -RedirectStandardError ($log+'.err')
  Set-Content -LiteralPath $pidFile -Value $p.Id -Encoding ascii
  Add-Content $log ("WORK_MODE_STARTED " + (Get-Date -Format o) + " PID=" + $p.Id)
}
