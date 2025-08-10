# fix-prs.ps1 — iterate open PRs, merge base, auto-fix, test, push
# Run from repo root:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\fix-prs.ps1

$ErrorActionPreference = 'Stop'

# Fetch open PRs
$prsJson = gh pr list --state open --json number,headRefName,baseRefName,title
$prs     = $prsJson | ConvertFrom-Json
if (-not $prs -or $prs.Count -eq 0) {
    Write-Host "No open PRs found."
    exit 0
}

foreach ($pr in $prs) {
    Write-Host "`n=== PR #$($pr.number): $($pr.title) [$($pr.headRefName) -> $($pr.baseRefName)] ===`n"

    # If a previous run left a merge open, abort it safely
    if (Test-Path ".git\MERGE_HEAD") {
        & git merge --abort | Out-Null
    }

    # Checkout PR branch
    & gh pr checkout $pr.number | Out-Null

    # Ensure we have latest base
    & git fetch origin $pr.baseRefName | Out-Null

    # Merge base into PR branch — create commit automatically (no editor)
    & git merge --no-ff --no-edit ("origin/" + $pr.baseRefName)
    $mergeExit = $LASTEXITCODE

    # Identify conflicted files (if any)
    $conflictFiles = (& git ls-files -u) | ForEach-Object {
        ($_ -split "`t")[-1]
    } | Sort-Object -Unique

    if ($conflictFiles -and $conflictFiles.Count -gt 0) {
        Write-Host "Conflicts detected in:`n$($conflictFiles -join "`n")"

        # Auto-union only for simple ignore files
        $unionTargets = @(".prettierignore", ".eslintignore")
        foreach ($f in $conflictFiles) {
            if ($unionTargets -contains $f -and (Test-Path $f)) {
                $content = Get-Content $f -Raw
                if ($content -match '<<<<<<<') {
                    $blocks  = $content -split '(?m)^<<<<<<< .+?$'
                    $rebuilt = ''
                    foreach ($b in $blocks) {
                        if ($b -match '=======') {
                            $parts = $b -split '(?m)^=======\s*$'
                            $a     = $parts[0] -replace '(?m)^>>>>>>> .+$',''
                            $b2    = $parts[1] -replace '(?m)^>>>>>>> .+$',''
                            $lines = @()
                            $lines += ($a  -split "`r?`n")
                            $lines += ($b2 -split "`r?`n")
                            $uniq  = $lines | Where-Object { $_ -ne '' } | Select-Object -Unique
                            $rebuilt += ($uniq -join "`r`n") + "`r`n"
                        } else {
                            $rebuilt += $b
                        }
                    }
                    Set-Content -Path $f -Value ($rebuilt.Trim() + "`r`n")
                    & git add $f | Out-Null
                }
            }
        }

        # Re-check for any remaining conflict markers
        $markersLeft = @()
        foreach ($f in $conflictFiles | Sort-Object -Unique) {
            if (Test-Path $f) {
                $txt = Get-Content $f -Raw
                if ($txt -match '<<<<<<<|=======|>>>>>>>') {
                    $markersLeft += $f
                }
            }
        }
        if ($markersLeft.Count -gt 0) {
            Write-Host "Unresolved conflict markers remain in:`n$($markersLeft -join "`n")"
            Write-Host "Skipping automated fix for this PR. Resolve manually, then:"
            Write-Host "  git add -A"
            Write-Host "  git commit -m 'resolve conflicts'"
            Write-Host "  git push"
            # Do not leave repo in merge state:
            if (Test-Path ".git\MERGE_HEAD") { & git merge --abort | Out-Null }
            continue
        }

        # If we got here, conflicts were either union-merged or none remain.
        # Finalize the merge commit if still in a merge state.
        if (Test-Path ".git\MERGE_HEAD") {
            & git commit -m "chore: merge $($pr.baseRefName) into $($pr.headRefName) as part of PR #$($pr.number)" | Out-Null
        }
    } else {
        if ($mergeExit -eq 0) {
            Write-Host "Merge completed with no conflicts."
            # If Git is waiting to commit (rare with --no-edit), finalize:
            if (Test-Path ".git\MERGE_HEAD") {
                & git commit -m "chore: merge $($pr.baseRefName) into $($pr.headRefName) as part of PR #$($pr.number)" | Out-Null
            }
        } else {
            # Non-zero exit but no listed conflicts — print a note and move on
            Write-Host "Merge reported a non-zero exit but no conflicts were listed."
        }
    }

    # Run fixers
    & npm install
    & npx eslint . --fix
    & npx prettier --write .

    # Run tests; if they fail, report but don't stop the loop
    & npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Tests failed (non-blocking for this script)."
    }

    # Commit and push any changes from fixers
    & git add -A | Out-Null
    # It's okay if nothing to commit; suppress error output
    & git commit -m "chore: auto-merge base, lint/format" 2>$null | Out-Null
    & git push -u origin HEAD
}

Write-Host "`nAll PRs processed."
