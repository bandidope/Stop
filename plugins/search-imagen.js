import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `📸 Ingresa un prompt para generar la imagen.\nEjemplo: *${usedPrefix + command} gato gris*`, m, rcanal);
  }

  try {
    // Endpoint de Dorratz IA-Image con prompt y ratio
    const url = `https://api.dorratz.com/v3/ai-image?prompt=${encodeURIComponent(text)}&ratio=9:19`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.data || data.data.status !== "success") {
      return conn.reply(m.chat, "❌ No recibí imagen de la IA, intenta de nuevo.", m, fake);
    }

    // Enlace de la imagen generada
    const imageUrl = data.data.image_link;

    // Enviar la imagen al chat
    await conn.sendFile(m.chat, imageUrl, "imagen.jpg", `🖼️ Imagen generada por IA\nPrompt: *${text}*`, m);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "⚠️ Hubo un error al conectar con la IA de imágenes.", m, fake);
  }
};

handler.tags = ["ia"];
handler.command = handler.help = ["iaimg", "imagen","img"];

export default handler;