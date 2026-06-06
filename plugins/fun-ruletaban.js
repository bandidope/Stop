/*let handler = async (m, { conn, participants }) => {
    const gAdmins = participants.filter(p => p.admin);
    const botId = conn.user.jid;
    const gOwner = gAdmins.find(p => p.isAdmin)?.id;
    const gNoAdmins = participants.filter(p => p.id !== botId && p.id !== gOwner && !p.admin);

    if (participants.length === gAdmins.length) { 
        return m.reply('*[ ⚠️ ] Solo hay administradores en este grupo.*');
    }

    if (gNoAdmins.length === 0) {
        return m.reply('*[ ⚠️ ] No hay usuarios disponibles para eliminar.*');
    }

    // Enviar primer mensaje normal
    //await conn.reply(m.chat, '*[ 🎰 ] La ruleta está girando...*', m);

    // Enviar mensaje inicial para edición de cuenta regresiva
    let msg = await conn.reply(m.chat '*[ 🎰 ] La ruleta está comenzando a girar...*', m);

    // Cuenta regresiva con edición del mensaje
    const countdown = ['*[ 🎰 ] La ruleta está girando...*'];
    for (let i = 0; i < countdown.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await conn.sendMessage(m.chat, { text: countdown[i], edit: msg.key });
    }

    // Elegir usuario aleatorio
    const randomUser = gNoAdmins[Math.floor(Math.random() * gNoAdmins.length)];
    const tag = await conn.getName(randomUser.id);

    // Anunciar al perdedor con un mensaje normal
    await new Promise(resolve => setTimeout(resolve, 2000));
    await conn.reply(m.chat, `*[ 🎰 ] La ruleta ha elegido a:*\n${tag}\n\n😈 *¡Adiós!*`, m);

    // Esperar antes de eliminar para dramatismo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Eliminar usuario
    await conn.groupParticipantsUpdate(m.chat, [randomUser.id], 'remove');

    // Mensaje de confirmación final
    await new Promise(resolve => setTimeout(resolve, 1000));
    await conn.reply(m.chat, `*Bueno, un pajero menos 👻*`, m);

    m.react('✅');
};

handler.help = ['ruletaban']
handler.tags = ['fun']
handler.command = /^(ruletaban|rban)$/i;
handler.group = true;
handler.botAdmin = true;
handler.admin = true;

export default handler;*/