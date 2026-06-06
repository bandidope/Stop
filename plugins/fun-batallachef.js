
import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  try {
    if (!text) return conn.reply(m.chat, '💥 Por favor, proporciona un código de país.', m)
    await m.react('🕒')

    // Ajusta el URL de la API según el código de país proporcionado
    const apiUrl = `https://api.dorratz.com/v2/pais/${text}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json || !json.nombre) throw '⚠ No se encontraron resultados para este código de país.'

    // Componemos la respuesta con los datos extraídos
    const response = `
      🇧🇴 *Información de ${json.nombre}*
      📞 *Código:* ${json.código}
      🏳️ *Bandera:* ${json.bandera}
      🏙️ *Capital:* ${json.capital}
      💵 *Moneda:* ${json.moneda}
      🌍 *Continente:* ${json.continente}
      👥 *Población:* ${json.población}
      🗺️ *Área:* ${json.área} km²
      🗣️ *Idioma oficial:* ${json.idioma_oficial}
      🚩 *Código ISO:* ${json.código_iso}
      🇦🇷 *Región:* ${json.región}
      🎉 *Fiesta Nacional:* ${json.fiesta_nacional}
      🌦️ *Clima:* ${json.clima}
      ⛏️ *Recursos Naturales:* ${json.recursos_naturales}
      💰 *Economía:* ${json.economía}
      ⬅️ *Exportaciones:* ${json.exportaciones}
      ➡️ *Importaciones:* ${json.importaciones}
      🌴 *Turismo:* ${json.turismo}
      🎶 *Himno Nacional:* ${json.himno_nacional}
      📖 *Mitos y Leyendas:* ${json.mitos_leyendas}
      🍽️ *Gastronomía:* ${json.gastronomía}
    `;

    await conn.reply(m.chat, response, m)
    await m.react('✔️')
  } catch (e) {
    await m.react('✖️')
    conn.reply(m.chat, typeof e === 'string' ? e : '⚠ Ocurrió un error al procesar la consulta.', m)
  }
}

handler.command = handler.help = ['pais']
handler.tags = ['info']
handler.group = false

export default handler