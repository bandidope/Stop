let handler = async (m, { conn, groupMetadata }) => {
    // Check if the 'restrict' feature is enabled for the bot.
    // This allows only the bot owner to use commands if restrict is true.
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (bot.restrict && !m.isOwner) { // Assuming m.isOwner is available for owner check
        return m.reply(`⚠️ Solo el propietario puede usar este comando.`);
    }

    // Ensure the command is used in a group.
    if (!m.isGroup) {
        return m.reply(`⚠️ Este comando solo funciona en grupos.`);
    }

    // Hardcoded bot creator number (ensure it's in the correct full JID format)
    const botCreatorNumber = '584146277368@s.whatsapp.net'; // Example: Add @s.whatsapp.net

    // Function to check if a participant is an admin or the bot creator.
    const isAdminOrCreator = (participant) => {
        const participantId = participant.id;
        // Check for admin status (adjust based on your WhatsApp API's admin status representation)
        const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
        // Check if the participant is the group owner
        const isGroupOwner = groupMetadata.owner && participantId === groupMetadata.owner;
        // Check if the participant is the hardcoded bot creator
        const isBotCreator = participantId === botCreatorNumber;

        return isAdmin || isGroupOwner || isBotCreator;
    };

    // Filter out users who are the bot, admins, the group owner, or the bot creator.
    let elegibles = groupMetadata.participants
        .filter(v => v.id !== conn.user.jid && !isAdminOrCreator(v))
        .map(v => v.id);

    // If no eligible users are found, send a message and exit.
    if (elegibles.length === 0) {
        return m.reply(`⚠️ No hay usuarios elegibles para expulsar.`);
    }

    // Select one random eligible user.
    let elegido = elegibles[Math.floor(Math.random() * elegibles.length)];
    let formato = id => '@' + id.split('@')[0]; // Format ID for mentions.

    // Send a message announcing the selected user.
    await conn.sendMessage(m.chat, {
        text: `☠️ *${formato(elegido)} ha sido seleccionado por la ruleta de la muerte...*`,
        mentions: [elegido] // Ensure the selected user is mentioned.
    });

    // Attempt to remove the participant from the group immediately.
    try {
        await conn.groupParticipantsUpdate(m.chat, [elegido], 'remove');
        // You might want to add a success message here.
        // await m.reply(`✅ ${formato(elegido)} ha sido expulsado.`);
    } catch (e) {
        console.error("Error al expulsar al participante:", e);
        await m.reply(`❌ No se pudo expulsar a ${formato(elegido)}. Asegúrate de que el bot sea administrador y tenga los permisos necesarios.`);
    }
};

// Define command aliases, group only, and required permissions.
handler.command = /^(ruletamortal|ruletadeath)$/i;
handler.group = true;
handler.tags = ['game'];
handler.admin = true; // User who executes the command must be an admin.
handler.botAdmin = true; // Bot must be an admin in the group.

export default handler;

// The utility function for delay is no longer needed if you remove its call.
// const delay = ms => new Promise(res => setTimeout(res, ms));
