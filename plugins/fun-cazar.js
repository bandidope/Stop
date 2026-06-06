import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: "🚘", key: m.key }})

    let img = 'https://files.catbox.moe/dcp02s.jpg'
    let nombre = 'Eliud'
    let numero = '50671463198' // Formato limpio para link
    
    let caption = `👋 *Hola, soy Vans bot* 🚘\n\n👤 *Creador:* ${nombre}\n📱 *Contacto:* +${numero}\n\n> Si tienes dudas o reportes, escribe al número de arriba.`

    // Enviamos la imagen con el texto
    await conn.sendFile(m.chat, img, 'owner.jpg', caption, m)

    // Enviamos el contacto de forma más simple y compatible
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${nombre}\nTEL;type=CELL;type=VOICE;waid=${numero}:+${numero}\nEND:VCARD`
    
    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: nombre,
            contacts: [{ vcard }]
        }
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply(`❌ Error al mostrar el contacto.`)
  }
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creador', 'contacto']

export default handler
