let handler = async (m, {conn, command}) => {
  let url = chicas[Math.floor(Math.random() * chicas.length)];
    await conn.sendFile( 
     m.chat, 
     url, 
     "gimage.jpg", 
     ` 
 𝗧𝗥𝗘𝗡𝗗 𝗗𝗘 𝗧𝗜𝗞 𝗧𝗢𝗞`.trim(), m)
};
handler.help = ["chicas < Trend Tik Tok >"];
handler.tags = ["internet"];
handler.command = /^(chicas)$/i;
export default handler;

global.chicas = [
  "https://h.uguu.se/CQssvkFW.mp4",
"https://n.uguu.se/EYXSehZA.mp4",
"https://o.uguu.se/SRVFXrQp.mp4",
"https://h.uguu.se/mdlwLrkF.mp4",
"https://o.uguu.se/itiAFsYL.mp4",
"https://h.uguu.se/hqAOEQcN.mp4",
"https://o.uguu.se/FVZCcpqU.mp4",
"https://n.uguu.se/LeROBZSp.mp4",
"https://o.uguu.se/VMxmUQsy.mp4",

];
