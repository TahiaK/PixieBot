# PixieBot
<p align="center">
  A Telegram bot built using Node.js. This is a cat themed timer bot which can be used to activate multiple timers. This bot uses the Telegraf API in version 3.25.5. 

## Demos
  Timer Demo             |  Commands Demo
:-------------------------:|:-------------------------:
![](/demos/demo-1.gif)  |  ![](/demos/demo-2.gif)
## Commands
  * `/start` - shows a few commands option.
  * `/help` - a description on all available commands and how the bot functions.
  * `/status <session name> || null` - returns the time left of all timers or a specific timer.
  * `/clear` - clears all sessions.
  * `/1 - /999 <session name> || null` - sets the timer based on inputted minutes. Time will be showed in format: 00:00:00.
  * `/bongo` - sends back random bongo cat gifs.
  
 ## Get Started
  * Clone this repo and then install the package using `npm install` in the terminal.
  * To start the bot, run `npm start`
