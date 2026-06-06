import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.trim()) {
    return m.reply("🔎 *¿Qué deseas escuchar? Ingresa el nombre de la canción o URL de SoundCloud.*");
  }

  await m.react("🎧");

  try {
    // Buscar en SoundCloud
    const res = await fetch(`https://api.delirius.store/search/soundcloud?q=${encodeURIComponent(text.trim())}&limit=10`);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      await m.react("❌");
      return m.reply("❌ *No se encontraron resultados en el servidor real.*");
    }

    const track = data.data[0]; // Primer resultado
    const caption = `
╭━━━━〔 ☁️ *SOUNDCLOUD* 〕━━━━┓
┃
┃ 🎼 *Título:* ${track.title}
┃ 👤 *Artista:* ${track.artist}
┃ ⏱️ *Duración:* ${Math.floor(track.duration / 1000)}s
┃ ❤️ *Favoritos:* ${track.likes}
┃ ▶️ *Plays:* ${track.play}
┃ 🔗 *Link:* ${track.link}
┃
┣━━━━━━━━━━━━━━━━━━━━━━┛
┃ ⚡ *𝙏𝙝𝙚 𝙆𝙞𝙣𝙜'𝙨 𝘽𝙤𝙩 👾*
┗━━━━━━━━━━━━━━━━━━━━━━━┛

> 📥 *Enviando frecuencia de audio...*
`.trim();

    // Mostrar miniatura + caption
    if (track.image) {
      await conn.sendMessage(m.chat, { 
        image: { url: track.image }, 
        caption 
      }, { quoted: m });
    } else {
      await m.reply(caption);
    }

    // Descargar audio
    const apiRes = await fetch(`https://api.delirius.store/download/soundcloud?url=${encodeURIComponent(track.link)}`);
    const api = await apiRes.json();
    const dl = api?.data?.download; 

    if (!dl) return m.reply("❌ *Error al extraer la pista de audio.*");

    // Enviar como audio
    await conn.sendMessage(m.chat, {
      audio: { url: dl },
      mimetype: "audio/mpeg",
      fileName: `${track.title}.mp3`,
      ptt: false // Cambiar a true si prefieres que se envíe como nota de voz
    }, { quoted: m });

    await m.react("✅");

  } catch (error) {
    console.error("❌ Error:", error);
    await m.react("⚠️");
    return m.reply("⚠️ *El sistema central encontró un error al procesar la descarga.*");
  }
};

handler.help = ["sound"];
handler.tags = ["descargas"];
handler.command = /^(sound|soundcloud|scdl)$/i;

export default handler;
