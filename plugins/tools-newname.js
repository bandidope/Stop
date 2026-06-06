
import axios from 'axios';

async function scrapeMollygram(username) {
  try {
    const url = `https://media.mollygram.com/?url=${encodeURIComponent(username)}`;
    const headers = {
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'origin': 'https://mollygram.com',
      'referer': 'https://mollygram.com/',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
};

    const { data} = await axios.get(url, { headers});
    if (data.status!== 'ok') throw new Error('No se pudo obtener los datos');

    const html = data.html;
    const getMatch = (regex) => html.match(regex)?.[1]?.trim() || null;

    const profilePic = getMatch(/<img[^>]*class="[^"]*rounded-circle[^"]*"[^>]*src="([^"]+)"/i)
      || getMatch(/<img[^>]*src="([^"]+)"[^>]*class="[^"]*rounded-circle[^"]*"/i);

    return {
      username: getMatch(/<h4 class="mb-0">([^<]+)<\/h4>/),
      fullname: getMatch(/<p class="text-muted">([^<]+)<\/p>/),
      bio: getMatch(/<p class="text-dark"[^>]*>([^<]+)<\/p>/),
      posts: getMatch(/<div[^>]*>\s*<span class="d-block h5 mb-0">([^<]+)<\/span>\s*<div[^>]*>posts<\/div>/i),
      followers: getMatch(/<div[^>]*>\s*<span class="d-block h5 mb-0">([^<]+)<\/span>\s*<div[^>]*>followers<\/div>/i),
      following: getMatch(/<div[^>]*>\s*<span class="d-block h5 mb-0">([^<]+)<\/span>\s*<div[^>]*>following<\/div>/i),
      profilePic
};

} catch (error) {
    throw new Error(`Error al scrapear Mollygram: ${error.message}`);
}
}

let handler = async (m, { conn, text}) => {
  if (!text) return m.reply('❌ Ingresa el nombre de usuario de Mollygram.\nEjemplo:.molly mycyll.7');

  try {
    const result = await scrapeMollygram(text);
    if (!result) return m.reply('No se encontró información del perfil.');

    const caption = `👤 *Usuario:* ${result.username}\n`
      + `📛 *Nombre completo:* ${result.fullname || 'No disponible'}\n`
      + `📝 *Biografía:* ${result.bio || 'Sin descripción'}\n`
      + `📸 *Publicaciones:* ${result.posts || '0'}\n`
      + `👥 *Seguidores:* ${result.followers || '0'}\n`
      + `➡️ *Siguiendo:* ${result.following || '0'}`;

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: result.username,
          body: 'Perfil de Mollygram',
          mediaType: 1,
          thumbnailUrl: result.profilePic,
          sourceUrl: `https://mollygram.com/${text}`
}
}
}, { quoted: m});

} catch (err) {
    m.reply(`⚠️ Error: ${err.message}`);
}
};

handler.help = ['molly <usuario>'];
handler.tags = ['scraper'];
handler.command = ['molly', 'mollygram'];

export default handler;