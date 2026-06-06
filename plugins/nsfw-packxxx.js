
import fetch from 'node-fetch';

let handler = async(m, { conn, text, usedPrefix, command }) => {

m.react('🕑');

let txt = 'Disfruta 🔥🥵';

let img = 'https://api.delirius.store/nsfw/boobs';

m.react('✅');
conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: fkontak });
}

handler.command = ['packxxx'];
handler.tags = ['nsfw'];
export default handler;