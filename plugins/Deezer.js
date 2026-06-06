/**
 * 📂 COMANDO: Uchiha Deezer Downloader
 * 📝 DESCRIPCIÓN: Busca y descarga pistas de música mediante Deezer.
 * 👤 CREADOR: Barboza Developer
 * ⚡ CANAL: Barboza Developer x Zona Developers
 * Usen los código porfa para traer más 
 * 🔗 API: https://api.evogb.org
 */

import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text || (m.quoted && m.quoted.text ? m.quoted.text : '')

    if (!query) {
        let alert = `🎵 DEEZER DOWNLOADER 🎵\n`
        alert += `───────────────────────────────────────\n`
        alert += `> *Escribe el nombre de la canción que quieres buscar.*\n`
        alert += `> *Uso:* ${usedPrefix + command} Hay Lupita`
        return conn.reply(m.chat, alert, m)
    }

    await m.react('🕒')

    try {
        const searchApi = "https://api.evogb.org/search/deezer"
        const dlApi = "https://api.evogb.org/dl/deezer"

        const searchResponse = await axios.get(`${searchApi}?query=${encodeURIComponent(query)}&limit=1`)
        const searchResult = searchResponse.data

        if (!searchResult?.status || !searchResult.data || searchResult.data.length === 0) {
            await m.react('❌')
            return conn.reply(m.chat, '❌ No se encontraron resultados.', m)
        }

        const trackData = searchResult.data[0]
        const trackUrl = trackData.url

        const dlResponse = await axios.get(`${dlApi}?url=${encodeURIComponent(trackUrl)}`)
        const dlResult = dlResponse.data

        if (!dlResult?.status || !dlResult.data?.dl) {
            await m.react('❌')
            return conn.reply(m.chat, '❌ Error al procesar la descarga.', m)
        }

        let txt = `🪐 DEEZER CORE AUDIO TUNNEL 🪐\n`
        txt += `───────────────────────────────────────\n`
        txt += `  » 🎵 Track  : ${dlResult.data.title}\n`
        txt += `  » 👤 Artist : ${dlResult.data.artist}\n`
        txt += `  » 💿 Album  : ${dlResult.data.album}\n`
        txt += `  » 📅 Year   : ${dlResult.data.release_date}\n`
        txt += `  » ⏳ Length : ${dlResult.data.duration}\n`
        txt += `───────────────────────────────────────\n`
        txt += `[██████████] 100% Buffering Audio File...\n`
        txt += `───────────────────────────────────────\n`
        txt += `⚡ Whois Developer x Team Nightwish`

        await conn.sendMessage(m.chat, { image: { url: dlResult.data.cover }, caption: txt }, { quoted: m })

        await conn.sendMessage(m.chat, { 
            audio: { url: dlResult.data.dl }, 
            mimetype: 'audio/mpeg', 
            fileName: `${dlResult.data.title}.mp3` 
        }, { quoted: m })

        await m.react('🔥')

    } catch (e) {
        await m.react('❌')
    }
}

handler.help = ['deezer', 'music']
handler.tags = ['tools']
handler.command = /^(deezer|music|song)$/i

export default handler