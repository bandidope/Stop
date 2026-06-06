let handler = async (m, { conn, usedPrefix, command, text }) => {
    let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    if (!target) return m.reply(`¡Responde o etiqueta a la persona!\n\nEjemplo:\n${usedPrefix + command} @${m.sender.split("@")[0]}`, false, { mentions: [m.sender] })
    if (target == m.sender) return m.reply("No puedes expulsarte a ti mismo.")
    
    await m.reply("✨🎩 ¡Bienvenidos al espectáculo de magia de esta noche! 🎩✨")
    await delay(2000)
    await m.reply("🔮 Hoy, haremos algo extraordinario... 🔮")
    await delay(2000)
    await m.reply("🧙‍♂️ Prepárense... Miren con atención... 🧙‍♂️")
    await delay(2000)
    await m.reply("✨ Sim Salabim... Haciendo desaparecer lo inesperado... ✨")
    await delay(2000)
    await m.reply("🎩 Abracadabra... Miren... Algo asombroso está a punto de suceder... 🎩")
    await delay(2000)
    await m.reply("🪄 Hocus Pocus... Listo para hacer desaparecer a alguien... 🪄")
    await delay(2000)
    await m.reply("✨ ¡Prepárense!... Todo desaparecerá en un instante... ✨")
    await delay(2000)
    await m.reply("🌟 *¡Y...!* 🌟")
    await delay(1000)
    await m.reply("💥 *¡Puf!* ¡Este miembro ha desaparecido del grupo... 💥")
    await delay(2000)
    
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    await m.reply(`¡Se ha expulsado con éxito a @${target.split("@")[0]} del grupo! 🧙‍♂️✨`, false, { mentions: [target] })
}

handler.help = ['sulap']
handler.tags = ['grupo']
handler.command = /^(sulap)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
export default handler

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
