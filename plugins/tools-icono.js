import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { FormData, Blob} from 'formdata-node';
import { fileTypeFromBuffer} from 'file-type';

const emoji = '✅';
const emoji2 = '✅';

const handler = async (m, { conn, args, usedPrefix, command}) => {
  try {
    const type = args[0];
    if (!['1', '2'].includes(type)) {
      return conn.reply(
        m.chat,
        `Use: *${usedPrefix + command} 1* or *.seticon 2* responda con .seticono 2.`,
        m
);
}

    if (!m.quoted ||!/image/.test(m.quoted.mimetype)) {
      return m.reply(
        `Reply to an image with *${usedPrefix + command} ${type}* to update the icon.`
);
}

    const media = await m.quoted.download();
    const fileType = await fileTypeFromBuffer(media);

    if (!fileType ||!fileType.mime.startsWith('image/')) {
      return m.reply(`The file sent is not a valid image.`);
}

    let url;
    try {
      const sunflare = await uploadToSunflare(media);
      url = sunflare.url;
} catch (e) {
      const russell = await uploadToRussellXZ(media);
      url = russell.url;
}

    let botData = global.db.data.settings[conn.user.jid] || {};
    if (type === '1') {
      botData.icon1 = url;
} else {
      botData.icon2 = url;
}
    global.db.data.settings[conn.user.jid] = botData;

    await conn.sendFile(m.chat, media, 'icon.jpg', `${emoji} Icon ${type}.`, m);
} catch (e) {
    m.reply(`❌ Error: ${e.message}`);
}
};

handler.help = ['seticono <1|2>'];
handler.tags = ['tools'];
handler.command = /^seticono$/i;
handler.rowner = false;

export default handler;

// Upload to Sunflare
async function uploadToSunflare(buffer) {
  const { ext, mime} = (await fileTypeFromBuffer(buffer)) || {
    ext: 'bin',
    mime: 'application/octet-stream'
};
  const blob = new Blob([buffer], { type: mime});
  const randomName = crypto.randomBytes(5).toString('hex') + '.' + ext;

  let folder = 'files';
  if (mime.startsWith('image/')) folder = 'images';

  const arrayBuffer = await blob.arrayBuffer();
  const base64Content = Buffer.from(arrayBuffer).toString('base64');

  const resp = await fetch('https://cdn-sunflareteam.vercel.app/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      folder,
      filename: randomName,
      base64Content
})
});

  const result = await resp.json();

  if (resp.ok && result?.url) {
    return { url: result.url, name: randomName};
} else {
    throw new Error(result?.error || 'Error uploading to cdn.sunflare');
}
}

// Upload to RussellXZ
async function uploadToRussellXZ(buffer) {
  const form = new FormData();
  form.set(
    'file',
    new Blob([buffer], { type: 'image/jpeg'}),
    'image.jpg'
);

  const resp = await fetch('https://cdn.russellxz.click/upload.php', {
    method: 'POST',
    body: form
});

  const result = await resp.json();

  if (resp.ok && result?.url) {
    return { url: result.url};
} else {
    throw new Error(result?.error || 'Error uploading to cdn.russellxz');
}
}