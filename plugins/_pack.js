
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command}) => {
  m.react('🕑');

  let txt = 'Pack🔥🔥🔥\n> Pon De Nuevo el comando .pack para mirar el siguiente, Si eres Kelvin métete un pene♥️✨';
  let img = 'https://api.dorratz.com/nsfw/tetas';

  const textRandom = [
    "𝙀𝙩𝙞𝙦𝙪𝙚𝙩𝙖 𝙂𝙚𝙣𝙚𝙧𝙖𝙡 👾",
    "𝙈𝙚𝙣𝙘𝙞𝙤𝙣 𝙂𝙚𝙣𝙚𝙧𝙖𝙡",
    "𝙀𝙩𝙞𝙦𝙪𝙚𝙩𝙖𝙣𝙙𝙤 𝙖 𝙡𝙤𝙨 𝙉𝙋𝘾"
  ];

  const imgRandom = [
    "https://iili.io/FKVDVAN.jpg",
    "https://iili.io/FKVbUrJ.jpg"
  ];

  const msjRandom = textRandom[Math.floor(Math.random() * textRandom.length)];
  const imgSelected = imgRandom[Math.floor(Math.random() * imgRandom.length)];
  const thumb = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer'})).data);

  const izumi = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo"},
    message: {
      locationMessage: {
        name: msjRandom,
        jpegThumbnail: thumb,
        vcard:
          "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
}
},
    participant: "0@s.whatsapp.net"
};

  m.react('✅');
  conn.sendMessage(m.chat, { image: { url: img}, caption: txt}, { quoted: izumi});
};

handler.command = ['pack'];

export default handler;