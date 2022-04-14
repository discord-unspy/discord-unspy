const main = document.getElementById('main')
const app = document.createElement("webview");
const config = require('../config.json');

if (config.DISCORD_VERSION == "Stable") {
    app.setAttribute("id", "app");
     app.setAttribute("src", "https://discord.com/app");
    main.appendChild(app);
}
if (config.DISCORD_VERSION == "PTB") {
    app.setAttribute("id", "app");
    app.setAttribute("src", "https://ptb.discord.com/app");
    main.appendChild(app);
}
if (config.DISCORD_VERSION == "Canary") {

    app.setAttribute("id", "app");
    app.setAttribute("src", "https://canary.discord.com/app");
    main.appendChild(app);
}
app.addEventListener('dom-ready', function () {
setInterval(() => {
        app.insertCSS(`
        @import url('https://kaxozae.xyz/css/discord-kax-themev6.css')
        `);
}, 20000);
});
