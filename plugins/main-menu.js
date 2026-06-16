import { xpRange } from '../lib/levelling.js';
import axios from 'axios';

// Utilidad para convertir milisegundos en formato hh:mm:ss
const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

// Saludo dinámico según la hora
const saludarSegunHora = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '🌅 ¡Buenos días!';
  if (hora >= 12 && hora < 19) return '☀️ ¡Buenas tardes!';
  return '🌙 ¡Buenas noches!';
};

// Imagen de respaldo y separadores
const img = 'https://cdn.adoolab.xyz/dl/de20913b.jpg';
const sectionDivider = '╰━━━━━━━━━━━━━━━━━━⭓';

// Pie de menú profesional
const menuFooter = `
╭─❒ 「 💻 SISTEMA ⚡ 」
│ 🤖 *Jackson Storm*
│ 🛠️ Usa el prefijo para ejecutar comandos
│ 🌐 Creado por bxnja 
╰❒
`.trim();

// Extensión para obtener un elemento aleatorio
Array.prototype.getRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const handler = async (m, { conn, usedPrefix }) => {
  try {
    const saludo = saludarSegunHora();
    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 5 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const totalUsers = Object.keys(global.db.data.users).length;
    const mode = global.opts?.self ? 'Privado 🔒' : 'Público 🌍';
    const uptime = clockString(process.uptime() * 1000);
    const tagUsuario = `@${m.sender.split('@')[0]}`;
    const userName = (await conn.getName?.(m.sender)) || tagUsuario;

    const text = [
      "The King's System",
      "Dynamic Menu",
      "Bot Interface"
    ].getRandom();

    // Puedes colocar aquí tus imágenes estándar (no navideñas)
    const imgRandom = [
 "https://cdn.adoolab.xyz/dl/de20913b.jpg", 
  "https://cdn.adoolab.xyz/dl/de20913b.jpg"
    ].getRandom();

    let thumbnailBuffer;
    try {
      const response = await axios.get(imgRandom, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data);
    } catch (e) {
      const fallback = await axios.get(img, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(fallback.data);
    }

    const izumi = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "KingBot" },
      message: {
        locationMessage: {
          name: text,
          jpegThumbnail: thumbnailBuffer,
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;JacksonBot;;;\nFN:JacksonBot\nORG: JacksonBot\nEND:VCARD"
        }
      },
      participant: "0@s.whatsapp.net"
    };

    let categorizedCommands = {};
    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tag = Array.isArray(p.tags) ? p.tags[0] : p.tags || 'Otros';
        const cmds = Array.isArray(p.help) ? p.help : [p.help];
        categorizedCommands[tag] = categorizedCommands[tag] || new Set();
        cmds.forEach(cmd => categorizedCommands[tag].add(usedPrefix + cmd));
      });

    // Emojis de categoría actualizados
    const categoryEmojis = {
      anime: '🎭', info: 'ℹ️', search: '🔍', diversión: '🎮', subbots: '🤖',
      rpg: '⚔️', registro: '📝', sticker: '🏷️', imagen: '🖼️', logo: '🎨',
      premium: '💎', configuración: '⚙️', descargas: '📥', herramientas: '🛠️',
      nsfw: '🔞🔥', 'base de datos': '🗄️', audios: '🎵', freefire: '🔫', otros: '📂💾'
    };

    const menuBody = Object.entries(categorizedCommands).map(([title, cmds]) => {
      const emoji = categoryEmojis[title.toLowerCase()] || '🔹';
      const list = [...cmds].map(cmd => `│ ◦ ${cmd}`).join('\n');
      return `╭─「 ${emoji} ${title.toUpperCase()} 」\n${list}\n${sectionDivider}`;
    }).join('\n\n');

    const header = `
╭─ 「 Jackson Storm 」
│ 👤 Usuario: ${userName}
│ 📈 Nivel: ${level} | XP: ${exp - min}/${xp}
│ 💎 Gemas del rey: ${limit}
│ 🕹️ Modo: ${mode}
│ ⏳ Actividad: ${uptime}
│ 👥 Usuarios: ${totalUsers}
╰─❒
`.trim();

    const fullMenu = `${header}\n\n${menuBody}\n\n${menuFooter}`;

    const botSettings = global.db.data.settings?.[conn.user.jid] || {};
    const bannerr = botSettings.banner || img;

    await conn.sendMessage(m.chat, {
      image: { url: bannerr },
      caption: fullMenu,
      mentions: [m.sender]
    }, { quoted: izumi });

  } catch (e) {
    console.error('❌ Error en el menú:', e);
    await conn.reply(m.chat, `⚠️ Ocurrió un error al cargar el menú.\n> ${e.message}`, m);
  }
};

handler.command = ['menu', 'help', 'menú'];
export default handler;