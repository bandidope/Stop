import { xpRange } from '../lib/levelling.js';
import axios from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const saludar = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return '🌅 ¡Buenos días!';
  if (hora >= 12 && hora < 7) return '☀️ ¡Buenas tardes!';
  return '🌙 ¡Buenas noches!';
};

const handler = async (m, { conn, usedPrefix }) => {
  try {
    // Definir la ruta de la imagen local y leerla como Buffer
    const img = readFileSync(join(process.cwd(), 'storage', 'img', 'catalogo.png'));

    const user = global.db.data.users[m.sender] || { level: 0, exp: 0, limit: 10 };
    const { exp, level, limit } = user;
    const { min, xp } = xpRange(level, global.multiplier || 1);
    const uptime = clockString(process.uptime() * 1000);
    const tag = `@${m.sender.split('@')[0]}`;
    const totalUsers = Object.keys(global.db.data.users).length;

    // Encabezado con Estilo de Caja
    menu += `︵᷼     ⿻ *Storm* ࣪   ࣭  ࣪ *Wa Bot* ࣭  🐈  ࣪\n\n`;
    menu += `✿ *Hᴏʟᴀ ${tag}*\n*${saludar}*\n`;
    menu += `> ꒰꛱ ͜Desarrollado por *Whois Yallico* +51 936 994 155\n`;
    menu += `𓈒𓏸🌴 \`Bot Name:\`* Storm Bot 🇦🇱\n`;
    menu += `*𓈒𓏸🌵 \`Activo:\`* ${uptime}\n`;
    menu += `*𓈒𓏸🌵 \`Comprar:\`* .comprar\n`;
    menu += `*𓈒𓏸🍃 \`Usuarios:\`* ${totalreg}`;
    menu += `> 😸 Si encuentra un comando con errores no dudes en reportarlo con el Creador\n`;

    let categorizedCommands = {};
    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tag = Array.isArray(p.tags) ? p.tags[0] : p.tags || 'Otros';
        const cmds = Array.isArray(p.help) ? p.help : [p.help];
        categorizedCommands[tag] = categorizedCommands[tag] || new Set();
        cmds.forEach(cmd => categorizedCommands[tag].add(cmd));
      });

    const categoryIcons = {
      arceus: '🇦🇱', internet: '🔹', música: '❓', downloader: '🔹', owner: '💻',
      admin: '🔹', otros: '🧩', econ: '🔹', tools: '🔹', audio: '🔹',
      descargas: '📥', search: '🔭', info: 'ℹ️', buscador: '🔹',
      búsquedas: '🔹', dl: '🔹', anime: '🏮', random: '🔹',
      ff: '🔫', descarga: '🔹', nable: '🔹', fun: '🔹',
      diversión: '🎮', consultor: '🔹', sticker: '🎭', maker: '🔹',
      game: '🔹', arte: '🔹', cocina: '🔹', gacha: '🔹', ia: '🔹',
      group: '👥', grupo: '🔹', ai: '🔹', staff: '🔹', main: '🔹',
      transformador: '🔹', nsfw: '🔞', fix: '🔹', rg: '🔹', rpg: '🛡️',
      economía: '🔹', mascot: '🔹', herramientas: '🛠️'
    };

    for (const [title, cmds] of Object.entries(categorizedCommands)) {
      const icon = categoryIcons[title.toLowerCase()] || '🇦🇱';
      menu += `\n╭╾━━╼ 〔 ${icon} *${title.toUpperCase()}* 〕\n`;
      cmds.forEach(cmd => {
        menu += `┃ • ${usedPrefix}${cmd}\n`;
      });
      menu += `╰╾━━╼ 〔 Pᴏᴡᴇʀᴇᴅ Bʏ Tᴇᴀᴍ Nɪɢʜᴛᴡɪsʜ 〕\n`;
    }

    menu += `\n╭╾━━━━╼ 〔 𝐒𝐭𝐨𝐫𝐦 𝐁𝐨𝐭 〕 ╾━━━━╼╮\n`;
    menu += `┃  ✨ *Storm Bot 🇦🇱*\n`;
    menu += `┃  🛠️ *By Whois Developers*\n`;
    menu += `┃  🇦🇱 *Power & Speed*\n`;
    menu += `╰╾━━━━╼ 〔 🚀 〕 ╾━━━━╼╯`;

    // Enviar mensaje con el Buffer de la imagen
    await conn.sendMessage(m.chat, {
      image: img, // Ahora enviamos el Buffer directamente
      caption: menu.trim(),
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '❌ Error al generar el menú. Verifica que la imagen exista en storage/img/catalogo.png', m);
  }
};

handler.command = ['menu', 'help', 'menú'];
export default handler;