import axios from 'axios'
import * as cheerio from 'cheerio';

let handler = async (m, { conn, text}) => {
  if (!text) return m.reply('Ingresa un nombre de usuario, ejemplo: cscstalk ZenzzXD')
  await m.reply('⏳ Obteniendo datos...')
  try {
    let username = text.trim()
    let result = await buscarPerfil(username)
    if (!result ||!result.perfil) return m.reply('❌ No se pudo obtener la información 😂')

    let txt = `*Perfil de Codeshare*\n`
    txt += `• Usuario: ${result.perfil.username}\n`
    txt += `• Biografía: ${result.perfil.bio || '-'}\n`
    txt += `• Seguidores: ${result.perfil.followers}\n`
    txt += `• Siguiendo: ${result.perfil.following}\n\n`

    if (result.snippets.length) {
      txt += `*Total de snippets: ${result.snippets.length}*\n`
      result.snippets.forEach((snip, i) => {
        txt += `${i + 1}. ${snip.title} | lenguaje: (${snip.language})\n`
        txt += `   ${snip.date} | ${snip.views} vistas\n`
        txt += `   ${snip.url}\n`
})
} else {
      txt += `No hay snippets en esta cuenta`
}

    let imagen = result.perfil.avatar || result.perfil.banner || null
    if (imagen) {
      await conn.sendFile(m.chat, imagen, '_perfil.jpg', txt, m)
} else {
      m.reply(txt)
}
} catch (e) {
    m.reply(`❌ Error: ${e.message}`)
}
}

handler.help = ['cscstalk <usuario>']
handler.command = ['cscstalk']
handler.tags = ['stalker']

export default handler

async function buscarPerfil(username) {
  const url = `https://codeshare.cloudku.click/profile?user=${username}`
  const { data} = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
}
})

  const $ = cheerio.load(data)
  const banner = $('#banner-preview').attr('src')
  const avatar = $('#avatar-preview').attr('src')
  const bio = $('.profile-bio').text().trim()
  const followers = $('.profile-stats.stat-item').first().find('strong').text().trim()
  const following = $('.profile-stats.stat-item').last().find('strong').text().trim()

  const snippets = []
  $('.snippets-grid.snippet-card').each((i, el) => {
    const title = $(el).find('h3').text().trim()
    const date = $(el).find('.snippet-meta time').text().trim()
    const lang = $(el).find('.lang-tag').text().trim()
    const views = $(el).find('.card-stats span').text().trim()
    const link = $(el).find('a').attr('href')
    snippets.push({
      title,
      date,
      language: lang,
      views: parseInt(views || '0'),
      url: link? (link.startsWith('http')? link: `https://codeshare.cloudku.click/${link}`): null
})
})

  return {
    perfil: {
      username,
      banner: banner? (banner.startsWith('http')? banner: `https://codeshare.cloudku.click/${banner}`): null,
      avatar: avatar? (avatar.startsWith('http')? avatar: `https://codeshare.cloudku.click/${avatar}`): null,
      bio,
      followers: parseInt(followers || '0'),
      following: parseInt(following || '0')
},
    snippets
}
}