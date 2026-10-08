const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    maximizable: true,
    icon: path.join(__dirname, 'SimAguaMixteco_Icono.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');

  // Permitir recargar con Ctrl + R ya que quitamos el menú por defecto
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      mainWindow.reload();
      event.preventDefault();
    }
  });
}

function configurarFlashTrust() {
  const os = require('os');
  const appDataPath = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const trustDir = path.join(appDataPath, 'Macromedia', 'Flash Player', '#Security', 'FlashPlayerTrust');
  
  if (!fs.existsSync(trustDir)) {
    try {
      fs.mkdirSync(trustDir, { recursive: true });
    } catch(e) {
      console.error("Error creando carpeta trust:", e);
    }
  }
  
  const trustFile = path.join(trustDir, 'flash_games_launcher.cfg');
  const gamesPath = path.join(__dirname, 'Games');
  try {
    fs.writeFileSync(trustFile, gamesPath);
  } catch(e) {
    console.error("Error escribiendo archivo trust:", e);
  }
}

app.whenReady().then(() => {
  configurarFlashTrust();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('lanzar-juego', (event, juegoRuta) => {
  const absolutePath = path.join(__dirname, juegoRuta);
  const gameDir = path.dirname(absolutePath);
  
  if (absolutePath.toLowerCase().endsWith('.swf')) {
    // Es un archivo SWF crudo, usar Flash Player
    const flashPlayer = path.join(__dirname, 'flashplayer_32_sa.exe');
    if (!fs.existsSync(flashPlayer)) {
      console.error('No se encontro flashplayer_32_sa.exe en la raiz del launcher');
      return;
    }
    execFile(flashPlayer, [absolutePath], { cwd: gameDir }, (error, stdout, stderr) => {
      if (error) console.error(`Error Flash: ${error.message}`);
    });
  } else {
    // Es un EXE
    execFile(absolutePath, { cwd: gameDir }, (error, stdout, stderr) => {
      if (error) console.error(`Error EXE: ${error.message}`);
    });
  }
});

const fs = require('fs');

ipcMain.handle('obtener-juegos', async () => {
  const gamesDir = path.join(__dirname, 'Games');
  let gameList = [];
  try {
    const items = fs.readdirSync(gamesDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        if (item.name.toLowerCase().endsWith('.exe')) {
          const name = item.name.replace(/\.exe$/i, '');
          gameList.push({ name: name, exePath: `Games/${item.name}`, imagePath: `Games/${name}.jpg` });
        } else if (item.name.toLowerCase().endsWith('.swf')) {
          const name = item.name.replace(/\.swf$/i, '');
          gameList.push({ name: name, exePath: `Games/${item.name}`, imagePath: `Games/${name}.jpg` });
        }
      } else if (item.isDirectory()) {
        const folderPath = path.join(gamesDir, item.name);
        try {
          const folderItems = fs.readdirSync(folderPath, { withFileTypes: true });
          
          // Buscar primero un .exe
          const exes = folderItems.filter(f => f.isFile() && f.name.toLowerCase().endsWith('.exe'));
          // Ignorar los exes creados por winrar temporalmente si está el SWF original, 
          // mejor buscar un SWF primero para evitar los SFX rotos
          const swfs = folderItems.filter(f => f.isFile() && f.name.toLowerCase().endsWith('.swf'));
          
          if (swfs.length > 0) {
            // Prioridad 1: Versión Offline (sin sitelock)
            let mainSwf = swfs.find(f => f.name.toLowerCase().includes('offline'));
            // Prioridad 2: Archivo con el mismo nombre de la carpeta
            if (!mainSwf) {
              mainSwf = swfs.find(f => f.name.toLowerCase() === `${item.name.toLowerCase()}.swf`);
            }
            // Prioridad 3: El primer swf que encuentre
            if (!mainSwf) mainSwf = swfs[0];
            
            gameList.push({
              name: item.name,
              exePath: `Games/${item.name}/${mainSwf.name}`,
              imagePath: `Games/${item.name}.jpg`
            });
          } else if (exes.length > 0) {
            let mainExe = exes.find(f => f.name.toLowerCase() === `${item.name.toLowerCase()}.exe`);
            if (!mainExe) mainExe = exes[0];
            gameList.push({
              name: item.name,
              exePath: `Games/${item.name}/${mainExe.name}`,
              imagePath: `Games/${item.name}.jpg`
            });
          }
        } catch(e) {}
      }
    }
    return gameList;
  } catch (err) {
    console.error('No se pudo leer la carpeta Games:', err);
    return [];
  }
});

const favoritesPath = path.join(app.getPath('userData'), 'favorites.json');

function getFavorites() {
  if (fs.existsSync(favoritesPath)) {
    try {
      const data = fs.readFileSync(favoritesPath, 'utf-8');
      return JSON.parse(data);
    } catch(e) {
      return [];
    }
  }
  return [];
}

ipcMain.handle('obtener-favoritos', () => {
  return getFavorites();
});

ipcMain.handle('alternar-favorito', (event, gameName) => {
  let favs = getFavorites();
  if (favs.includes(gameName)) {
    favs = favs.filter(name => name !== gameName);
  } else {
    favs.push(gameName);
  }
  fs.writeFileSync(favoritesPath, JSON.stringify(favs));
  return favs;
});
