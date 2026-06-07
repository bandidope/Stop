let handler = async (m, {conn, command}) => {
  let url = tren[Math.floor(Math.random() * trend.length)];
    await conn.sendFile( 
     m.chat, 
     url, 
     "gimage.jpg", 
     ` 
 𝗧𝗥𝗘𝗡𝗗 𝗗𝗘 𝗧𝗜𝗞 𝗧𝗢𝗞`.trim(), m)
};
handler.help = ["trend"];
handler.tags = ["internet"];
handler.command = /^(trend)$/i;
export default handler;

global.trend = [
  "https://h.uguu.se/CQssvkFW.mp4",
];
