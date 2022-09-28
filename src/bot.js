
let noSession = true
let m_activeContexts = {}

// stop timer
function stopTimer (ctx) {
    var sessionKey = getSessionKey(ctx);
    var interval = m_activeContexts[sessionKey]
    clearInterval(interval)
    m_activeContexts[sessionKey] = null
    ctx.session.canEdit = false
    ctx.session.timers = []
    noSession = true
}

// clear timers
function clear (ctx) {
    noSession = true
    ctx.reply('Cleared.')
    console.log('Sessions cleared. \n');
    stopTimer(ctx)
}

//start timer
function startTimer (ctx, bot, time, label) {
    ctx.reply(`Look out for a meow in ${time} minute(s)!`)

    let timers = ctx.session.timers || []
    let stime = time * 60 * 1000 // time in seconds
    let now = Date.now()
    let end = now + stime

    timers.push({ time: stime, label: label, created: now, end: end, invalidated: false })
    ctx.session.timers = timers

    var sessionKey = getSessionKey(ctx)
    

        if (m_activeContexts[sessionKey] == null) {
            m_activeContexts[sessionKey] = setInterval(function () {
                var reply = '';
                var invalidatedCount = 0;

                //for each timer replies.
                // if timer < 0 stop and no more count in the reply.
                ctx.session.timers.forEach(t => {
                let timeRest = t.end - Date.now()

                if (timeRest <= 0) {
                    if (!t.invalidated) {
                        t.invalidated = true
                        bot.telegram.sendAnimation(ctx.chat.id, 
                            animation = 'https://c.tenor.com/X2-TBdfI-6kAAAAC/bongo-cat-feed-me.gif', 
                            {caption: `${t.label} timer is done! Give me a snack.`})
                    }
                }

                reply += ('\n' + (t.invalidated ? '00:00' : millisToMinutesAndSeconds(timeRest)) + (t.label.length > 0 ? ` — ${t.label}` : '') + (t.invalidated ? ' 😼' : ''))

                if (t.invalidated) {
                    ++invalidatedCount
                }
            })

            if (reply.length > 0) {
                if (ctx.session.canEdit) {
                    ctx.telegram.editMessageText(ctx.session.editMessageChatId, ctx.session.editMessageId, ctx.session.editInlineMessageId, reply)
                }
                else {
                    ctx.reply(reply).then((replyCtx) => {
                        ctx.session.editMessageId = replyCtx.message_id
                        ctx.session.editInlineMessageId = replyCtx.inline_message_id
                        ctx.session.editMessageChatId = replyCtx.chat.id
                        ctx.session.canEdit = true
                    })
                }
            }

            if (invalidatedCount == ctx.session.timers.length) {
                stopTimer(ctx)
            }

        }, 1000)
    }
    
    noSession =  false

}


function getStatus (ctx, label) {
    if (noSession) {
        ctx.reply("No session going on right now 🙊")
    } else if (!noSession) {
        let statusReply = ""
        
        if (label == "") { //returns all for /status
            ctx.session.timers.forEach(t => {

                elapsedTime = millisToMinutesAndSeconds(t.end - Date.now())
                if (t.label == "") {
                    statusReply += ('\n' + `${elapsedTime} time left.`)
                } else statusReply += ('\n' + `${t.label} is running with ${elapsedTime} time left.`)          
            })

            ctx.reply(statusReply)

        } else { //returns for /status ____
            ctx.session.timers.forEach(t => {
                
                if (t.label == label) {
                    
                    elapsedTime = millisToMinutesAndSeconds(t.end - Date.now())
                    ctx.reply(`${t.label} has ${elapsedTime} time left.`)
                } 
            })
        }

    }
}

function getSessionKey(ctx) {
    if (ctx.from && ctx.chat) {
        return `${ctx.from.id}:${ctx.chat.id}`
    } else if (ctx.from && ctx.inlineQuery) {
        return `${ctx.from.id}:${ctx.from.id}`
    }
    return null
}

function millisToMinutesAndSeconds(milliseconds) {
    
    milliseconds = Math.abs(milliseconds)
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    
    return (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function randomGif (ctx, bot) {
    let gif
    let random = Math.floor(Math.random()*13)+1

    switch (random) {
        case 1: gif = 'https://64.media.tumblr.com/ccfc277b8368ae0ce4c2d7c33643e50b/3ee46f8d2e88ac6c-eb/s400x600/2f0a7d8f1aa1d80e7d281b48f2c67b11a7de82db.gif'; break;
        case 2: gif = 'https://thumbs.gfycat.com/DescriptiveAnxiousHuia-size_restricted.gif'; break;
        case 3: gif = 'https://art.pixilart.com/2f828f535045ae8.gif'; break;
        case 4: gif = 'https://img.itch.zone/aW1nLzE1MzgwMTMuZ2lm/original/lvcuvN.gif'; break;
        case 5: gif = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2458acd1-3637-4077-8f48-2f24c52200e4/dcsvqve-df0b2e5e-21aa-49a8-bb9c-994b4024f5af.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI0NThhY2QxLTM2MzctNDA3Ny04ZjQ4LTJmMjRjNTIyMDBlNFwvZGNzdnF2ZS1kZjBiMmU1ZS0yMWFhLTQ5YTgtYmI5Yy05OTRiNDAyNGY1YWYuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Kd7yOiur-gDpYi1mioO5mwclq7b3vsiFbigEhSd3xO4'; break;
        case 6: gif = 'https://laughingsquid.com/wp-content/uploads/2020/08/Bongo-Cat-in-Space.gif'; break;
        case 7: gif = 'https://thumbs.gfycat.com/UntimelyBasicEyas-size_restricted.gif'; break;
        case 8: gif = 'https://steamuserimages-a.akamaihd.net/ugc/959739316707647494/7D95C990F5341A9FC2CBC2A9CA0F0FFE7561C9F0/'; break;
        case 9: gif = 'https://c.tenor.com/wm7HkUKYS4YAAAAC/cat-bongo.gif'; break;
        case 10: gif = 'https://c.tenor.com/TslKaIngNn8AAAAC/bongo-cat-tapping-keyboard.gif';  break;
        case 11: gif = 'https://thumbs.gfycat.com/CluelessEuphoricAngora-max-1mb.gif'; break;
        case 12: gif = 'https://img.itch.zone/aW1nLzE1MzgxODkuZ2lm/original/Em52Nd.gif'; break;
        case 13: gif = 'https://c.tenor.com/DBqjevyA2o4AAAAd/bongo-cat-codes.gif'; break;

        default:
            break;
    }

    bot.telegram.sendAnimation(ctx.chat.id, 
        animation = gif)
}

module.exports = {
    randomGif,
    clear,
    startTimer,
    getStatus,
}