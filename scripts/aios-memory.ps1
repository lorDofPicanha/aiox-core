param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$ErrorActionPreference = "Stop"
$AiosRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$MemoryCli = Join-Path $AiosRoot ".aios-core\core\memory\aios-memory.js"

Push-Location $AiosRoot
try {
  & rtk node $MemoryCli @Args
} finally {
  Pop-Location
}
