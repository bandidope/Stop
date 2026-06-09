import { xpRange } from '../lib/levelling.js';
import axios from 'axios';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const saludarSegunHora = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '🌅 ¡𝖡𝗎𝖾𝗇𝗈𝗌 𝖽𝗂́𝖺𝗌!';
  if (hora >= 12 && hora < 19) return '☀️ ¡𝖡𝗎𝖾𝗇𝗈𝗌 𝗍𝖺𝗋𝖽𝖾𝗌!';
  return '🌙 ¡𝖡𝗎𝖾𝗇𝖺𝗌 𝗇𝗈𝖼𝗁𝖾𝗌!';
};

// Imagen proporcionada y diseño de Vans
const imgVans = 'https://files.catbox.moe/dcp02s.jpg';
const borderTop = '╭╾━━━━╼ 〔 👟 〕 ╾━━━━╼╮';
const borderBottom = '╰╾━━━━╼ 〔 🛸 〕 ╾━━━━╼╯';

const menuFooter = `
${borderTop}
│  🛸 *𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 𝕾𝖞𝖘𝖙𝖊𝖒*
│  🛠️ *𝖡𝗒 𝖤𝗅𝗂𝗎𝖽*
│  🛹 *𝖮𝖿𝖿 𝖳𝗁𝖾 𝖶𝖺𝗅𝗅*
${borderBottom}
`.trim();

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
    const mode = global.opts?.self ? '𝖯𝗋𝗂𝗏𝖺𝖽𝗈 🔒' : '𝖯𝗎́𝖻𝗅𝗂𝖼𝗈 🌍';
    const uptime = clockString(process.uptime() * 1000);
    const tagUsuario = `@${m.sender.split('@')[0]}`;
    const userName = (await conn.getName?.(m.sender)) || tagUsuario;

    const adText = ["Vans System", "Eliud Interface", "Urban Bot"].getRandom();

    let thumbnailBuffer;
    try {
      const response = await axios.get(imgVans, { responseType: 'arraybuffer' });
      thumbnailBuffer = Buffer.from(response.data);
    } catch {
      thumbnailBuffer = Buffer.alloc(0);
    }

    const fkontak = {
      key: { participants: "0@s.whatsapp.net", fromMe: false, id: "VansBot" },
      message: {
        locationMessage: {
          name: adText,
          jpegThumbnail: thumbnailBuffer,
          vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Eliud;;;\nFN:Eliud\nORG:VansBot\nEND:VCARD"
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

    const categoryEmojis = {
      anime: '🌸', info: '📢', search: '🔍', diversión: '🎢', subbots: '🤖',
      rpg: '🛹', registro: '📝', sticker: '🎨', imagen: '📸', logo: '🖋️',
      premium: '🎟️', configuración: '⚙️', descargas: '📥', herramientas: '🔧',
      nsfw: '🔞', 'base de datos': '📁', audios: '🎧', freefire: '🔫', otros: '🧩'
    };

    const menuBody = Object.entries(categorizedCommands).map(([title, cmds]) => {
      const emoji = categoryEmojis[title.toLowerCase()] || '👟';
      const list = [...cmds].map(cmd => `│  ◦ ${cmd}`).join('\n');
      return `╭╾━━━━╼ 〔 ${emoji} ${title.toUpperCase()} 〕\n${list}\n╰╾━━━━╼ 〔 🛸 〕`;
    }).join('\n\n');

    const header = `
${saludo} ${tagUsuario} 👋

${borderTop}
│  👟 *𝖁𝖆𝖓𝖘 𝕭𝖔𝖙 𝕸𝖊𝖓𝖚́*
│  👤 *𝖴𝗌𝗎𝖺𝗋𝗂𝗈:* ${userName}
│  📈 *𝖭𝗂𝗏𝖾𝗅:* ${level}
│  ✨ *𝖤𝗑𝗉:* ${exp - min}/${xp}
│  🎫 *𝖳𝗂𝖼𝗄𝖾𝗍𝗌:* ${limit}
│  ⏳ *𝖴𝗉𝗍𝗂𝗆𝖾:* ${uptime}
│  👥 *𝖴𝗌𝗎𝖺𝗋𝗂𝗈𝗌:* ${totalUsers}
${borderBottom}
`.trim();

    const fullMenu = `${header}\n\n${menuBody}\n\n${menuFooter}`;

    await conn.sendMessage(m.chat, {
      image: { url: imgVans },
      caption: fullMenu,
      mentions: [m.sender]
    }, { quoted: fkontak });

  } catch (e) {
    console.error('❌ Error en el menú:', e);
    await conn.reply(m.chat, `⚠️ 𝖤𝗋𝗋𝗈𝗋 𝖺𝗅 𝖼𝖺𝗋𝗀𝖺𝗋 𝖾𝗅 𝗆𝖾𝗇𝗎́.`, m);
  }
};

handler.command = ['menu', 'help', 'menú'];
export default handler;
