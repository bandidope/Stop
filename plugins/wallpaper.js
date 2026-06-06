/*
This is free and unencumbered code released into the public domain. Do whatever you want.
*/



import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    await m.react('🕒')

    const query = text || 'nature'
    const apiKey = '54924806-f3dbf063a8f732bda7f60d460'
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=vertical&per_page=20`

    const response = await fetch(url)
    const res = await response.json()

    if (!res?.hits || res.hits.length === 0) {
      await m.react('❌')
      return conn.reply(m.chat, `> ⍰ Sin resultados para: *${query}*`, m)
    }

    const image = res.hits[Math.floor(Math.random() * res.hits.length)]

    let report = `*── 「 WALLPAPER HD 」 ──*\n\n`
    report += `> 👤 *Autor:* ${image.user}\n`
    report += `> 🏷️ *Tags:* ${image.tags}\n\n`
    report += `*❯ Proveedor:* Pixabay`

    await conn.sendMessage(m.chat, { 
      image: { url: image.largeImageURL }, 
      caption: report 
    }, { quoted: m })

    await m.react('✅')

  } catch (error) {
    console.error(error)
    await m.react('❌')
  }
}

handler.help = ['wallpaper2', 'wp2', 'hd3']
handler.tags = ['fun']
handler.command = /^(wallpaper2|wp2|hd3)$/i

export default handler