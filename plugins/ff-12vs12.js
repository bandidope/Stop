import fg from 'api-dylux' 
import fetch from 'node-fetch'
import axios from 'axios'
let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!args[0]) throw `
╰› 12 Versus 12 Ი𐑼
⊹ ࣪ ˖🕚 🇵🇪  | 🇦🇷   |  🇨🇱 
૮🩹ა *Encargad@*: 
˚꒰🏡୭ *Reglas :* 
˚꒰🆚୭ *Rival :* 
𓍼   ׅ *Escuadra 1 :*
⚡|  
⚡|  
⚡|  
⚡|  

𓍼   ׅ *Escuadra 2 :*
⚡|  
⚡|  
⚡|  
⚡|  

𓍼   ׅ *Escuadra 3 :*

⚡|  
⚡|  
⚡|  
⚡|  

𓍼         ִ  *Suplentes :*
🐾𑁤  
🐾𑁤  
🐾𑁤  
🐾𑁤  
` 
}
handler.help = ['12vs12']
handler.tags = ['ff']
handler.command = /^(12vs12)$/i
handler.group = false
handler.admin = false
export default handler