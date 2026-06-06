const linkRegex = /chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
const channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,30})/i;

export async function before(m, { conn, isAdmin, isBotAdmin}) {
  // Ignorar mensajes del propio bot o fuera de grupos
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  const chat = global.db.data.chats[m.chat];
  const botSettings = global.db.data.settings[conn.user.jid] || {};

  const isGroupLink = linkRegex.exec(m.text);
  const isChannelLink = channelLinkRegex.exec(m.text);

  // Si antiLink está activado y se detecta un enlace, y el usuario no es admin
  if (chat.antiLink && (isGroupLink || isChannelLink) &&!isAdmin) {
    if (!isBotAdmin) {
      await conn.reply(
        m.chat,
        `⚠️ Enlace detectado, pero necesito ser administrador para tomar acción.`,
        m,
        { mentions: [m.sender]}
);
      return true;
}

    // Verificar si el enlace es del mismo grupo
    const thisGroupCode = await conn.groupInviteCode(m.chat);
    const thisGroupLink = `https://chat.whatsapp.com/${thisGroupCode}`;

    if (m.text.includes(thisGroupLink)) return true; // No expulsar si es el mismo grupo

    // Eliminar el mensaje
    await conn.sendMessage(m.chat, { delete: m.key});

    // Notificar y expulsar al usuario
    await conn.reply(
      m.chat,
      `⚠️ *Enlace externo detectado*\n\n*@${m.sender.split('@')[0]}* ha sido eliminado por compartir enlaces externos.`,
      m,
      { mentions: [m.sender]}
);

    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
}

  return true;
}