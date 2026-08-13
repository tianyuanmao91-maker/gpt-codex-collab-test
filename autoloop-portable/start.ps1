$ErrorActionPreference='Stop'
$root=$PSScriptRoot;$state=Join-Path $root 'state';$pf=Join-Path $state 'watcher.pid';New-Item -ItemType Directory -Force $state,(Join-Path $root 'logs') | Out-Null
if(Test-Path $pf){$p=[int](Get-Content $pf -Raw);if(Get-Process -Id $p -ErrorAction SilentlyContinue){Write-Host "Watcher already running PID=$p";exit 0};Remove-Item $pf -Force}
$node=(Get-Command node -ErrorAction Stop).Source;$config=Join-Path $root 'config.local.json';if(-not(Test-Path $config)){throw 'config.local.json missing; run deploy.ps1'}
$p=Start-Process $node -ArgumentList @((Join-Path $root 'autoloop\src\runner.js'),$config,'--watch') -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $root 'logs\watcher.log') -RedirectStandardError (Join-Path $root 'logs\watcher.err');Set-Content $pf $p.Id;Write-Host "PID=$($p.Id)";Write-Host "CWD=$root";Write-Host "HEAD=$(& git -C $root rev-parse HEAD 2>$null)";Write-Host 'Logs='+ (Join-Path $root 'logs')
