let handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, `• *Example :* .${command} https://vm.tiktok.com/xxxxx`, m)
  conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key }})
  let res = await tiktokmp3(text)
  await conn.sendMessage(m.chat, {
  document: { url: `${res.music_info.url}` },
  mimetype: 'audio/mpeg', 
  fileName: `${res.title}.mp3`
  },{quoted: m})
  return
}
handler.help = ['tiktokmp3 *<url>*'];
handler.tags = ['downloader'];
handler.command = /^(tiktokmp3|ttmp3|tiktokaudio)$/i;
handler.limit = true;
handler.group = false;

module.exports = handler;

async function tiktokmp3(url) {
let api = await Func.fetchJson(`https://api.alyachan.dev/api/tiktok?url=${url}&apikey=${alyapi}`)
return api
}