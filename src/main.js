const { app, BrowserWindow } = require('electron');
const fetch = require('node-fetch');
const { readFile, writeFile } = require('node:fs/promises');
const config = require('../config.json');
const ver = require('../versions/version.json');

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

  // check the curren version string on version.json
  if(ver.CurrentVersion === "Stable"){
    var url = config.DISCORD_CLIENT_URL
  } else if(ver.CurrentVersion === "PublicTestBuild"){
  var url = config.DISCORD_CLIENT_PTB
  } else if(ver.CurrentVersion === "Canary"){
   var url = config.DISCORD_CLIENT_CANARY
  }
  
  mainWindow.loadURL(url, {
  userAgent:config.UserAgent
});

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
