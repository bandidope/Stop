let handler = async (m, {conn, command}) => {
  let url = chicos[Math.floor(Math.random() * chicos.length)];
    await conn.sendFile( 
     m.chat, 
     url, 
     "gimage.jpg", 
     ` 
 𝗧𝗥𝗘𝗡𝗗 𝗗𝗘 𝗧𝗜𝗞 𝗧𝗢𝗞`.trim(), m)
};
handler.help = ["chicos < Trend Tik Tok >"];
handler.tags = ["internet"];
handler.command = /^(chicos)$/i;
export default handler;

global.chicos = [
  "https://h.uguu.se/GkAgLKkS.mp4",
  "https://h.uguu.se/iawSRnSy.mp4",
  "https://n.uguu.se/vaYvxtbR.mp4",
  "https://h.uguu.se/aVqUsKjc.mp4",
  "https://n.uguu.se/oLfFgjGF.mp4",
  "https://o.uguu.se/OlNbwaTA.mp4",
  "https://n.uguu.se/lzMXGXaV.mp4",
  "https://d.uguu.se/hwScSbFO.mp4",
];
