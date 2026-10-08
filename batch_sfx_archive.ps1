$sourceDir = "c:\Users\LovedGarvz\Documents\Juegos\Juegos flash\Juegos flash archivos\Nitrome"
$flashPlayerPath = "C:\Users\LovedGarvz\Documents\Juegos\Juegos flash\flashplayer_32_sa.exe"
$winrar = "C:\Program Files\WinRAR\WinRAR.exe"

$folders = Get-ChildItem -Path $sourceDir -Directory

$count = 0
foreach ($folder in $folders) {
    $gameName = $folder.Name
    
    # Ignorar carpetas que no tengan archivos swf
    $swfFiles = Get-ChildItem -Path $folder.FullName -Filter "*.swf"
    if ($swfFiles.Count -eq 0) { continue }
    
    # Buscar el SWF principal (que se llame igual que la carpeta o tomar el primero)
    $targetSwf = $swfFiles | Where-Object { $_.BaseName -eq $gameName } | Select-Object -First 1
    if (-not $targetSwf) {
        $targetSwf = $swfFiles[0]
    }
    
    # Carpeta temporal para armar el SFX
    $tempSfx = "$($folder.FullName)\temp_sfx_build"
    New-Item -ItemType Directory -Force -Path $tempSfx | Out-Null
    
    Copy-Item -Path $flashPlayerPath -Destination "$tempSfx\flashplayer_32_sa.exe"
    # No necesitamos copiar el SWF dentro del SFX si ya está afuera, pero lo empaquetaremos
    # para que sea 100% igual al método anterior, con la diferencia de que extraerá localmente.
    Copy-Item -Path $targetSwf.FullName -Destination "$tempSfx\$($targetSwf.Name)"
    
    # Configuración de WinRAR (Sin TempMode, para que extraiga en la carpeta actual y detecte los assets)
    $sfxConfig = @"
Setup=flashplayer_32_sa.exe `"$($targetSwf.Name)`"
Silent=1
Overwrite=1
"@
    Set-Content -Path "$tempSfx\config.txt" -Value $sfxConfig -Encoding UTF8
    
    $outExe = "$($folder.FullName)\$gameName.exe"
    if (Test-Path $outExe) { Remove-Item -Force $outExe }
    
    # Crear el SFX
    & $winrar a -sfx -ep -ibck -z"$tempSfx\config.txt" "$outExe" "$tempSfx\flashplayer_32_sa.exe" "$tempSfx\$($targetSwf.Name)" | Out-Null
    
    Start-Sleep -Milliseconds 200
    
    Remove-Item -Recurse -Force $tempSfx
    $count++
}

Write-Host "Processed $count game folders successfully!"
