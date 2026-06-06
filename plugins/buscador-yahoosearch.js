import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  try {
    if (!text) return conn.reply(m.chat, '💥 Por favor, proporciona una consulta de búsqueda.', m)
    await m.react('🕒')

    const apiUrl = `https://api.delirius.store/yahoo?query=${encodeURIComponent(text)}&language=en`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.data?.length) throw '⚠ No se encontraron resultados.'

    // Solo mostrar las descripciones
    const results = json.data.map((item, i) => 
      `🔎 *Resultado ${i+1}:*\n${item.description}`
    ).join('\n\n')

    await conn.reply(m.chat, `> 📡 *Resultados de YahooSearch para:* ${text}\n\n${results}`, m)
    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, typeof e === 'string' ? e : '⚠ Ocurrió un error al procesar la búsqueda.', m)
  }
}

handler.command = handler.help = ['yahoosearch']
handler.tags = ['buscador']
handler.group = false

export default handler