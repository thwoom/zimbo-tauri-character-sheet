# fix-prs.ps1 — iterate open PRs, attempt merge with base, run fixes, push
$ErrorActionPreference = "Stop"

# Get all open PRs
$prsJson = gh pr list --state open --json number,headRefName,baseRefName,title
$prs = $prsJson | ConvertFrom-Json
if (-not $prs -or $prs.Count -eq 0) {
    Write-Host "No open PRs found."
    exit 0
}

foreach ($pr in $prs) {
    Write-Host "`n=== PR #$($pr.number): $($pr.title) [$($pr.headRefName) -> $($pr.baseRefName)] ===`n"

    # Abort any previous incomplete merge if MERGE_HEAD exists
    if (Test-Path ".git\MERGE_HEAD") {
        git merge --abort
    }

    # Checkout the PR branch
    gh pr checkout $pr.number

    # Fetch the base branch
    git fetch origin $pr.baseRefName

    # Merge the base into the PR, creating a commit if there are no conflicts
    git merge --no-ff ("origin/" + $pr.baseRefName) 2>$null

    # Check for conflicts
    $conflictFiles = git ls-files -u | ForEach-Object { ($_ -split "`t")[-1] } | Sort-Object -Unique

    if ($conflictFiles.Count -gt 0) {
        Write-Host "Conflicts detected in:`n$($conflictFiles -join "`n")"

        # Union-merge simple ignore files (.prettierignore and .eslintignore)
        $unionTargets = @(".prettierignore", ".eslintignore")
        foreach ($f in $conflictFiles) {
            if ($unionTargets -contains $f) {
                $content = Get-Content $f -Raw
                if ($content -match '<<<<<<<') {
                    $blocks  = $content -split '(?m)^<<<<<<< .+?$'
                    $rebuilt = ""
                    foreach ($b in $blocks) {
                        if ($b -match '=======') {
                            $parts = ($b -split '(?m)^=======\s*$')
                            $a    = $parts[0] -replace '(?m)^>>>>>>> .+$',''
                            $b2   = ($parts[1] -replace '(?m)^>>>>>>> .+$','')
                            $lines = @()
                            $lines += ($a -split "`r?`n")
                            $lines += ($b2 -split "`r?`n")
                            $uniq = $lines | Where-Object { $_ -ne "" } | Select-Object -Unique
                            $rebuilt += ($uniq -join "`r`n") + "`r`n"
                        } else {
                            $rebuilt += $b
                        }
                    }
                    # Save the merged content back to the file
                    Set-Content -Path $f -Value ($rebuilt.Trim() + "`r`n")
                    git add $f
                }
            }
        }

        # Check if any conflict markers remain
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
            Write-Host "Unresolved conflict markers remain in these files:`n$($markersLeft -join "`n")"
            Write-Host "Skipping automated fix for this PR. Resolve these manually, then run:"
            Write-Host "  git add -A"
            Write-Host "  git commit -m 'resolve conflicts'"
            Write-Host "  git push"
            continue
        }
    }

    # Run fixers
    npm install
    npx eslint . --fix
    npx prettier --write .

    # Run tests; if they fail, report but don't stop the script
    npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Tests failed (non-blocking for this script)."
    }

    # Commit and push the changes (fixes and any resolved conflicts)
    git add -A
    git commit -m "chore: auto-merge base, lint/format" | Out-Null
    git push -u origin HEAD
}

Write-Host "`nAll PRs processed."
