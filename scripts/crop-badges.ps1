Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\DELL\.gemini\antigravity-ide\brain\b0b862eb-951b-4874-b637-eb853d19eb86\.user_uploaded\media_1793090103746.jpg"
$destDir = "D:\CM WEBSITE\public\images\priorities"

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)

# Tuned center coordinates to isolate the circular badge without text
# Row 1: cy = 208, Row 2: cy = 566
# r = 100

$badges = @(
    @{ name = "good-governance"; cx = 147; cy = 208; r = 100 },
    @{ name = "law-order";       cx = 391; cy = 208; r = 100 },
    @{ name = "health-education"; cx = 635; cy = 208; r = 100 },
    @{ name = "service-delivery"; cx = 879; cy = 208; r = 100 },
    @{ name = "infrastructure";   cx = 147; cy = 566; r = 100 },
    @{ name = "employment";       cx = 391; cy = 566; r = 100 },
    @{ name = "grm-priority";     cx = 635; cy = 566; r = 100 },
    @{ name = "accountability";   cx = 879; cy = 566; r = 100 }
)

foreach ($b in $badges) {
    $size = $b.r * 2
    $destBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Transparent background with circular clip
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(2, 2, $size - 4, $size - 4)
    $g.SetClip($path)

    $srcRect = New-Object System.Drawing.Rectangle(($b.cx - $b.r), ($b.cy - $b.r), $size, $size)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $g.ResetClip()
    $path.Dispose()
    $g.Dispose()

    $outPath = Join-Path $destDir ($b.name + ".png")
    $destBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Output ("Saved circular badge: " + $outPath)
}

$srcImg.Dispose()
Write-Output "All 8 badges cropped with precision!"
