let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Determinamos quién es el objetivo (mención, respuesta o texto)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null;

    // Si no se encuentra a nadie, enviamos el ejemplo de uso
    if (!who) return conn.reply(m.chat, `*Etiqueta a un therian para ganar la partida.*\n\nEjemplo: ${usedPrefix + command} @usuario`, m);

    // Obtenemos el nombre del usuario de forma segura
    let user = global.db.data.users[who]
    let name = user ? user.name : await conn.getName(who);

    // El mensaje final con el nombre y el texto que pediste
    let mensaje = `*te haz follado un therian y lo fuiste a tirar al río con sus amigos los lagartos easy win🦎🏆*`;

    // Enviamos el mensaje con la mención activa
    await conn.sendMessage(m.chat, { 
        text: mensaje, 
        mentions: [who] 
    }, { quoted: m });
}

handler.help = ['therian @user'];
handler.tags = ['diversión'];
handler.command = ['therians', 'therian'];

export default handler;
