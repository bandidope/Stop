// code creador por barboza 
// Se te agradece que dejes mis créditos gracias disfruta el código

import axios from "axios"

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `*🔍 DEBE INGRESAR UN USUARIO*\n\nUso: ${usedPrefix}${command} [username]\nEjemplo: ${usedPrefix}${command} twice_tiktok_official`, m)

    await m.react('👤')

    try {
        const response = await axios.get(`https://api.delirius.store/tools/tiktokstalk?q=${encodeURIComponent(text)}`)
        const res = response.data

        if (!res.status) return m.reply('❌ No se encontró información del usuario.')

        const { users, stats } = res.result
        
        let profile = `✨ *TIKTOK STALK* ✨\n`
        profile += `\n*╭─── [ PERFIL ] ───*`
        profile += `\n│ 🏷️ *Nombre:* ${users.nickname}`
        profile += `\n│ 👤 *Usuario:* @${users.username}`
        profile += `\n│ 🛡️ *Verificado:* ${users.verified ? 'Oficial' : 'No'}`
        profile += `\n│ 📄 *Bio:* ${users.signature || 'Sin descripción'}`
        profile += `\n*╰───────────────*\n`
        profile += `\n*╭── [ ESTADÍSTICAS ] ──*`
        profile += `\n│ 👥 *Seguidores:* ${stats.followerCount.toLocaleString()}`
        profile += `\n│ 👣 *Siguiendo:* ${stats.followingCount.toLocaleString()}`
        profile += `\n│ 💖 *Me gusta:* ${stats.heartCount.toLocaleString()}`
        profile += `\n│ 🎥 *Videos:* ${stats.videoCount.toLocaleString()}`
        profile += `\n*╰───────────────*\n`
        profile += `\n🔗 *URL:* ${users.url}`
        profile += `\n\n*By: Barboza Developer*`

        await conn.sendMessage(m.chat, { 
            image: { url: users.avatarLarger }, 
            caption: profile 
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        await m.react('❌')
        console.error(e)
        m.reply('⚠️ Ocurrió un error al consultar el perfil.')
    }
}

handler.help = ['tiktokstalk']
handler.tags = ['tools']
handler.command = ['tiktokstalk', 'ttstalk','tiktokuser']

export default handler