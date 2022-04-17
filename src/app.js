const main = document.getElementById('main');
const app = document.createElement('webview');

const config = require('../config.json');

let src = null;

switch (config.DISCORD_BUILD.toLowerCase()) {
  case 'stable':
    // https://github.com/iamashley0/discord-desktop/issues/6
    src = 'https://ptb.discord.com/app';
    break;
  case 'ptb':
    src = 'https://ptb.discord.com/app';
    break;
  case 'canary':
    src = 'https://canary.discord.com/app';
    break;
  default:
    throw new Error(`Unknown Discord build: ${config.DISCORD_BUILD}`);
}

app.setAttribute('id', 'app');
app.setAttribute('src', src);
main.appendChild(app);