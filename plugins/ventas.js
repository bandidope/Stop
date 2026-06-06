import fg from 'api-dylux' 
import fetch from 'node-fetch'
import axios from 'axios'
let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!args[0]) throw `
*Holiss , Quieres Saber Los Precios? O Quieres Revender El Bot ? 🥴*

Acá Te Dejo Los Precios De McQueen Bot ⚡

> *PRECIOS GRUPO PERMANENTE :*
- 🌀 Grupo X1 = 5 Soles
- 🌀 Grupo X3 = 10 Soles
- 🌀 Grupo X5 = 15 Soles

> *PRECIOS BOT PERSONALIZADO :*
- 🌀 Bot Personalizado ( Termux ) = 18 Soles
- 🌀 Servidor Mensual : 10 Soles
- 🌀 Archivos Premium Bot = 35 Soles
- 🌀 Bot Personalizado + Servidor = 25 Soles

*Nota :* Recuerda Al Revender Ganarás El 40% De Lo Que Vendas, Menos El Producto ( Servidor ) 

https://chat.whatsapp.com/Fi6FHZ8VSGnAT7CKJkcd9r?mode=gi_t
` 
}
handler.help = ['comprar']
handler.tags = ['Arceus']
handler.command = /^(comprar)$/i
handler.group = false
handler.admin = false
export default handler