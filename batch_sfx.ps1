$sourceDir = "c:\Users\LovedGarvz\Documents\Juegos\Juegos flash\Juegos faltantes"
$flashPlayerPath = "C:\Users\LovedGarvz\Documents\Juegos\Juegos flash\flashplayer_32_sa.exe"
$winrar = "C:\Program Files\WinRAR\WinRAR.exe"

$swfFiles = Get-ChildItem -Path $sourceDir -Filter "*.swf"

foreach ($file in $swfFiles) {
    $gameName = $file.BaseName
    
    # Evitar procesar si es un swf que ya está dentro de una carpeta
    if ($file.DirectoryName -ne $sourceDir) { continue }
    
    $gameFolder = "$sourceDir\$gameName"
    
    # Create the folder for the game
    New-Item -ItemType Directory -Force -Path $gameFolder | Out-Null
    
    # Temp folder for SFX creation
    $tempSfx = "$sourceDir\temp_sfx_build"
    New-Item -ItemType Directory -Force -Path $tempSfx | Out-Null
    
    # Copy files
    Copy-Item -Path $flashPlayerPath -Destination "$tempSfx\flashplayer_32_sa.exe"
    Copy-Item -Path $file.FullName -Destination "$tempSfx\$($file.Name)"
    
    # Create SFX config
    $sfxConfig = @"
TempMode
Setup=flashplayer_32_sa.exe `"$($file.Name)`"
Silent=1
Overwrite=1
"@
    Set-Content -Path "$tempSfx\config.txt" -Value $sfxConfig -Encoding UTF8
    
    # Output EXE
    $outExe = "$gameFolder\$gameName.exe"
    if (Test-Path $outExe) { Remove-Item -Force $outExe }
    
    # Run WinRAR
    & $winrar a -sfx -ep -ibck -z"$tempSfx\config.txt" "$outExe" "$tempSfx\flashplayer_32_sa.exe" "$tempSfx\$($file.Name)" | Out-Null
    
    Start-Sleep -Milliseconds 500
    
    # Cleanup temp
    Remove-Item -Recurse -Force $tempSfx
    
    # Mover el SWF original adentro de la carpeta para que no quede suelto
    Move-Item -Path $file.FullName -Destination $gameFolder -Force
}

Write-Host "All games packaged into their folders successfully!"
