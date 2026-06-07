//código creado por NEOTOKIO para hinata bot no quites los créditos 
//github.com/TOKIO5025

import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  try {
    const res = await fetch('https://delirius-apiofc.vercel.app/nsfw/girls');
    if (!res.ok) throw new Error(`Error en la API: ${res.status}`);

    const buffer = await res.buffer();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🔥 Aquí tienes tu ${command} bien rico/a 😏`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('❌ No pude traer la imagen, la API no respondió bien.');
  }
};

handler.command = ['cuca', 'cuquita', 'culito'];
handler.tags = ['nsfw'];
handler.help = ['cuca', 'cuquita', 'culito'];

export default handler;