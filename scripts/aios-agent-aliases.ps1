param(
  [switch]$Quiet
)

$ErrorActionPreference = "Stop"

$AiosRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$AgentCall = Join-Path $AiosRoot ".aios-core\infrastructure\scripts\agent-call.js"
$MemoryCall = Join-Path $AiosRoot ".aios-core\core\memory\aios-memory.js"
$IndexFile = Join-Path $AiosRoot ".aios-core\data\jarvis-mind-clone-index.json"

if (-not (Test-Path -LiteralPath $AgentCall)) {
  throw "agent-call.js not found: $AgentCall"
}

if (-not (Test-Path -LiteralPath $IndexFile)) {
  throw "mind clone index not found: $IndexFile"
}

$AgentIds = & node -e "const j=require(process.argv[1]); const agents=Array.isArray(j)?j:(j.agents||[]); for (const a of agents) if (a && a.id) console.log(a.id);" $IndexFile

function global:Invoke-AiosAgent {
  param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Agent,

    [Parameter(ValueFromRemainingArguments = $true, Position = 1)]
    [string[]]$Task
  )

  if (-not $Task -or $Task.Count -eq 0) {
    Write-Host "Usage: $Agent `"task text`""
    return
  }

  Push-Location $AiosRoot
  try {
    & rtk node $AgentCall $Agent @Task
  } finally {
    Pop-Location
  }
}

function global:Invoke-AiosAgentAlias {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Task
  )

  Invoke-AiosAgent $MyInvocation.InvocationName @Task
}

function global:aios-memory {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
  )

  Push-Location $AiosRoot
  try {
    & rtk node $MemoryCall @Args
  } finally {
    Pop-Location
  }
}

foreach ($Agent in $AgentIds) {
  $AgentId = [string]$Agent
  if ([string]::IsNullOrWhiteSpace($AgentId)) {
    continue
  }

  Set-Alias -Name $AgentId -Value Invoke-AiosAgentAlias -Scope Global -Force
}

if (-not $Quiet) {
  Write-Host "AIOS agent aliases loaded: $($AgentIds.Count)"
  Write-Host "Examples:"
  Write-Host '  aios-master "reorganize os squads"'
  Write-Host '  kasim-aslam "avalie campanha Google Tocks"'
  Write-Host '  traffic-masters-chief "audite marketing-traffic"'
  Write-Host ""
  Write-Host "Generic form:"
  Write-Host '  Invoke-AiosAgent kasim-aslam "avalie campanha Google Tocks"'
  Write-Host '  aios-memory recall "como chamar agentes"'
}
