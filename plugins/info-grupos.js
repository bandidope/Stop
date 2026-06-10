let handler = async (m, { conn, usedPrefix, command }) => {

   let grupos = `*¡Hola!, te invito a unirte a mis grupos oficiales!*

✑ 𝗚𝗿𝘂𝗽𝗼 𝗱𝗲 𝘃𝗲𝗻𝘁𝗮𝘀
✎ https://chat.whatsapp.com/Fi6FHZ8VSGnAT7CKJkcd9r?mode=wwc

✑ 𝗖𝗮𝗻𝗮𝗹 𝗱𝗲 𝗥𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗶𝗮𝘀
✎ https://whatsapp.com/channel/0029Vb5oUp43LdQUVViHwc0m

✑ 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺
✎ https://instagram.com/whois.yallico

`

   let img = 'https://cdn.adoolab.xyz/dl/de20913b.jpg';

   conn.sendMessage(m.chat, { image: { url: img }, caption: grupos }, { quoted: fkontak });
}

handler.help = ['gruposofc']
handler.tags = ['info']
handler.command = ['gruposofc', 'club']

export default handler