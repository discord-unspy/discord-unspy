const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const { readFile, writeFile } = require('node:fs/promises');
const { autoUpdater } = require('electron-updater');
const path = require('path');

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
      // GNU/Linux, ChromeOS, or whatever
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
    console.log('[BLOCKED]', request._originalRequestDetails.method, request.url);
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
    console.log('script size of ', script.length, "loaded", url);
  });
  blocker.on('style-injected', (style, url) => {
    console.log('style size of', style.length, "loaded" , url);
  });

 await mainWindow.loadFile('src/index.html');


  // versions
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
 console.log("=========== IMPORTANT ========")
 console.log("Please note that this is just a browser that blocks the ads and potential spyware in Discord, this doesn't actually modify the Discord client itself, so this is not against Discord's ToS.so basicly,this is illegal as using ublock origin whit discord web app. we are not discord,and this is not a offical app.")
 console.log(`Unspy is not a client "modification". this does not modify the discord app itself. this just embeds (see src/index.html) the publicly avalible (https://discord.com/app) discord web app and uses a electron package called "electron-adblocker". this does not modify the discord client,and this is not a client its more of a "browser". `)
console.log("=========== IMPORTANT END ========")
console.log("=========== LOG START ========")

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
  async function createAboutWindow () {
  // Define our child window size
  childWindow = new BrowserWindow({
    height: 400,
    width: 600,
    show: false,
    minimizable: false,
    maximizable: false,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });


 childWindow.webContents.on("new-window", function(event, url) {
  event.preventDefault();
  shell.openExternal(url);
});

  childWindow.removeMenu();

  childWindow.loadURL(`file://${__dirname}/about-popup.html`);
  childWindow.webContents.on('dom-ready', () => {
    childWindow.show();
  });
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: `Discord Unspy ${version} ${build}` },
    {
      label: 'Whats new?',
      click: async () => {
        await shell.openExternal(`https://github.com/iamashley0/discord-desktop/releases/tag/${version}`);
      }
    },

      {
      label: 'Open PokeTube',
      click: async () => {
        await shell.openExternal(`https://poketube.fun`);
      }
    },
        {
      label: 'About',
      click: async () => {
          createAboutWindow();
        }
    },
    {
      label: "Quit from Unspy (Don't :c)",
      click: () => {
        app.quit();
      }
    }
  ]);

  // yes, i know this code is trash
  var trayicon = config.SYSTEM_TRAY_ICON.toLowerCase()
  var colorlist = config.DISCORD_PRODUCT_COLOR_LIST
  if(!colorlist.includes(trayicon)) trayicon = "white"
  const tray = new Tray(`src/icons/systemtray/png/${trayicon}.png`);
  tray.setToolTip('Super duper secret menu LMAO');
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
  if (mainWindow === null) {
    createWindow();
  }
  if (childWindow === null) {
    createAboutWindow();
  }
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
    label: `Discord UnSpy ${build} ${version}`,
    submenu: [isMac ? { role: 'close' } : { role: 'quit' },{
      role:'help',
      click: () => {
        shell.openExternal('https://support.discord.com');
       },
    }]
  },
  // { role: 'viewMenu' }
  {
    label: 'Misc.',
    submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'zoomIn'}, { role: 'zoomOut'},{role:'resetZoom'}]
  },
    {
    label: 'Edit',
    submenu: [{ role: 'copy' }, { role: 'paste' }, {role:'pasteAndMatchStyle'},{ role: 'cut'},{role:'delete'}, { role: 'selectAll'}]
  },
    {
    label: 'Utils',
    submenu: [{ role: 'showSubstitutions' }, {role:'hide'},{ role: 'unhide'},{role:'hideOthers'}, { role: 'toggleSpellChecker'}]
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
