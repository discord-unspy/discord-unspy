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
};

var htmlElement=document.documentElement;if(navigator.platform.match(/(Mac)/i)){htmlElement.className='Mac'}
if(navigator.platform.match(/(Linux)/i)){htmlElement.className='Linux'}else{htmlElement.className='Windows'}
document.addEventListener('click',function(event){var target=event.target;if(target.getAttribute&&target.getAttribute('data-action')==='switch-os'){event.preventDefault();htmlElement.className=target.getAttribute('data-os')}})