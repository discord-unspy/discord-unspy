const { app, BrowserWindow } = require('electron');
const fetch = require('node-fetch');
const { readFile, writeFile } = require('node:fs/promises');

let mainWindow = null;

async function createWindow() {

const { ElectronBlocker, fullLists, Request }= await import ('@cliqz/adblocker-electron');

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      nodeIntegrationInSubFrames: true,
    },
    height: 600,
    width: 800,
  });

  const blocker = await ElectronBlocker.fromLists(
    fetch,
    fullLists,
    { enableCompression: true },
    {
      path: 'engine.bin',
      read: readFile,
      write: writeFile
    },
  );

  blocker.enableBlockingInSession(mainWindow.webContents.session);

  blocker.on('request-blocked', (request) => {
      console.log('blocked', request.tabId, request.url);
    })
    blocker.on('request-redirected', (request) => {
      console.log('redirected', request.tabId, request.url);
    })
    blocker.on('request-whitelisted', (request) => {
      console.log('whitelisted', request.tabId, request.url);
    })
   blocker.on('csp-injected', (request) => {
      console.log('csp', request.url);
    })
    blocker.on('script-injected', (script, url) => {
      console.log('script', script.length, url);
    })
   blocker .on('style-injected', (style, url) => {
      console.log('style', style.length, url);
    });

mainWindow.loadURL('https://discord.com/app/',
     {userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.45 Chrome/91.0.4472.164 Electron/13.6.6 Safari/537.36'});

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.allowRendererProcessReuse = false;

app
  .on('ready', createWindow)
  .on('window-all-closed', () => {
    if (process.platform !== 'darwin')
      app.quit();
  })
  .on('activate', async () => {
    if (mainWindow === null)
      await createWindow();
  });
