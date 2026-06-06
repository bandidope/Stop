import fg from 'api-dylux' 
import fetch from 'node-fetch'
import axios from 'axios'
let handler = async (m, { conn, args, command, usedPrefix }) => {
if (!args[0]) throw `
𖥔 ݁ ˖🐉•𝐀𝐏𝐎𝐒𝐓 ¡!👹

   ╰ ࣪ ˖ ∿ 𝘀𝗮𝗹𝗮:
⋆ 1rᥲ : 𝐑𝐈𝐕𝐀𝐋
⋆ 2dᥲ : 
⋆ 3rᥲ : Pᥱrdᥱdor dᥱ ρrιmᥱrᥲ
⋆ 13 roᥒdᥲs 
⋆ 9950 moᥒᥱdᥲs
⋆ ᥲdιtᥲmᥱᥒtos ყ ᥲιrdroρ ᥱᥒ ᥒo
⋆ Proριᥱdᥲd dᥱ ᥲrmᥲs NO
⋆ ρᥴ ᥲ ᥴoordιᥒᥲr

* ˖ ∿ 𝗔𝗰𝗹𝗮𝗿𝗮𝗰𝗶𝗼𝗻𝗲𝘀:*
ᨳ࣪  hᥲbιᥣιdᥲd ᥲᥴtιvᥲ ᥲᥣok
ᨳ࣪  mᥲsᥴotᥲ ᥣιbrᥱ
ᨳ࣪  h. ρᥲsιvᥲs soᥣo moᥴo, kᥱᥣᥣყ, mᥲxιm
ᨳ࣪  Cαncelαr 1hrs αntes el vs o es gαnαdo pαrα 𝐁𝐀𝐃 𝐄-𝐒𝐏𝐎𝐑𝐓𝐒
ᨳ࣪ ᥲᥣtᥙrᥲ permitida *auto, cajas, paredes, compañero, conteiners y muro de peak* 
ᨳ࣪  1 m10 ρor ᥱqᥙιρo
ᨳ࣪  10 mιᥒᥙtos dᥱ toᥣᥱrᥲᥒᥴιᥲ ρᥲrᥲ todo
*ᨳ࣪  2 ᥱsρᥱᥴ x ᥱqᥙιρo ( ᥒo mιrᥲr ᥲ rιvᥲᥣ)*
ᨳ࣪ mᥲx 2 ᥴᥲmbιos
ᨳ࣪ Cᥣᥲᥒ todos ᥱᥒ ᥱᥣ mιsmo
ᨳ࣪ Tᥱᥲm 2 ᥴoᥒ tᥲg, sιᥒ tᥲg 1 ᥴᥲmbιo 
ᨳ࣪ 7-3 ρᥲrᥲ rιvᥲᥣ
ᨳ࣪ armas solo ump/desert/m1014
ᨳ࣪ 1ra ronda desert, despues ya no vale
ᨳ࣪ casco nvl 2/chaleco nvl 3

 ˖ ∿ 𝗣𝗿𝗼𝗵𝗶𝗯𝗶𝗱𝗼:
ᨳ࣪ hᥲᥴks / hᥲbιᥣιdᥲdᥱs rᥲtᥲs
ᨳ࣪ ᥴhιρs/frᥲᥒᥴos/ᥲr
ᨳ࣪ mᥱtᥱr hombrᥱs 🏳️‍🌈
ᨳ࣪ ρᥴ tᥱᥣᥲs
ᨳ࣪ Cuentαs -45
` 
}
handler.help = ['apostado']
handler.tags = ['ff']
handler.command = /^(apostado)$/i
handler.group = false
handler.admin = false
export default handler