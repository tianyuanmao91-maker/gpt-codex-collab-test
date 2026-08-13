$ErrorActionPreference='Continue'
$app=$PSScriptRoot
$root=Split-Path -Parent $app
$cfg=Join-Path (Split-Path -Parent (Split-Path -Parent $root)) 'autoloop-real-config.json'
$node=(Get-Command node.exe).Source
$runner=Join-Path $app 'src\runner.js'
$log=Join-Path $app 'logs\supervisor.log'
$env:GH_CLI='C:\Users\11516\Documents\Codex\2026-08-06\w\outputs\gh-cli\bin\gh.exe'
$env:CODEX_CLI='C:\Users\11516\Documents\Codex\2026-08-06\w\outputs\autoloop-node1-test\node_modules\.bin\codex.cmd'
New-Item -ItemType Directory -Force (Split-Path $log) | Out-Null
while($true){
  try { Add-Content $log ("START " + (Get-Date -Format o)); & $node $runner $cfg --watch *>> $log } catch { Add-Content $log ((Get-Date -Format o)+" ERROR "+$_.Exception.Message) }
  Add-Content $log ("RESTART " + (Get-Date -Format o)); Start-Sleep -Seconds 10
}
