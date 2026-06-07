/*
  Código Creado Por MediaHub Software
  Funcionalidad: Mejora calidad, escala y elimina fondo de imágenes usando Sharpify API
  Modos: enhance (mejorar hd), upscale (ampliar), removebg (quitar fondo)
*/

import fetch from 'node-fetch'
import FormData from 'form-data'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const apiHeaders = {
  'User-Agent': 'okhttp/4.9.2',
  'Accept-Encoding': 'gzip'
}

const modelos = {
  enhance: 'https://sharpify-api.vercel.app/api/enhance/auto_enhance',
  upscale: 'https://sharpify-api.vercel.app/api/enhance/upscale',
  removebg: 'https://sharpify-api.vercel.app/api/enhance/bgrem'
}

async function getImageBuffer(m, conn) {
  const msg = m.message
  const types = ['imageMessage', 'ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2']

  let imageMsg = null

  for (const t of types) {
    if (msg?.[t]) {
      imageMsg = t === 'ephemeralMessage'
        ? msg[t]?.message?.imageMessage
        : t.startsWith('viewOnce')
          ? msg[t]?.message?.imageMessage
          : msg[t]
      if (imageMsg) break
    }
  }

  if (!imageMsg && m.quoted) {
    const q = m.quoted
    const qMsg = q.message || q.msg || q

    for (const t of types) {
      if (qMsg?.[t]) {
        imageMsg = t === 'ephemeralMessage'
          ? qMsg[t]?.message?.imageMessage
          : t.startsWith('viewOnce')
            ? qMsg[t]?.message?.imageMessage
            : qMsg[t]
        if (imageMsg) break
      }
    }

    if (!imageMsg && (q.mimetype || '').startsWith('image/')) {
      imageMsg = q
    }
  }

  if (!imageMsg) return null
  const stream = await downloadContentFromMessage(imageMsg, 'image')
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks)
}

async function sharpify(imgBuffer, modelo) {
  const form = new FormData()
  form.append('file', imgBuffer, { filename: 'source.jpg', contentType: 'image/jpeg' })

  const res = await fetch(modelos[modelo], {
    method: 'POST',
    headers: { ...apiHeaders, ...form.getHeaders() },
    body: form
  })

  if (!res.ok) throw new Error(`Error del servidor: ${res.status}`)
  const data = await res.json()
  return data
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let modo = (args[0] || '').toLowerCase()
  if (!modo || !modelos[modo]) {
    if (/upscale/i.test(command)) modo = 'upscale'
    else if (/removebg/i.test(command)) modo = 'removebg'
    else modo = 'enhance'
  }

  if (!modelos[modo]) {
    return conn.reply(m.chat,
      `╭─❒「 ✨ sʜᴀʀᴘɪғʏ 」\n` +
      `│ ❌ Modo *${modo}* no válido.\n` +
      `│ Usa: enhance, upscale, removebg\n` +
      `╰─⬣`, m)
  }

  await m.react('🔄')

  let imgBuffer
  try {
    imgBuffer = await getImageBuffer(m, conn)
  } catch (e) {
    console.error('[Sharpify] Error descargando imagen:', e.message)
  }

  if (!imgBuffer) {
    await m.react('🔴')
    return conn.reply(m.chat,
      `╭─❒「 ✨ sʜᴀʀᴘɪғʏ 」\n` +
      `│\n` +
      `│ ᴜsᴏ: *${usedPrefix}${command}* [modo]\n` +
      `│ *(responde o envía una imagen)*\n` +
      `│\n` +
      `│ 📌 *Modos disponibles:*\n` +
      `│ • *enhance* — Mejora automática hd\n` +
      `│ • *upscale* — Ampliar resolución\n` +
      `│ • *removebg* — Quitar fondo\n` +
      `│\n` +
      `│ 📋 *Ejemplos:*\n` +
      `│ ${usedPrefix}${command} enhance\n` +
      `│ ${usedPrefix}${command} upscale\n` +
      `│ ${usedPrefix}${command} removebg\n` +
      `│\n` +
      `│ © ᴍᴇᴅɪᴀʜᴜʙ sᴏғᴛᴡᴀʀᴇ 🌐\n` +
      `╰─⬣`, m)
  }

  try {
    const data = await sharpify(imgBuffer, modo)

    const imgUrl = data?.url || data?.image || data?.result || data?.output

    if (!imgUrl) {
      console.error('[Sharpify] Respuesta API:', JSON.stringify(data))
      throw new Error('La API no devolvió imagen. Intenta con otra foto.')
    }

    const caption =
      `╭─❒「 ✨ sʜᴀʀᴘɪғʏ 」\n` +
      `│\n` +
      `│ ✅ *Imagen procesada*\n` +
      `│ 🎨 *Modo:* ${modo}\n` +
      `│\n` +
      `│ © ᴍᴇᴅɪᴀʜᴜʙ sᴏғᴛᴡᴀʀᴇ 🌐\n` +
      `╰─⬣`

    if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
      await conn.sendMessage(m.chat, { image: { url: imgUrl }, caption }, { quoted: m })
    } else {
      const buf = Buffer.from(imgUrl, 'base64')
      await conn.sendMessage(m.chat, { image: buf, caption }, { quoted: m })
    }

    await m.react('✅')

  } catch (e) {
    await m.react('🔴')
    console.error('[Sharpify] Error:', e.message)
    return conn.reply(m.chat,
      `╭─❒「 ᴇʀʀᴏʀ 」\n` +
      `│ 🚫 Error al procesar imagen\n` +
      `│\n` +
      `│ ❌ ${e.message}\n` +
      `│\n` +
      `╰─⬣`, m)
  }
}

handler.help = ['remini [enhance|upscale|removebg]']
handler.tags = ['editor']
handler.command = /^(remini|upscale|removebg)$/i

export default handler