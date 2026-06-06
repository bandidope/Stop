import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, ` ¡Hola! ¿cómo puedo ayudarte hoy?`, m, rcanal);
  }

  try {
    // Nuevo endpoint con parámetros prompt y country
    const url = `https://api.dorratz.com/ai/gpt?prompt=${encodeURIComponent(text)}&country=venezuela`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.response) {
      return conn.reply(m.chat, "❌ No recibí respuesta de la IA, intenta de nuevo.", m, fake);
    }

    await conn.reply(m.chat, `${data.response}`, m, rcanal);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "⚠️ Hubo un error al conectar con la IA.", m, fake);
  }
};

handler.tags = ["ia"];
handler.command = handler.help = ['gpt', 'chatgpt'];

export default handler;