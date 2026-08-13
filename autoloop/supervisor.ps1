$ErrorActionPreference='Continue'
$root=Split-Path -Parent $PSScriptRoot
$cfg=Join-Path (Split-Path -Parent $root) 'autoloop-real-config.json'
$node=(Get-Command node.exe).Source
$runner=Join-Path $root 'src\runner.js'
$log=Join-Path $root 'logs\supervisor.log'
New-Item -ItemType Directory -Force (Split-Path $log) | Out-Null
while($true){
  try { Add-Content $log ("START " + (Get-Date -Format o)); & $node $runner $cfg --watch *>> $log } catch { Add-Content $log ((Get-Date -Format o)+" ERROR "+$_.Exception.Message) }
  Add-Content $log ("RESTART " + (Get-Date -Format o)); Start-Sleep -Seconds 10
}
