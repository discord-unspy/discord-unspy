const { ipcRenderer } = require('electron');

function titlebar(params) {
  switch (params) {
    case 'cls':
      ipcRenderer.send('titlebar', 'cls');
      break;
    case 'min':
      ipcRenderer.send('titlebar', 'min');
      break;
    case 'max':
      ipcRenderer.send('titlebar', 'max');
      document.body.className = 'maximized';
      break;
    case 'res':
      ipcRenderer.send('titlebar', 'res');
      document.body.className = 'none';
  }
};
