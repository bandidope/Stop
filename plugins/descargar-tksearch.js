import fetch from 'node-fetch';

// Objeto para almacenar las sesiones de TikTok por chat
const tiktokSessions = new Map();

/**
 * Maneja el comando de búsqueda de TikTok.
 * @param {object} m - El objeto del mensaje.
 * @param {object} options - Opciones del comando (conn, command, args, usedPrefix).
 */
const tiktokSearchHandler = async (m, { conn, args, usedPrefix }) => {
    const query = args.join(' ').trim();

    if (!query) {
        return conn.reply(
            m.chat,
            `❌ Por favor, escribe lo que quieres buscar.\nEjemplo: ${usedPrefix}tiktoksearch videos de gatos`,
            m
        );
    }

    try {
        await conn.reply(m.chat, `⏳ Buscando videos de TikTok para "${query}"...`, m);

        const apiUrl = `https://api.delirius.store/search/tiktoksearch?query=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.meta || data.meta.length === 0) {
            return conn.reply(m.chat, '❌ No se encontraron videos para tu búsqueda.', m);
        }

        // Guarda la sesión para este chat
        tiktokSessions.set(m.chat, {
            videos: data.meta,
            currentIndex: 0,
            query: query
        });

        await sendTikTokVideo(m, conn);
    } catch (error) {
        console.error('Error en tiktokSearchHandler:', error);
        return conn.reply(m.chat, '❌ Ocurrió un error al realizar la búsqueda de TikTok. Inténtalo de nuevo más tarde.', m);
    }
};

/**
 * Maneja el comando para ver el siguiente video de TikTok.
 * @param {object} m - El objeto del mensaje.
 * @param {object} options - Opciones del comando (conn, command, args, usedPrefix).
 */
const tiktokNextHandler = async (m, { conn }) => {
    const session = tiktokSessions.get(m.chat);

    if (!session || !session.videos || session.videos.length === 0) {
        return conn.reply(m.chat, '❌ Primero usa `.tiktoksearch` para buscar videos.', m);
    }

    if (session.currentIndex + 1 >= session.videos.length) {
        return conn.reply(m.chat, '✅ Has llegado al final de los resultados de esta búsqueda. Puedes iniciar una nueva con `.tiktoksearch`.', m);
    }

    session.currentIndex += 1;
    tiktokSessions.set(m.chat, session); // Actualiza la sesión

    await sendTikTokVideo(m, conn);
};

/**
 * Envía el video de TikTok actual de la sesión.
 * @param {object} m - El objeto del mensaje.
 * @param {object} conn - La conexión del bot.
 */
async function sendTikTokVideo(m, conn) {
    const session = tiktokSessions.get(m.chat);
    if (!session || !session.videos || session.videos.length === 0) {
        return conn.reply(m.chat, 'No hay videos disponibles en la sesión actual.', m);
    }

    const video = session.videos[session.currentIndex];
    const caption = `🎬 Video ${session.currentIndex + 1} de ${session.videos.length} (Búsqueda: "${session.query}")\n\n*Título:* ${video.title || 'Sin título'}\n*Autor:* ${video.author || 'Desconocido'}\n\n_©sᥲsᥙkᥱ ᑲ᥆𝗍 🌀 - Prohibida la copia_`;

    try {
        const buttons = [];
        if (session.currentIndex + 1 < session.videos.length) {
            buttons.push({
                buttonId: '.tiktoknext',
                buttonText: { displayText: "➡️ Siguiente Video" },
                type: 1
            });
        }

        await conn.sendMessage(
            m.chat,
            {
                video: { url: video.hd },
                caption: caption,
                buttons: buttons,
                viewOnce: true // Para que el mensaje se vea una sola vez
            },
            { quoted: m }
        );
    } catch (error) {
        console.error('Error al enviar el video de TikTok:', error);
        conn.reply(m.chat, '❌ Error al enviar el video. Es posible que el enlace no sea válido o que haya un problema con el servidor de TikTok.', m);
    }
}

// Exporta los handlers para que puedan ser usados por tu bot
tiktokSearchHandler.help = ['tiktoksearch <búsqueda>'];
tiktokSearchHandler.tags = ['search', 'tiktok'];
tiktokSearchHandler.command = /^(tiktoksearch)$/i;

tiktokNextHandler.help = ['tiktoknext'];
tiktokNextHandler.tags = ['search', 'tiktok'];
tiktokNextHandler.command = /^(tiktoknext)$/i;

export {
    tiktokSearchHandler,
    tiktokNextHandler
};
