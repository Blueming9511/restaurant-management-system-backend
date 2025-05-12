Write-Host "Select branch type:"
Write-Host "1) feature"
Write-Host "2) fix"
Write-Host "3) refactor"
Write-Host "4) chore"
Write-Host "5) docs"
Write-Host "6) test"

$type_num = Read-Host "Type (1-6)"

switch ($type_num) {
    "1" { $type = "feature" }
    "2" { $type = "fix" }
    "3" { $type = "refactor" }
    "4" { $type = "chore" }
    "5" { $type = "docs" }
    "6" { $type = "test" }
    default {
        Write-Host "Invalid type selected. Exiting."
        exit
    }
}

$desc = Read-Host "Short description (use dashes, e.g., login-page)"

git add .

# Commit with the standardized message format using ${} for variable references
git commit -m "${type}: ${desc}"

# Push to remote
git push 

Write-Host "`nCommitted and pushed with message: '${type}: ${desc}'"
