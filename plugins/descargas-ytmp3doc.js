import axios from 'axios'
import * as cheerio from 'cheerio'
import { randomBytes } from 'crypto'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.reply(
      m.chat,
      `╭─[ TikTok Booster ]─╮
│ 📌 Uso: ${usedPrefix + command} <url>
│ 🧪 Ejemplo:
│ ${usedPrefix + command} https://vt.tiktok.com/ZS2abc123/
│ 🎯 Función: Vistas y likes gratis
│ ⚡ Límite: 3 usos diarios
╰───────────────────╯`,
      m
    )
  }

  const url = text.trim()

  if (!url.includes('tiktok.com') && !url.includes('vt.tiktok.com')) {
    return await conn.reply(m.chat, '❌ URL inválida. Usa un enlace de TikTok válido.', m)
  }

  await m.react('🔄')

  try {
    const booster = new TikTokBooster()
    const result = await booster.boost(url)

    if (!result.success) {
      await m.react('❌')
      return await conn.reply(m.chat, `❌ Error: ${result.message}`, m)
    }

    await m.react('✅')

    const { video, result: boostResult } = result

    const response = `╭─[ TikTok Booster ]─╮
│ 🎬 Video: ${video.title || 'Sin título'}
│ 👤 Autor: @${video.unique_id || video.author}
│ ⏱️ Estado: Boost iniciado
│ 👁️ Progreso: Vistas y likes en cola
│ 📊 Uso diario: ${boostResult.used} / 3
│ 🎁 Restantes: ${boostResult.remaining}
│ 🔔 Nota: Resultados en minutos
╰───────────────────╯`

    await conn.reply(m.chat, response, m)

  } catch (error) {
    await m.react('❌')
    await conn.reply(m.chat, `❌ Error inesperado: ${error.message}`, m)
  }
}

handler.help = ['ttboost <url>']
handler.tags = ['tools']
handler.command = /^(ttboost|tiktokboost|boosttiktok|tikboost)$/i

export default handler

class TikTokBooster {
  constructor() {
    this.baseUrl = 'https://on4t.com'
    this.userAgent = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
  }

  formatCookie(cookies) {
    if (!cookies) return ''
    return cookies.map(c => c.split(';')[0]).join('; ')
  }

  generateFingerprint() {
    return randomBytes(16).toString('hex')
  }

  async solveTurnstile() {
    const { data } = await axios.post(
      'https://fathurweb.qzz.io/api/solver/turnstile-min',
      new URLSearchParams({
        url: 'https://on4t.com/tiktok-video-booster',
        siteKey: '0x4AAAAAAA_AzqcGkpvXo7np'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000
      }
    )

    if (data.status && data.result) return data.result
    throw new Error('No se pudo resolver el captcha')
  }

  async boost(videoUrl) {
    try {
      const pageResponse = await axios.get(`${this.baseUrl}/tiktok-video-booster`, {
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000
      })

      const $ = cheerio.load(pageResponse.data)
      const csrfToken = $('meta[name="csrf-token"]').attr('content')
      const cookies = this.formatCookie(pageResponse.headers['set-cookie'])

      if (!csrfToken) throw new Error('Token de seguridad no encontrado')

      const headers = {
        accept: '*/*',
        'content-type': 'application/json',
        origin: this.baseUrl,
        referer: `${this.baseUrl}/tiktok-video-booster`,
        'x-csrf-token': csrfToken,
        cookie: cookies,
        'user-agent': this.userAgent
      }

      const turnstileToken = await this.solveTurnstile()

      const parseResponse = await axios.post(
        `${this.baseUrl}/free-tiktok-views/video`,
        {
          url: videoUrl,
          'cf-turnstile-response': turnstileToken
        },
        { headers, timeout: 15000 }
      )

      const videoData = parseResponse.data

      const boostResponse = await axios.post(
        `${this.baseUrl}/free-tiktok-views/views`,
        {
          link: videoUrl,
          fingerprint_id: this.generateFingerprint(),
          tool_type: 'on4t-video-booster'
        },
        { headers, timeout: 15000 }
      )

      return {
        success: true,
        video: {
          title: videoData.title || '',
          author: videoData.author || '',
          unique_id: videoData.unique_id || ''
        },
        result: boostResponse.data
      }

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      }
    }
  }
}