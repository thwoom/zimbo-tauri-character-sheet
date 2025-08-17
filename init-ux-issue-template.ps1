$ErrorActionPreference = "Stop"

# Path for the issue template
$dir  = ".github\ISSUE_TEMPLATE"
$file = "ux-stage.md"
$path = Join-Path $dir $file

# Ensure the directory exists
if (-not (Test-Path $dir)) {
    Write-Host "Creating folder $dir"
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# Template content
$content = @"
---
name: "UX Stage Task"
about: Track one stage of the futuristic UX upgrade plan
title: "UX Stage 0X: <short, imperative title>"
labels: [ux, enhancement]
assignees: ""
---

## Scope
- [ ] Stage number: 0X
- [ ] Feature branch: \`codex/<feature>\`
- [ ] Limited strictly to this stage’s tasks.

## Tasks
- [ ] Implement components/logic for this stage
- [ ] Wire up tokens (colors, spacing, motion, shadows, etc.)
- [ ] Replace bespoke logic with **Radix** primitives where possible
- [ ] Style with **Tailwind** utilities/tokens
- [ ] Add docs under \`docs/\` for new patterns
- [ ] Commit to correct branch format (\`codex/{feature}\`)

## Acceptance Criteria
- [ ] No binary assets introduced (PNG/JPG/GIF/WebP)  
- [ ] Tokens drive all visuals; no magic values  
- [ ] Feature-flag heavy effects; off by default  
- [ ] A11y improved or preserved (focus trap, ARIA, reduced motion)  
- [ ] Performance budget not regressed  
- [ ] PR references this issue

## Notes
- Link to design tokens or style guide updates
- Known risks or migration notes
"@

# Write to file (UTF8, no BOM)
Set-Content -Path $path -Value $content -Encoding UTF8
Write-Host "Template written to $path"

# Stage and commit
git add $path
git commit -m "chore: add UX Stage issue template"
Write-Host "Committed UX issue template. Push with: git push"
