let handler = async (m, { conn }) => {

const stats = global.db.data?.stats || {}

if (!Object.keys(stats).length) {
return m.reply('⛅ No hay comandos usados.')
}

function clockString(ms) {
if (typeof ms !== 'number' || ms < 0) return '00:00:00'
let h = Math.floor(ms / 3600000)
let m = Math.floor((ms % 3600000) / 60000)
let s = Math.floor((ms % 60000) / 1000)
return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

let texto = '📈 *Estadísticas de Plugins*\n\n'
const now = +new Date()

const entries = Object.entries(stats).sort((a, b) => b[1].total - a[1].total)

for (let i = 0; i < Math.min(entries.length, 15); i++) {
const [plugin, data] = entries[i]
const total = data.total || 0
const success = data.success || 0
const fails = total - success
const last = data.last || 0
const ago = clockString(now - last)

texto += `*${i + 1}.* ${plugin}
├ 🌴 Total: ${total}
├ 🪐 Éxito: ${success}
├ 😿 Fallos: ${fails}
└ 🕒 Último uso: ${ago || 'hace poco'}\n\n`
}

conn.reply(m.chat, texto.trim(), m, fake)
}

handler.command = ['stats', 'estadisticas']
handler.help = ['stats']
handler.tags = ['info']
handler.owner = true

export default handler