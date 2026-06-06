
const handler = async (m, { conn, text, command, usedPrefix}) => {
  // Lista de IDs de canales (puedes agregar más)
  const channelIds = [
    '120363419947391620@newsletter', // Reemplaza con el ID real del canal
    '120363419947391620@newsletter'  // Otro canal opcional
  ]

  if (!text) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <mensaje>\n📍 *Ejemplo:* ${usedPrefix + command} Este es un aviso importante`)
}

  for (const id of channelIds) {
    try {
      await conn.sendMessage(id, { text}, { quoted: m})
} catch (e) {
      console.error(`❌ Error al enviar al canal ${id}:`, e)
}
}

  m.reply(`✅ *Mensaje enviado a ${channelIds.length} canal(es).*`)
}

handler.help = ['avisocanal <mensaje>']
handler.tags = ['admin']
handler.command = /^avisocanal$/i
handler.owner = true // Solo el dueño puede usar este comando

export default handler