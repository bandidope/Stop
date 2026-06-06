// By WillZek 
// https://github.com/WillZek

const handler = async (m, { conn, args, participants, usedPrefix, command }) => {

let user = args[0]?.replace(/[^0-9]/g, '')

if (!user && m.quoted) user = m.quoted.sender?.replace(/[^0-9]/g, '')
else if (!user && m.mentionedJid?.length) user = m.mentionedJid[0]?.replace(/[^0-9]/g, '')

if (!user) return m.reply(`🪐 Indique el número, responda al mensaje o mencione al usuario.\n*Ejemplo:* ${usedPrefix + command} 50557865603`);

const jid = user + '@s.whatsapp.net'
const settings = global.db.data.settings[conn.user.jid] || {}
settings.actives = settings.actives || []

if (!settings.actives.includes(jid)) {
return m.reply(`🪐 @${user} no es un subbot premium`, null, { mentions: [jid] })
}

settings.actives = settings.actives.filter(j => j !== jid)
m.reply(`🪐 Subbot premium eliminado: @${user}`, null, { mentions: [jid] })
}

handler.command = /^delpremsub$/i
handler.rowner = true

export default handler