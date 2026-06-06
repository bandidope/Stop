let handler = async (m, { conn, text}) => {
  if (!text) return m.reply('📌 Ejemplo de uso:\n.iqc Pollo frito con papas')

  let hora = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'America/Caracas', // Puedes ajustarlo a tu zona
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}).format(new Date())

  await conn.sendMessage(m.chat, {
    image: {
      url: `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(hora)}&batteryPercentage=${Math.floor(Math.random() * 100) + 1}&carrierName=CLARO&messageText=${encodeURIComponent(text.trim())}&emojiStyle=apple`
}
}, { quoted: m})
}

handler.help = ['iqc <mensaje>']
handler.tags = ['creador']
handler.command = ['iqc']

export default handler