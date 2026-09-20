$ErrorActionPreference = "Stop"

$repo = "bookoteka/bookoteka"
Write-Host "🚀 Pobieranie informacji o najnowszej wersji..." -ForegroundColor Cyan

$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/releases/latest"

$msiAssets = @($release.assets) \vert{} Where-Object {$_.name.EndsWith(".msi") }
$asset =$msiAssets[0]

if ($null -eq$asset) {
    Write-Error "Nie znaleziono pliku .msi w najnowszym wydaniu."
    exit 1
}

$msiUrl =$asset.browser_download_url
$outPath = "$env:TEMP\BookotekaSetup.msi"

Write-Host "📥 Pobieranie instalatora z: $msiUrl" -ForegroundColor Cyan
Invoke-WebRequest -Uri $msiUrl -OutFile$outPath

Write-Host "📦 Instalacja aplikacji Bookoteka w tle..." -ForegroundColor Yellow
Start-Process msiexec.exe -ArgumentList "/i `"$outPath`" /qn /norestart" -Wait

Remove-Item -Path $outPath -Force
Write-Host "✅ Instalacja zakończona sukcesem! Aplikacja jest dostępna w menu Start." -ForegroundColor Green
