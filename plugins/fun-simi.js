import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `💥¡Hola! ¿cómo puedo ayudarte hoy?`, m, rcanal);
  }

  try {
    // Endpoint de Delirius IA con parámetro q
    const url = `https://api.delirius.store/ia/chatgpt?q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.status || !data.data) {
      return conn.reply(m.chat, "❌ No recibí respuesta de la IA, intenta de nuevo.", m, fake);
    }

    // Respuesta de la IA
    await conn.reply(m.chat, `${data.data}`, m, rcanal);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "⚠️ Hubo un error al conectar con la IA.", m, fake);
  }
};

handler.tags = ["ia"];
handler.command = handler.help = ["ia", "chatgpt"];

export default handler;