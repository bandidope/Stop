
import fetch from "node-fetch";

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`📦 *Uso correcto:*\n${usedPrefix + command} <nombre de la app>\n📍 *Ejemplo:* ${usedPrefix + command} WhatsApp`);
  }

  await m.react("⏳");

  try {
    const apiUrl = `https://api.delirius.store/download/apk?query=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const { status, data } = await response.json();

    if (!status || !data) {
      throw new Error("La API no retornó datos válidos");
    }

    const {
      name,
      size,
      sizeByte,
      image,
      download: dllink,
      developer,
      publish,
      id: packageId,
      stats
    } = data;

    const caption = [
      `╭━[ *APK DOWNLOADER* ]━╮`,
      `│`,
      `│ 📱 *Aplicación:* ${name}`,
      `│ 👨‍💻 *Desarrollador:* ${developer}`,
      `│ 📦 *Paquete:* ${packageId}`,
      `│ 📁 *Tamaño:* ${size}`,
      `│ 🗓️ *Publicado:* ${publish}`,
      `│ ⭐ *Rating:* ${stats.rating.average}/5 (${stats.rating.total} votos)`,
      `│ 📥 *Descargas:* ${stats.downloads.toLocaleString()}`,
      `│`,
      `╰━━━━━━━━━━━━━━━━━━╯`
    ].join('\n');

    if (image) {
      const imageBuffer = await fetch(image).then(r => r.buffer());
      await conn.sendFile(m.chat, imageBuffer, "icon.png", caption, m);
    } else {
      await m.reply(caption);
    }

    if (dllink) {
      const maxSize = 400 * 1024 * 1024;
      
      if (sizeByte && sizeByte > maxSize) {
        await m.reply(`⚠️ *El archivo es demasiado grande (${size}).*\n\n🔗 *Descárgalo aquí:*\n${dllink}`);
      } else {
        await m.reply(`⬇️ *Enviando APK...*\n\n_Esto puede tardar unos momentos según el tamaño._`);
        await conn.sendFile(m.chat, dllink, `${name}.apk`, `📦 *${name}*\n💾 ${size}`, m, false, { asDocument: true, mimetype: "application/vnd.android.package-archive" });
      }
    }

    await m.react("✅");
  } catch (error) {
    console.error("Error en APK handler:", error);
    await m.reply(`⚠️ *No se pudo obtener la aplicación.*\n\n${error.message || 'Intenta con otro nombre o verifica que la app exista.'}`);
    await m.react("❌");
  }
};

handler.help = ["apk"];
handler.tags = ["descargas"];
handler.command = /^(apk|apkdl|downloadapk)$/i;

export default handler;
