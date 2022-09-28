const Telegraf = require('telegraf')
const pixie = require('./bot')
const TelegrafI18n = require('telegraf-i18n')
const path = require("path");
const session = require('telegraf/session') // valid only for Telegraf version 3.25.5

const bot = new Telegraf('5432534985:AAFfblI7iKFgBYyz59drwtbwFYtc_PNUATY')
bot.use(session())

// usage of files in locales
const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: true,
  directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())


let regex = /^\/\d{1,3}/
let status = /\/status/

bot.command((ctx) => {

  let msg = ctx.message.text

  if (regex.test(msg) ) {


    let match = msg.match(regex)
    let label = msg.substring(match[0].length).trim() || ""
    let time = parseInt(match[0].substring(1))
    
    
    console.log(`Message from user: 
    ${msg} \n`)

    pixie.startTimer(ctx, bot, time, label)
    //ctx.parse_mode

  } else if (status.test(msg) ) {
    let statusMatch = msg.match(status)
    let statusLabel = msg.substring(statusMatch[0].length).trim() || ""
    console.log(`statusLabel: ${statusLabel} \n`)
    pixie.getStatus(ctx, statusLabel)
    
  } else if (msg === '/clear') {
    pixie.clear(ctx)

  } else if (msg === '/help') {
    bot.telegram.sendMessage(ctx.chat.id, 
      text = ctx.i18n.t('help'),
      {parse_mode: 'HTML'})

  } else if (msg === '/start') {
    bot.telegram.sendMessage(ctx.chat.id, 
      text = ctx.i18n.t('start'),
      {parse_mode: 'HTML'})

  } else if (msg === '/bongo') {
    pixie.randomGif(ctx, bot)

  } else ctx.reply("Sorry didn't get that.")
  
})


bot.catch((err) => {
  console.log('Error:', err)
})

bot.launch()