import fetch from 'node-fetch'
 
let handler = async (m, { text, conn, command }) => {
  try {
    if (!text) return m.reply('¡Ingresa una palabra clave para buscar videos de TikTok!\nEjemplo: .ttsearch tobrut')
 
    await conn.sendMessage(m.chat, { react: { text: "⏰", key: m.key }})
 
    let res = await fetch(`https://www.sankavolereii.my.id/search/tiktok?apikey=planaai&q=${encodeURIComponent(text)}`)
    let json = await res.json()
    if (!json.status || !json.result.length) return m.reply('❌ No se encontraron resultados.')
 
    let random = json.result[Math.floor(Math.random() * json.result.length)]
    let {
      title,
      duration,
      play,
      digg_count,
      comment_count,
      share_count,
      author
    } = random
 
    let caption = `🎬 *${title}*\n👤 *${author.nickname}* (@${author.unique_id})\n⏱️ *Duración:* ${duration}s\n❤️ *Me gusta:* ${digg_count.toLocaleString()}\n💬 *Comentarios:* ${comment_count.toLocaleString()}\n🔁 *Compartir:* ${share_count.toLocaleString()}`
 
    let sent = await conn.sendFile(m.chat, play, 'tiktok.mp4', caption, m)
 
  } catch (e) {
    console.log(e)
    m.reply(`❌ Error\nRegistro de error: ${e.message || e}`)
  }
}
 
handler.help = ['ttsearch <consulta>']
handler.tags = ['buscador']
handler.command = ['ttsearch', 'tiktoksearch']
 
export default handler
