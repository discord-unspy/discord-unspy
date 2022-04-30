const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const { readFile, writeFile } = require('node:fs/promises');
const { autoUpdater } = require('electron-updater');

const config = require('../config.json');
const { version } = require('../package.json');

let fetch, ElectronBlocker, fullLists;

// Detect Platform
switch (process.platform) {
  case 'darwin':
    app.whenReady().then(() => {
      global.frame = false;
      global.titleBarStyle = 'hiddenInset';
      global.update = console.log(
        'Auto update is unsupported on this platform.'
      );
    });
    break;
  case 'win32':
    app.whenReady().then(async () => {
      global.frame = false;
      global.titleBarStyle = 'hidden';
      global.update = await autoUpdater.checkForUpdates();
    });
    break;
  default:
    app.whenReady().then(async () => {
      // Linux, ChromeOS, or whatever
      global.frame = true;
      global.titleBarStyle = 'hidden';
      global.update = await autoUpdater.checkForUpdates();
    });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/** @type {BrowserWindow | undefined} */
let mainWindow;

async function createWindow() {
  if (fetch === undefined) ({ default: fetch } = await import('node-fetch'));

  if (ElectronBlocker === undefined)
    ({ ElectronBlocker, fullLists } = await import(
      '@cliqz/adblocker-electron'
    ));

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    minWidth: 730,
    minHeight: 360,
    frame: global.frame,
    show:false,
    titleBarStyle: global.titleBarStyle,
    autoHideMenuBar: true,
    backgroundColor: '#202225',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    }
  });

  const blocker = await ElectronBlocker.fromLists(
    fetch,
    fullLists,
    { enableCompression: true },
    {
      path: 'engine.bin',
      read: readFile,
      write: writeFile
    }
  );

  blocker.enableBlockingInSession(mainWindow.webContents.session);

  blocker.on('request-blocked', (request) => {
    console.log('blocked', request.tabId, request.url);
  });
  blocker.on('request-redirected', (request) => {
    console.log('redirected', request.tabId, request.url);
  });
  blocker.on('request-whitelisted', (request) => {
    console.log('whitelisted', request.tabId, request.url);
  });
  blocker.on('csp-injected', (request) => {
    console.log('csp', request.url);
  });
  blocker.on('script-injected', (script, url) => {
    console.log('script', script.length, url);
  });
  blocker.on('style-injected', (style, url) => {
    console.log('style', style.length, url);
  });

 await mainWindow.loadFile('src/index.html');

  var v = null

  switch (config.DISCORD_BUILD.toLowerCase()) {
    case 'stable':
      v = 'Stable';
      break;
    case 'ptb':
      v = 'PTB';
      break;
    case 'canary':
      v = 'Canary';
  }

 console.log("WELCOME TO DISCORD UNSPY!")
 console.log(`VERSION ${version} ${v}`)
 console.log("this version blocks trackers from discord! ")
 console.log("bellow,you will see the requests that are being blocked. Thx for using unspy!")

 var splash = new BrowserWindow({
    width: 300,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });

  splash.loadFile('src/splash.html');
  splash.center();
  setTimeout(function () {
    splash.close();
    mainWindow.center();
    mainWindow.show();
  }, 55765);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createWindow();

  let build = null;

  switch (config.DISCORD_BUILD.toLowerCase()) {
    case 'stable':
      build = 'Stable';
      break;
    case 'ptb':
      build = 'PTB';
      break;
    case 'canary':
      build = 'Canary';
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: `Discord Unspy ${version} ${build} by Ashley` },
    {
      label: 'Source code',
      click: async () => {
        await shell.openExternal('https://github.com/iamashley0/Discord');
      }
    },
    {
      label: 'Issues',
      click: async () => {
        await shell.openExternal(
          'https://github.com/iamashley0/Discord/issues'
        );
      }
    },
    {
      label: 'Pull requests',
      click: async () => {
        await shell.openExternal(
          'https://github.com/iamashley0/discord-desktop/pulls'
        );
      }
    },
    {
      label: "Quit from App (Don't :c)",
      click: () => {
        app.quit();
      }
    }
  ]);

  const tray = new Tray('src/icons/discord.png');
  tray.setToolTip('Super duper secret Discord menu LMAO');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });
});

const isMac = process.platform === 'darwin';

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) app.quit();
});

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) await createWindow();
});

ipcMain.on('titlebar', (_, arg) => {
  switch (arg) {
    case 'cls':
      mainWindow.hide();
      break;
    case 'min':
      mainWindow.minimize();
      break;
    case 'max':
      mainWindow.maximize();
      break;
    case 'res':
      mainWindow.restore();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ role: 'about' }, { role: 'quit' }]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'Discord NoSpy 5',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
