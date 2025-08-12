# just-errors.ps1 — run npm commands via cmd.exe and capture errors
param([string[]]$Args)

$cmdArgs = "/c npm " + ($Args -join ' ')

$psi = [System.Diagnostics.ProcessStartInfo]::new()
$psi.FileName = "cmd"
$psi.Arguments = $cmdArgs
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false

$process = [System.Diagnostics.Process]::Start($psi)

$stdout = $process.StandardOutput.ReadToEnd()
$stderr = $process.StandardError.ReadToEnd()
$process.WaitForExit()

if ($stdout) { Write-Output $stdout }
if ($stderr) { Write-Error $stderr }

exit $process.ExitCode
