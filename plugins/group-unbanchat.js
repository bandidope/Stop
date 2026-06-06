let handler = async (m, { conn, isAdmin, isROwner} ) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    
    global.db.data.chats[m.chat].isBanned = false
    
    let txt = `✨ *SISTEMA REACTIVADO* ✨\n\n`
        txt += `✅ *El Bot ha sido desbloqueado.*\n`
        txt += `📦 *Estado:* Operativo en este grupo\n`
        txt += `🛡️ *Acción por:* @${m.sender.split`@`[0]}`

    await conn.reply(m.chat, txt, m, { mentions: [m.sender] })
    await m.react('⚙️')
}

handler.help = ['desbanearbot']
handler.tags = ['group']
handler.command = ['desbanearbot', 'unbanchat']
handler.group = true 

export default handler
