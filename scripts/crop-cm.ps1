Add-Type -AssemblyName System.Drawing
$srcPath = "D:\CM WEBSITE\public\images\cm-balochistan-banner.png"
$dstPath = "D:\CM WEBSITE\public\images\cm-photo-4.jpg"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$cropRect = New-Object System.Drawing.Rectangle(660, 0, 364, 394)
$target = New-Object System.Drawing.Bitmap(364, 394)
$grp = [System.Drawing.Graphics]::FromImage($target)
$grp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$grp.DrawImage($src, (New-Object System.Drawing.Rectangle(0,0,364,394)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$target.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$grp.Dispose()
$target.Dispose()
$src.Dispose()
Write-Host "Successfully created cm-photo-4.jpg"
