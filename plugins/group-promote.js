var handler = async (m, { conn,usedPrefix, command, text }) => {

    var done = '✅'; 

    if (isNaN(text) && !text.match(/@/g)){
        
    } else if (isNaN(text)) {
        var number = text.split`@`[1];
    } else if (!isNaN(text)) {
        var number = text;
    }

    if (!text && !m.quoted) return conn.reply(m.chat, `*Debes responder a un mensaje de aquel usuario cual le darás admin.*`, m,rcanal);
    
    if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) return conn.reply(m.chat, `*Debes responder a un mensaje de aquel usuario cual le darás admin.*`, m,rcanal);

    try {
        var user;
        if (text) {
            user = number + '@s.whatsapp.net';
        } else if (m.quoted && m.quoted.sender) { 
            user = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) { 
            user = m.mentionedJid[0]; 
        } 
    } catch (e) {
        console.error("Error determining user:", e); 
        return conn.reply(m.chat, `Ocurrió un error al identificar al usuario.`, m);
    } finally {
        if (user) { 
            await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
            conn.reply(m.chat, `${done} Fue agregado como admin del grupo con éxito.`, m);
        } else {
            conn.reply(m.chat, `No se pudo identificar a ningún usuario válido para promover.`, m);
        }
    }
}

handler.help = ['daradmin'];
handler.tags = ['grupo'];
handler.command = ['promote','daradmin', 'promover']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
