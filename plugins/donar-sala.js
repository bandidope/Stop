let toM = a => '@' + a.split('@')[0]

function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    
    let message = `
╭──〔 *⚡ Arceus Whois  ⚡* 〕──╮
│
│ 🤺 *Elección De Sala*
│
│ 👤 ${toM(a)}
│
│ 📝 _Bebe, busca la salita que ya_
│ _viene el vs. ¡No te hagas el loco!_ 📌
│
╰───────────────────────────╯`.trim()

    m.reply(message, null, {
        mentions: [a]
    })
}

handler.help = ['donarsala']
handler.tags = ['freefire']
handler.command = ['donarsala', 'sala']
handler.group = true 

export default handler
