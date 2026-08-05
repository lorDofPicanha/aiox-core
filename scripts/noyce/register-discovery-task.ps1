<#
.SYNOPSIS
  Registra (ou remove) a tarefa agendada do Windows que roda a discovery do Noyce de hora em hora.

.DESCRIPTION
  Cria a Scheduled Task "NoyceDiscovery" que, a cada 1 hora, executa uma coleta
  incremental de 3 dias e preserva a janela operacional de 60 dias:
    node --experimental-strip-types scripts/noyce/discovery-scheduler.mjs --once -- --days 3 --retention-days 60
  O modo --once roda uma vez e registra o resultado em scripts/noyce/discovery-runs.log.
  É a opção DURÁVEL (sobrevive a reboot, não precisa de terminal aberto).

  O guard anti-vazio do build preserva o snapshot bom se o PNCP estiver fora (500/timeout),
  então rodar de hora em hora é seguro mesmo com a API instável.

.PARAMETER IntervalHours
  Intervalo em horas entre execuções (default 1).

.PARAMETER Unregister
  Remove a tarefa em vez de criar.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\noyce\register-discovery-task.ps1
  powershell -ExecutionPolicy Bypass -File scripts\noyce\register-discovery-task.ps1 -IntervalHours 2
  powershell -ExecutionPolicy Bypass -File scripts\noyce\register-discovery-task.ps1 -Unregister
#>
param(
  [int]$IntervalHours = 1,
  [int]$ExecutionTimeLimitMinutes = 45,
  [switch]$Unregister
)

$ErrorActionPreference = 'Stop'
$TaskName = 'NoyceDiscovery'

if ($Unregister) {
  try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Tarefa '$TaskName' removida."
  } catch {
    Write-Host "Tarefa '$TaskName' não existia (nada a remover)."
  }
  return
}

# Repo root = dois níveis acima deste script (scripts/noyce/ -> raiz).
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Resolve-Path (Join-Path $ScriptDir '..\..')

$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { throw "node não encontrado no PATH. Instale o Node.js ou ajuste o PATH." }

$scheduler = Join-Path $ScriptDir 'discovery-scheduler.mjs'
if (-not (Test-Path $scheduler)) { throw "Não achei $scheduler" }

$arguments = "--experimental-strip-types `"$scheduler`" --once -- --days 3 --retention-days 60 --max-runtime-min 40 --request-timeout-ms 30000"

$action  = New-ScheduledTaskAction -Execute $node -Argument $arguments -WorkingDirectory $RepoRoot
# Repete a cada N horas, por uma janela longa (10 anos), começando agora.
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
            -RepetitionInterval (New-TimeSpan -Hours $IntervalHours) `
            -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet `
            -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
            -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes $ExecutionTimeLimitMinutes)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger `
  -Settings $settings -Description "Noyce: discovery PNCP de $IntervalHours em $IntervalHours hora(s)" -Force | Out-Null

Write-Host "Tarefa '$TaskName' registrada: a cada $IntervalHours hora(s)."
Write-Host "Node:    $node"
Write-Host "Repo:    $RepoRoot"
Write-Host "Log:     $(Join-Path $ScriptDir 'discovery-runs.log')"
Write-Host ""
Write-Host "Verificar:  Get-ScheduledTask -TaskName $TaskName"
Write-Host "Rodar já:   Start-ScheduledTask -TaskName $TaskName"
Write-Host "Remover:    powershell -ExecutionPolicy Bypass -File scripts\noyce\register-discovery-task.ps1 -Unregister"
