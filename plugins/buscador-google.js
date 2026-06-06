import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, args }) => {
  if (!text) {
    return m.reply(`🔍 Por favor, dime qué deseas buscar en Google.\n\n📌 Ejemplo: ${usedPrefix}google Messi Inter Miami`)
  }

  const query = encodeURIComponent(text.trim());
  const apiUrl = `https://api.vreden.my.id/api/v1/search/google?query=${query}&count=10`;

  try {
    await m.react('🕒');
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !Array.isArray(json.result.search_data) || json.result.search_data.length === 0) {
      await m.react('❌');
      return m.reply('😕 No se encontraron resultados para tu búsqueda.');
    }

    let reply = `🔎 Resultados de búsqueda para: ${text}\n\n`;
    json.result.search_data.slice(0, 10).forEach((item, i) => {
      reply += `✨ ${i + 1}. ${item.title || 'Sin título'}\n`;
      reply += `📝 ${item.snippet || 'Sin descripción disponible'}\n`;
      reply += `🔗 ${item.link || 'Sin enlace disponible'}\n\n`;
    });

    await m.reply(reply.trim());
    await m.react('✅');
  } catch (err) {
    await m.react('⚠️');
    m.reply(`🚨 Ocurrió un error al realizar la búsqueda.\n> Usa ${usedPrefix}report para informarlo.\n\n🧾 Detalle: ${err.message}`);
  }
}

handler.help = ['google']
handler.command = ['google']
handler.tags = ['internet']
handler.group = false

export default handler;