
import fetch from 'node-fetch' // Puedes quitarlo si no usas fetch en este archivo

const handler = async (m, { conn, text, command, usedPrefix}) => {
  // ✅ IDs de canales configurados
  const channelIds = [
    '120363419947391620@newsletter',
    '120363419947391620@newsletter'
  ]

  const message = text?.trim()
  if (!message) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <mensaje>\n📍 *Ejemplo:* ${usedPrefix + command} Este es un aviso importante`)
}

  let failed = 0

  await Promise.all(channelIds.map(async id => {
    try {
      await conn.sendMessage(id, { text: message}, { quoted: m})
} catch (e) {
      console.error(`❌ Error al enviar al canal ${id}:`, e)
      failed++
}
}))

  const success = channelIds.length - failed
  m.reply(`✅ *Mensaje enviado a ${success} canal(es).*${failed? ` ❌ Falló en ${failed}.`: ''}`)
}

handler.help = ['avisocanal <mensaje>']
handler.tags = ['admin']
handler.command = /^avisocanal$/i
handler.owner = true

export default handler