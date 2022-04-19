const { ipcRenderer } = require('electron');

// eslint-disable-next-line no-unused-vars
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
}

const htmlElement = document.documentElement;

switch (process.platform) {
  case 'darwin':
    htmlElement.className = 'Mac';
    break;
  case 'win32':
    htmlElement.className = 'Windows';
    break;
  case 'linux':
    htmlElement.className = 'Linux';
}

document.addEventListener('click', (event) => {
  const { target } = event;

  if (
    typeof target.getAttribute === 'function' &&
    target.getAttribute('data-action') === 'switch-os'
  ) {
    event.preventDefault();

    htmlElement.className = target.getAttribute('data-os');
  }
});
