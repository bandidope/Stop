
import fetch from 'node-fetch';

let handler = async (m, { text, command}) => {
  if (!text ||!text.trim()) {
    return m.reply(`🎨 *Uso correcto:*\n.${command} <descripción de la imagen>\n📍 Ejemplo:.${command} un dragón volando sobre un castillo`);
}

  try {
    const prompt = text.trim();
    const url = `https://nekobot.xyz/api/imagegen?type=changemymind&text=${encodeURIComponent(prompt)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json ||!json.message) {
      throw new Error("No se pudo generar la imagen.");
}

    await conn.sendFile(m.chat, json.message, 'imagen.jpg', `🖼️ *Imagen generada con el prompt:*\n"${prompt}"`, m);
} catch (e) {
    console.error("Error en.img:", e);
    m.reply("⚠️ Ocurrió un error al generar la imagen.");
}
};

handler.help = ['img <texto>'];
handler.tags = ['ai', 'imagen'];
handler.command = ['img', 'crearimg'];

export default handler;