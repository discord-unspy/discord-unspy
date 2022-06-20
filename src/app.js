const main = document.getElementById('main');
const app = document.createElement('webview');

const config = require('../config.json');

let src = null;

switch (config.DISCORD_BUILD.toLowerCase()) {
  case 'stable':
    src = 'https://discord.com/app';
    break;
  case 'ptb':
    src = 'https://ptb.discord.com/app';
    break;
  case 'canary':
    src = 'https://canary.discord.com/app';
    break;
  default:
    throw new Error(`Unknown Discord build: ${config.DISCORD_BUILD} (maybe change it to stable?)`);
}

app.setAttribute('id', 'app');
app.setAttribute('src', src);
main.appendChild(app);
