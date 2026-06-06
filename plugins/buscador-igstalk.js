
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return m.reply(`📌 *Uso correcto:*\n${usedPrefix + command} <nombre de usuario>\n📍 *Ejemplo:* ${usedPrefix + command} yahyaalmthr`);
}

  try {
    const res = await fetch(`https://api.vreden.my.id/api/v1/search/instagram/users?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    const users = json?.result?.search_data;
    if (!users || users.length === 0) {
      return m.reply("❌ No se encontraron usuarios.");
}

    let message = `🔍 *Resultados para:* ${text}\n\n`;

    for (const user of users.slice(0, 5)) {
      message += `
👤 *Nombre:* ${user.full_name || 'No disponible'}
🔗 *Usuario:* @${user.username}
🔒 *Privado:* ${user.is_private? 'Sí': 'No'}
✅ *Verificado:* ${user.is_verified? 'Sí': 'No'}
🖼️ *Foto:* ${user.profile_pic_url}

`;
}

    await conn.sendMessage(m.chat, { text: message.trim()}, { quoted: m});

} catch (e) {
    console.error(e);
    m.reply("⚠️ Error al buscar usuarios en Instagram.");
}
};

handler.help = ['igstalk <usuario>'];
handler.tags = ['internet'];
handler.command = ['igstalk', 'instagramuser'];

export default handler;