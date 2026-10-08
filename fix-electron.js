const { downloadArtifact } = require('@electron/get');
const extract = require('extract-zip');
const path = require('path');
const fs = require('fs');

async function go() {
  try {
    console.log('Downloading Electron...');
    const zipPath = await downloadArtifact({
      version: '30.0.0', // Using version 30 as specified in package.json
      artifactName: 'electron',
      platform: 'win32',
      arch: process.arch,
      force: true
    });
    console.log('Downloaded to', zipPath);
    const distPath = path.join(__dirname, 'node_modules', 'electron', 'dist');
    console.log('Extracting to', distPath);
    await extract(zipPath, { dir: distPath });
    fs.writeFileSync(path.join(__dirname, 'node_modules', 'electron', 'path.txt'), 'electron.exe');
    console.log('Success! Electron is ready.');
  } catch (e) {
    console.error('Error downloading Electron:', e);
  }
}
go();
