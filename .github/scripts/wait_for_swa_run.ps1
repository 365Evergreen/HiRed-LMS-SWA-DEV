$owner = '365Evergreen'
$repo = 'HiRed-LMS-SWA-DEV'
for ($i = 0; $i -lt 60; $i++) {
    $runs = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/actions/runs"
    $r = $runs.workflow_runs[0]
    if ($null -eq $r) {
        Write-Output 'no runs yet'
        Start-Sleep -Seconds 3
        continue
    }
    if ($r.status -ne 'completed') {
        Write-Output "waiting... status=$($r.status) created_at=$($r.created_at)"
        Start-Sleep -Seconds 5
        continue
    }
    Write-Output '---RUN---'
    $r | Select-Object id,run_number,head_sha,status,conclusion,html_url | ConvertTo-Json -Depth 5
    Write-Output '---JOBS---'
    $jobs = Invoke-RestMethod -Uri $r.jobs_url
    $jobs.jobs | Select-Object name,conclusion,steps | ConvertTo-Json -Depth 6
    exit 0
}
Write-Output 'timeout waiting for run'
exit 1
