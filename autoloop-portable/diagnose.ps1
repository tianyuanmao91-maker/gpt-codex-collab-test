$ErrorActionPreference='Continue'
$root=$PSScriptRoot
function Show-Cli([string]$name){$c=Get-Command $name -ErrorAction SilentlyContinue;if($c){Write-Host "${name}: $($c.Source)"; & $c.Source --version}else{Write-Host "${name}: MISSING"}}
Write-Host "OS: $([Environment]::OSVersion.VersionString)";Write-Host "Root: $root";Write-Host "APPDATA: $env:APPDATA";Write-Host "USERPROFILE: $env:USERPROFILE";Write-Host "GH_CONFIG_DIR: $env:GH_CONFIG_DIR"
Show-Cli node;Show-Cli npm;Show-Cli git;Show-Cli gh;Show-Cli codex
Write-Host 'Proxy variables:';foreach($n in 'HTTP_PROXY','HTTPS_PROXY','ALL_PROXY'){if([Environment]::GetEnvironmentVariable($n)){Write-Host "$n=PRESENT (value hidden)"}else{Write-Host "$n=ABSENT"}}
$gh=Get-Command gh -ErrorAction SilentlyContinue;if($gh){& $gh.Source auth status}
$cfg=Join-Path $root 'config.local.json';Write-Host "Config: $cfg ($(Test-Path $cfg))";Write-Host "Watcher PID: $((Get-Content (Join-Path $root 'state\watcher.pid') -ErrorAction SilentlyContinue))";Write-Host "HEAD: $((git -C $root rev-parse HEAD 2>$null))"
if($gh -and $LASTEXITCODE -eq 0){Write-Host 'READY'}else{Write-Host 'BLOCKED_GH_AUTH'}
