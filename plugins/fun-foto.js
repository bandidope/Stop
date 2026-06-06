import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 Ejemplo: .${command} My Melody`)

  try {
    // Buscar packs en la API de Delirius
    const searchRes = await fetch(`https://api.delirius.store/search/stickerly?query=${encodeURIComponent(text)}`)
    const searchJson = await searchRes.json()

    if (!searchJson.status || !Array.isArray(searchJson.data) || searchJson.data.length === 0) {
      return m.reply('❌ No se encontraron stickers.')
    }

    // Elegir un pack aleatorio
    const pick = searchJson.data[Math.floor(Math.random() * searchJson.data.length)]
    const packName = pick.name || 'Sin nombre'
    const authorName = pick.author || 'Desconocido'

    m.reply(`🎉 Pack encontrado: *${packName}* de *${authorName}*\n📦 Enviando 5 stickers...`)

    // Descargar stickers del pack
    const downloadRes = await fetch(`https://api.delirius.store/download/stickerly?url=${encodeURIComponent(pick.url)}`)
    const downloadJson = await downloadRes.json()

    if (!downloadJson.status || !downloadJson.data || !Array.isArray(downloadJson.data.stickers)) {
      return m.reply('⚠️ No se pudieron descargar stickers.')
    }

    // Enviar máximo 5 stickers
    const stickersToSend = downloadJson.data.stickers.slice(0, 5)

    for (let i = 0; i < stickersToSend.length; i++) {
      const sticker = new Sticker(stickersToSend[i], {
        pack: packName,
        author: authorName,
        type: 'full',
        categories: ['🔥'],
        id: `delirius-${i}`
      })
      const buffer = await sticker.toBuffer()
      await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al procesar los stickers.')
  }
}

handler.help = ['stikerly <consulta>']
handler.tags = ['sticker']
handler.command = /^stikerly$/i

export default handler