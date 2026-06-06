import { sticker, addExif } from '../lib/sticker.js'
import axios from 'axios'
import fetch from 'node-fetch'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const fetchSticker = async (text, attempt = 1) => {
try {
const response = await axios.get(`https://skyzxu-brat.hf.space/brat`, { params: { text }, responseType: 'arraybuffer' })
return response.data
} catch (error) {
if (error.response?.status === 429 && attempt <= 3) {
const retryAfter = error.response.headers['retry-after'] || 5
await delay(retryAfter * 1000)
return fetchSticker(text, attempt + 1)
}
throw error
}}
const fetchStickerVideo = async (text) => {
const response = await axios.get(`https://skyzxu-brat.hf.space/brat-animated`, { params: { text }, responseType: 'arraybuffer' })
if (!response.data) throw new Error('Error al obtener el video de la API.')
return response.data
}
const fetchJson = (url, options) =>
new Promise((resolve, reject) => { fetch(url, options).then(res => res.json()).then(json => resolve(json)).catch(err => reject(err)) })
const handler = async (m, { conn, text, args, command, usedPrefix }) => {
try {
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}
let texto1 = packstickers.text1 || global.packsticker
let texto2 = packstickers.text2 || global.packsticker2
switch (command) {
case 'bratv': {
text = m.quoted?.text || text
if (!text) return conn.sendMessage(m.chat, { text: '❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker.' }, { quoted: m })
await m.react('🕒')
const videoBuffer = await fetchStickerVideo(text)
const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)
await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
await m.react('✔️')
break
}}

handler.tags = ['sticker']
handler.help = ['bratv']
handler.command = ['bratv']

export default handler