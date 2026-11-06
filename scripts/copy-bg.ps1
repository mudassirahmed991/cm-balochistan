$brainDir = "C:\Users\DELL\.gemini\antigravity-ide\brain\b0b862eb-951b-4874-b637-eb853d19eb86"
$dest = "D:\CM WEBSITE\public\images\priorities"

$mapping = [ordered]@{
    "good_governance_bg" = "good-governance-bg.jpg";
    "law_order_bg" = "law-order-bg.jpg";
    "health_education_bg" = "health-education-bg.jpg";
    "service_delivery_bg" = "service-delivery-bg.jpg";
    "infrastructure_bg" = "infrastructure-bg.jpg";
    "employment_bg" = "employment-bg.jpg";
    "grm_priority_bg" = "grm-priority-bg.jpg";
    "accountability_bg" = "accountability-bg.jpg"
}

foreach ($key in $mapping.Keys) {
    $file = Get-ChildItem -Path $brainDir -Filter ($key + "*.jpg") | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($file) {
        $target = Join-Path $dest $mapping[$key]
        Copy-Item -Path $file.FullName -Destination $target -Force
        Write-Output ("Copied: " + $file.Name + " -> " + $mapping[$key])
    } else {
        Write-Output ("Not found: " + $key)
    }
}
