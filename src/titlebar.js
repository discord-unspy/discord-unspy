const { ipcRenderer } = require('electron')
function titlebar(params) {
    
    if (params == "cls") {
        ipcRenderer.send('titlebar', 'cls')
    }
    if (params == "min") {
        ipcRenderer.send('titlebar', 'min')
    }
    if (params == "max") {
        ipcRenderer.send('titlebar', 'max')
        document.body.className = "maximized"
    }
    if (params == "res") {
        ipcRenderer.send('titlebar', 'res')
        document.body.className = "none"
    }
}
