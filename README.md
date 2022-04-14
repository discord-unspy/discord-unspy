<div align="center">

<img height="200" src="https://discord.com/assets/3437c10597c1526c3dbd98c737c2bcae.svg"/>

# Discord Unspy Edition

**Discord's Electron client,now whit built in tracker blocker!**
</div>
 
 
# INSTALL-RUN

To run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:
```bash
# Clone this repository
git clone https://github.com/iamashley0/discord-unspy/
# Go into the repository
cd discord-unspy
# Install dependencies
npm install
# Run the app
npm start
```
If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

# How to use discord ptb/canary?
1.Go to line 54 <a href="https://github.com/iamashley0/discord-unspy/blob/main/src/main.js#L54">of main.js</a><br>
2.change config.DISCORD_CLIENT_URL to config.DISCORD_CLIENT_PTB if you want to use ptb,change it to config.DISCORD_CLIENT_CANARY if you wanna use canary <br>
3.theres no step 3 lmao<br>

# Change the user agent string:
Changing the user agent script is actully simple,on config.json There should be a string called "UserAgent" and if you change it,the browsers user agent should change >~<

# NOTE
This is just a browser that blocks the ads and potential spyware in Discord, this doesn't actually modify the Discord client itself,so this is not against discords tos
