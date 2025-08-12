param(
  [string]$Base = "main"
)

# capture diff against base branch
$baseRef = "origin/$Base"
$diff = git diff "$baseRef...HEAD" | Out-String

# fetch open PRs and parse JSON
$prsJson = gh pr list --state open --json number,headRefName,baseRefName
$prs = @()
if ($prsJson) { $prs = $prsJson | ConvertFrom-Json }

$match = $null
foreach ($pr in $prs) {
  if ($pr.baseRefName -ne $Base) { continue }
  git fetch origin $pr.headRefName --depth=1 *> $null
  $prDiff = git diff "$baseRef...origin/$($pr.headRefName)" | Out-String
  if ($prDiff -eq $diff) {
    $match = $pr
    break
  }
}

if ($match) {
  Write-Host "Reusing existing PR #$($match.number) on branch $($match.headRefName)." -ForegroundColor Green
  git push --force-with-lease origin HEAD:"$($match.headRefName)" | Out-String
  return
}

# no matching PR found, create new branch and PR
$rand = -join ((48..57)+(97..122) | Get-Random -Count 8 | ForEach-Object {[char]$_})
$branch = "$rand-codex/$Base"
Write-Host "Creating new branch $branch and opening PR." -ForegroundColor Yellow
git checkout -b $branch *> $null
git push -u origin $branch | Out-String
gh pr create --fill --head $branch --base $Base | Out-String
