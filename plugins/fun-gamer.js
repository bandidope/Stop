import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const handler = async (msg, { conn, text }) => {
  const chatID = msg.key.remoteJid;
  
  // Efecto de "escribiendo" para mayor realismo
  await conn.sendPresenceUpdate("composing", chatID);
  
  // Obtener prefijo dinámico
  const prefixPath = path.resolve("prefixes.json");
  let usedPrefix = ".";
  if (fs.existsSync(prefixPath)) {
    const rawID = (conn.user?.id || "").split(":")[0] + "@s.whatsapp.net";
    const prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
    usedPrefix = prefixes[rawID] || ".";
  }

  // Validación de texto de entrada
  if (!text) {
    return conn.sendMessage(chatID, {
      text: `📌 *Uso correcto:*\n\n${usedPrefix}wa <número>\n\n📍 *Ejemplo:* ${usedPrefix}wa 584125877491`,
    }, { quoted: msg });
  }

  const cleanNumber = text.replace(/[^0-9]/g, "");
  if (cleanNumber.length < 8 || cleanNumber.length > 15) {
    return conn.sendMessage(chatID, {
      text: "❌ *Número inválido.* Asegúrate de incluir el código de país y que sea un número real.",
    }, { quoted: msg });
  }

  // Reacción de búsqueda
  await conn.sendMessage(chatID, { react: { text: "🔍", key: msg.key } });

  try {
    const url = `https://io.tylarz.top/v1/bancheck?number=${cleanNumber}&lang=es`;
    const res = await fetch(url, {
      headers: { 
        "Accept": "application/json",
        "X-Api-Key": "nami" 
      },
      timeout: 10000, // 10 segundos es suficiente
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    if (!data.status || !data.data) throw new Error("Respuesta de API inválida");

    const { isBanned } = data.data;
    const estado = isBanned ? "🚫 *BANEADO / SUSPENDIDO*" : "✅ *ACTIVO / LIBRE*";
    const color = isBanned ? "🟥" : "🟩";

    const mensaje = `╭───⭑ *BAN CHECKER* ⭑───╮\n` +
                    `│\n` +
                    `│ ${color} *Número:* ${cleanNumber}\n` +
                    `│ 📡 *Estado:* ${estado}\n` +
                    `│\n` +
                    `╰────────────────────╯\n\n` +
                    `> *Vans Bot 🚘 Checking Service*`;

    await conn.sendMessage(chatID, { text: mensaje }, { quoted: msg });
    await conn.sendMessage(chatID, { react: { text: "✅", key: msg.key } });

  } catch (error) {
    console.error("Error en command wa:", error);
    
    let errMsg = "❌ *Error al verificar el número.*";
    if (error.type === 'request-timeout') errMsg = "⏰ *El servidor tardó demasiado en responder.*";
    
    await conn.sendMessage(chatID, { text: `${errMsg}\n\n> Intentelo de nuevo más tarde.` }, { quoted: msg });
    await conn.sendMessage(chatID, { react: { text: "❌", key: msg.key } });
  }
};

handler.command = ["wa", "bancheck", "check"];
export default handler;
