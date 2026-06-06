
global.botStatus = global.botStatus || {} // Asegura que exista

let handler = async (m, { args, command, isOwner}) => {
  const chatId = m.chat

  if (!isOwner) {
    return m.reply('🚫 Solo mi dueño puede usar este comando.')
}

  if (!args[0]) {
    return m.reply(`⚙️ Usa:\n\n${command} on  – para activar el bot\n${command} off – para desactivarlo`)
}

  const option = args[0].toLowerCase()

  if (option === 'on') {
    global.botStatus[chatId] = true
    m.reply('✅ Bot activado en este grupo.')
} else if (option === 'off') {
    global.botStatus[chatId] = false
    m.reply('🛑 Bot desactivado en este grupo.')
} else {
    m.reply('❓ Opción no válida. Usa "on" o "off".')
}
}

handler.help = ['bot <on/off>']
handler.tags = ['owner']
handler.command = /^bot$/i
handler.group = true
handler.rowner = true

export default handler