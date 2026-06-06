import axios from 'axios'
import cheerio from 'cheerio'

async function buscarGrupos(palabrasClave) {
  const encabezados = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Referer": "https://groupda1.link/add/group/search",
    "Accept-Language": "es-ES,es;q=0.9",
    "Accept": "text/html, */*; q=0.01",
    "Host": "groupda1.link",
    "Origin": "https://groupda1.link",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

  const resultados = []
  const listaPalabras = palabrasClave.split(',')

  for (const nombre of listaPalabras) {
    const palabra = nombre.trim()
    let pagina = 0

    while (pagina < 10) {
      const datos = new URLSearchParams({
        group_no: `${pagina}`,
        search: true,
        keyword: palabra,
        category: "Any Category",
        country: "Indonesia",
        language: "Bahasa Apa Pun"
})

      try {
        const respuesta = await axios.post(
          "https://groupda1.link/add/group/loadresult",
          datos.toString(),
          { headers: encabezados, timeout: 10000}
)

        const html = respuesta.data
        if (!html || html.length === 0) break

        const $ = cheerio.load(html)
        let encontrado = false

        for (const div of $('.maindiv').toArray()) {
          const enlace = $(div).find('a[href]')
          if (!enlace.length) continue

          const url = enlace.attr('href')
          const titulo = enlace.attr('title').replace('Whatsapp group invite link: ', '')
          const descripcionTag = $(div).find('p.descri')
          const descripcion = descripcionTag.text().trim() || 'Sin descripción'
          const idGrupo = url.split('/').pop()
          const enlaceGrupo = `https://chat.whatsapp.com/${idGrupo}`

          if (!resultados.some(g => g.Codigo === idGrupo)) {
            resultados.push({
              Nombre: titulo,
              Codigo: idGrupo,
              Enlace: enlaceGrupo,
              Descripcion: descripcion,
              PalabraClave: palabra
})
            encontrado = true
}
}

        if (!encontrado) break
        pagina++
        await new Promise(resolve => setTimeout(resolve, 1000))
} catch (error) {
        console.error(`Error en la página ${pagina + 1}: ${error.message}`)
        break
}
}
}

  return resultados
}

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) return m.reply(`❗ Ingresa palabras clave separadas por comas.\nEjemplo:\n${usedPrefix + command} anime, música, fútbol`)

  const chatId = typeof m.chat === 'string'? m.chat: String(m.chat || '')
  await conn.reply(chatId, `🔍 Buscando grupos relacionados con: *${text}*...\nEsto puede tardar unos segundos.`, m)

  try {
    const grupos = await buscarGrupos(text)
    if (!grupos.length) return conn.reply(chatId, '❌ No se encontraron grupos.', m)

    const mensaje = grupos.map((g, i) =>
      `*${i + 1}.* ${g.Nombre}\n🔗 ${g.Enlace}\n📌 ${g.Descripcion}`
).join('\n\n')

    await conn.reply(chatId, `✅ *Grupos encontrados: ${grupos.length}*\n\n${mensaje}`, m)
} catch (e) {
    console.error('[grupos] Error:', e)
    await conn.reply(chatId, `❌ Error al buscar grupos: ${e.message}`, m)
}
}

handler.help = ['grupos <palabras clave>']
handler.tags = ['internet', 'utilidades']
handler.command = /^grupos$/i

export default handler