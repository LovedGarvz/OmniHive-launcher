const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ejecutarExe: (ruta) => ipcRenderer.send('lanzar-juego', ruta),
  obtenerJuegos: () => ipcRenderer.invoke('obtener-juegos'),
  obtenerFavoritos: () => ipcRenderer.invoke('obtener-favoritos'),
  alternarFavorito: (nombre) => ipcRenderer.invoke('alternar-favorito', nombre)
});
