import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 Ejemplo: .${command} Lisa`)

  try {
    // 1. Buscar packs en StickerWiki
    const searchRes = await fetch(`https://api.delirius.store/search/stickerwiki?query=${encodeURIComponent(text)}`)
    const searchJson = await searchRes.json()

    if (!searchJson.status || !searchJson.data || searchJson.data.length === 0) {
      return m.reply('❌ No se encontraron packs de stickers con ese nombre.')
    }

    // Elegir un pack aleatorio de los resultados
    const packSeleccionado = searchJson.data[Math.floor(Math.random() * searchJson.data.length)]
    const packTitle = packSeleccionado.title || 'Sticker Pack'

    m.reply(`🎉 Pack encontrado: *${packTitle}*\n📦 Extrayendo stickers...`)

    // 2. Descargar los stickers del pack usando la URL obtenida
    const downloadRes = await fetch(`https://api.delirius.store/download/stickerwiki?url=${encodeURIComponent(packSeleccionado.url)}`)
    const downloadJson = await downloadRes.json()

    // En StickerWiki, la lista de stickers viene en data.sticker (según tu ejemplo)
    const stickerList = downloadJson.data.sticker

    if (!downloadJson.status || !stickerList || stickerList.length === 0) {
      return m.reply('⚠️ No se pudieron obtener los stickers de este pack.')
    }

    // Enviar los primeros 5 stickers
    const stickersToSend = stickerList.slice(0, 5)

    for (const stickerUrl of stickersToSend) {
      const sticker = new Sticker(stickerUrl, {
        pack: packTitle, 
        author: 'Delirius API',
        type: 'full',
        categories: ['🤩'],
        id: `wiki-${Date.now()}`
      })
      
      const buffer = await sticker.toBuffer()
      await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al procesar la solicitud.')
  }
}

handler.help = ['stickerwiki <consulta>']
handler.tags = ['sticker']
handler.command = /^(stickerwiki|swiki)$/i

export default handler
