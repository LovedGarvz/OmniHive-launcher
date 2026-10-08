================================================================================
                      FLASH GAMES LAUNCHER - CATÁLOGO ARCADE
================================================================================

Creado por: LovedGarvz
Versión: 1.0 (Edición Portable Definitiva)

================================================================================
1. ¿QUÉ ES ESTE PROYECTO?
================================================================================
Este es un Launcher (lanzador) diseñado específicamente para revivir y 
preservar juegos clásicos de la era Flash (enfocado en el catálogo de Nitrome 
y otros clásicos), permitiendo jugarlos de manera local (offline) sin la 
necesidad de navegadores web o conexión a internet.

Al estar construido sobre Electron, proporciona una interfaz de usuario fluida, 
moderna y rápida, similar a la de consolas o plataformas de streaming, 
ocultando la complejidad técnica que requiere ejecutar archivos SWF hoy en día.

================================================================================
2. CARACTERÍSTICAS TÉCNICAS PRINCIPALES
================================================================================
- EJECUCIÓN NATIVA (.SWF): El motor del launcher escanea la carpeta "Games" 
  y lanza nativamente los archivos .swf usando un reproductor Flash Projector 
  integrado (flashplayer_32_sa.exe), evitando instalaciones externas en la PC 
  del usuario.
  
- EVASIÓN DE SITELOCK: El código detecta y da prioridad automáticamente a los 
  archivos que contienen la palabra "offline" (ej. offline_game.swf), 
  esquivando las protecciones antipiratería (sitelock) que congelaban los 
  juegos fuera de nitrome.com.

- AUTO-CONFIGURACIÓN (FLASH TRUST): Al iniciar, la aplicación detecta tu 
  sistema y escribe automáticamente un certificado de confianza en la carpeta 
  oculta de FlashPlayerTrust. Esto asegura que juegos complejos que cargan 
  niveles mediante múltiples archivos (XML) como "Droplets" o "Cave Chaos" 
  funcionen siempre, sin requerir la instalación de un servidor local.

- SISTEMA DE FAVORITOS PERSISTENTE (⭐): Al marcar un juego con estrella, este
  se fijará en la parte superior del catálogo. Esta lista se guarda 
  dinámicamente en el AppData del usuario, garantizando que nunca se borre.

- MODO DESCUBRIR (🎲): Implementa un algoritmo matemático de barajado 
  (Fisher-Yates) para reorganizar aleatoriamente los juegos no-favoritos, 
  ideal para explorar juegos olvidados de la colección.

- 100% PORTABLE: Sin rutas absolutas incrustadas en el código. El programa y 
  los juegos pueden moverse a cualquier disco duro o memoria USB.

================================================================================
3. ¿CÓMO AGREGAR MÁS JUEGOS Y PORTADAS?
================================================================================
El sistema está diseñado para ser "Drag & Drop" (Arrastrar y soltar).

A) JUEGOS SIMPLES:
   Pega tu archivo ".swf" o ".exe" suelto dentro de la carpeta "Games".
   
B) JUEGOS COMPLEJOS (Con niveles adicionales):
   Pega la carpeta completa del juego dentro de "resources/app/Games". Renombra la carpeta 
   con el título del juego. El Launcher entrará automáticamente y encontrará 
   el archivo ejecutable correcto.
   
C) PORTADAS (IMÁGENES):
   Descarga una imagen en formato .jpg o .png y pégala suelta en la carpeta 
   raíz de "resources/app/Games". El nombre del archivo de imagen debe ser EXACTAMENTE IGUAL 
   al nombre del juego o de la carpeta.
   (Ejemplo: "A Kitty Dream.swf" ---> "A Kitty Dream.jpg")

D) RECARGAR:
   Si tienes el Launcher abierto, solo presiona "Ctrl + R" para refrescar el 
   catálogo y ver los nuevos juegos e imágenes añadidos.

================================================================================
4. SOLUCIÓN DE PROBLEMAS COMUNES
================================================================================
- Pantalla blanca / Juego bugeado: 
  Presiona la tecla "Control" y luego da "Intro" (Enter) 2 veces.
- Juego bloqueado (Fatal Error / Pantalla Negra): 
  El archivo .swf tiene sitelock y requiere conexión a internet para verificar 
  su dominio original. Para arreglarlo, debes reemplazar el archivo .swf por 
  una versión parcheada (sitelock removed o version offline).

================================================================================
"¡La nostalgia está a salvo!"
================================================================================
