import fg from 'api-dylux' 
import fetch from 'node-fetch'
import axios from 'axios'
let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!args[0]) throw `
╰› 6 Versus 6 Ი𐑼
⊹ ࣪ ˖🕚 🇵🇪  | 🇦🇷   |  🇨🇱 
૮🩹ა *Encargad@*: 
˚꒰🏡୭ *Reglas :* 
˚꒰🆚୭ *Rival :* 
𓍼   ׅ *Titulares :*
⚡|  
⚡|  
⚡|  
⚡|  
⚡|  
⚡|  

𓍼         ִ  *Suplentes :*
🐾𑁤  
🐾𑁤
` 
}
handler.help = ['6vs6']
handler.tags = ['ff']
handler.command = /^(6vs6)$/i
handler.group = false
handler.admin = false
export default handler