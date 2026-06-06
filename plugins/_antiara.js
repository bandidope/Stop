import fetch from "node-fetch";

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <nombre de la canción>\n📍 *Ejemplo:* ${usedPrefix + command} Feel Special`);
  }

  await m.react("🎵");

  try {
    // Nueva URL de la API de Delirius
    const url = `https://api.delirius.store/search/lyrics?query=${encodeURIComponent(text.trim())}`;
    const res = await fetch(url);
    const json = await res.json();

    // Verificación basada en la estructura de Delirius
    if (!json.status || !json.data) {
      return m.reply("❌ No se encontró la letra de esa canción.");
    }

    const { title, artists, album, lyrics } = json.data;

    const caption = `
🎶 *${title}* — *${artists}*
💿 *Álbum:* ${album}

📝 *Letra:*
${lyrics}
`.trim();

    await m.reply(caption);
    await m.react("✅");
  } catch (error) {
    console.error("❌ Error:", error);
    m.reply("⚠️ *Ocurrió un error al obtener la letra.*");
  }
};

handler.help = ["letra <nombre>", "lyrics <nombre>"];
handler.tags = ["musica"];
handler.command = ["letra", "lyrics"];

export default handler;
