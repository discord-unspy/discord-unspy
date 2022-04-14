 const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const fetch = require('node-fetch');
const { readFile, writeFile } = require('node:fs/promises');
const config = require('../config.json');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow () {
    // Create the browser window.
    const { ElectronBlocker, fullLists, Request }= await import ('@cliqz/adblocker-electron'); // eslint-disable-line
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        frame: false,
        backgroundColor: '#FFF',
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
    
    // and load the index.html of the app.
    mainWindow.loadFile('src/index.html');

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
app.on('ready', function() {
    createWindow()
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Discord ' + config.DISCORD_VERSION,  },
        { label: 'Quit Discord ' + config.DISCORD_VERSION, click:  function(){
            app.quit();
        } }
    ]);
    tray = new Tray('src/icons/discord.png')
    tray.setToolTip('Super Duper secret menu lmao ')
    tray.setContextMenu(contextMenu)
    tray.on('click', function(){
        mainWindow.show();
    })
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
ipcMain.on('titlebar', (event, arg) => {
    if (arg == "cls") {
        mainWindow.hide();
    }
    if (arg == "min") {
        mainWindow.minimize();
    }
    if (arg == "max") {
        mainWindow.maximize();
    }
    if (arg == "res") {
        mainWindow.restore();
    }
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
