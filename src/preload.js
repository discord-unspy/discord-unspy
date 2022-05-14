// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { version } = require('../package.json');
const config = require('../config.json');

switch (config.DISCORD_BUILD.toLowerCase()) {
    case 'stable':
      build = '';
      break;
    case 'ptb':
      build = 'PTB';
      break;
    case 'canary':
      build = 'CNRY';
}

window.addEventListener('DOMContentLoaded', () => {
  for (const type of ['chrome', 'node', 'electron']) {
    const element = document.getElementById(`${type}-version`);
    if (element !== null) element.innerText = process.versions[type];
  }
    for (const type of ['os', 'distro', 'platform']) {
    const element = document.getElementById(`${type}-type`);
    if (element !== null) element.innerText = process.platform.toUpperCase()
  }
   for (const type of ['package']) {
    const element = document.getElementById(`${type}-version`);
    if (element !== null) element.innerText = version
  }
     for (const type of ['BUILD']) {
    const element = document.getElementById(`${type}`);
    if (element !== null) element.innerText = build
  }
});
