let handler = async (m, { conn, isAdmin, isROwner }) => {
    if (!(isAdmin || isROwner)) return dfail('admin', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    let txt = `
╭╾━━━━╼ 〔 ⚡ 〕 ╾━━━━╼╮
│  👟 *𝕶𝖊𝖎𝖘𝖙𝖔𝖕 𝕭𝖔𝖙 𝕺𝖋𝖋𝖑𝖎𝖓𝖊*
│
│ 𝖤𝗌𝗍𝖾 𝖼𝗁𝖺𝗍 𝗁𝖺 𝗌𝗂𝖽𝗈 𝖽𝖾𝗌𝖺𝖼𝗍𝗂𝗏𝖺𝖽𝗈.
│ 𝖤𝗅 𝖻𝗈𝗍 𝗇𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝖾𝗋𝖺́ 𝗁𝖺𝗌𝗍𝖺 
│ 𝗌𝖾𝗋 𝗁𝖺𝖻𝗂𝗅𝗂𝗍𝖺𝖽𝗈 𝗇𝗎𝖾𝗏𝖺𝗆𝖾𝗇𝗍𝖾.
╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯
*𝕶𝖊𝖎𝖘𝖙𝖔𝖕 𝕭𝖔𝖙 • 𝕾𝖞𝖘𝖙𝖊𝖒*`.trim()

    await conn.reply(m.chat, txt, m, rcanal)
    await m.react('⚡')
}
handler.help = ['banearbot']
handler.tags = ['group']
handler.command = ['banearbot', 'banchat']
handler.group = true 
export default handler
