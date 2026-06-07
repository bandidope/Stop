// plugins/tiktok_imagem.js
// Baixa imagens de slideshows do TikTok (.tiktokimg / .tiktokimagem)
// Requer: node-fetch (npm i node-fetch)
import fetch from 'node-fetch';

/** Função auxiliar: obtém lista de URLs de imagens via TikWM */
async function fetchTikTokImages(tiktokUrl) {
  const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
  const res = await fetch(api, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  if (!res.ok) {
    throw new Error(`TikWM não respondeu (HTTP ${res.status})`);
  }

  const json = await res.json();

  if (json?.code !== 0) {
    throw new Error(json?.msg || 'Não foi possível obter os dados do TikTok');
  }

  const data = json.data || {};
  let images = [];

  if (Array.isArray(data.images) && data.images.length) {
    images = data.images;
  }

  if (!images.length && data.image) {
    images = [data.image];
  }
  if (!images.length && data.cover) {
    images = [data.cover];
  }

  return {
    images,
    title: data.title || '',
    author: data.author?.nickname || data.author?.unique_id || ''
  };
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const url = (args[0] || '').trim();
    if (!url) {
      return conn.reply(
        m.chat,
        `📸 *Falta o link, amor*\n` +
        `Use: *${usedPrefix + command}* <link do TikTok>\n` +
        `Exemplo: ${usedPrefix + command} https://vm.tiktok.com/ZMAjg9kD4/`,
        m
      );
    }

    // Aviso inicial
    await conn.reply(m.chat, '⏳ *Espera aí, vou puxar as fotinhas…*', m);

    const { images, title, author } = await fetchTikTokImages(url);

    if (!images.length) {
      return conn.reply(
        m.chat,
        '😿 Não encontrei fotos nesse TikTok. Confirme que é um *slideshow* (publicação de fotos).',
        m
      );
    }

    // Enviar cada imagem
    let index = 1;
    for (const imgUrl of images) {
      const r = await fetch(imgUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) continue;
      const buff = await r.buffer();

      const caption =
        `🖼️ *TikTok – Foto ${index}/${images.length}*` +
        (title ? `\n📝 ${title}` : '') +
        (author ? `\n👤 ${author}` : '');

      await conn.sendMessage(
        m.chat,
        { image: buff, caption },
        { quoted: m }
      );
      index++;
    }

    // Mensagem final
    await conn.reply(
      m.chat,
      `✅ *Prontinho* — enviei ${images.length} fot${images.length === 1 ? 'o' : 'os'}.\n` +
      `Se quiser outro, manda o link com *.tiktokimg* 😉`,
      m
    );

  } catch (err) {
    console.error(err);
    await conn.reply(
      m.chat,
      `💥 *Erro na descarga:*\n${String(err.message || err)}` +
      `\n\nDicas:\n• Verifique se a postagem é de *fotos/slideshow*.\n` +
      `• Tente com o link web (não privado).`,
      m
    );
  }
};

handler.help = ['tiktokimg <url>', 'tiktokimagem <url>'];
handler.tags = ['downloader', 'tiktok'];
handler.command = /^(tiktokimg|tiktokimagem)$/i;

export default handler;