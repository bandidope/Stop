import { readdirSync, unlinkSync, existsSync, promises as fs } from 'fs';
import path from 'path';

var handler = async (m, { conn, usedPrefix }) => {
    if (global.conn.user.jid !== conn.user.jid) {
        return conn.reply(m.chat, '☯︎ *Utiliza este comando directamente en el número principal del Bot*', m);
    }

    await conn.reply(m.chat, '🂱 *Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...*', m);

    // Define rwait como un emoji o identificador
    const rwait = '⏳'; // Emoji de espera
    m.react(rwait);

    let sessionPath = './Sesiones/Principal';
    try {
        if (!existsSync(sessionPath)) {
            return await conn.reply(m.chat, '💻 *La carpeta ya fue limpiada*', m);
        }

        let files = await fs.readdir(sessionPath);
        let filesDeleted = 0;

        for (const file of files) {
            if (file !== 'creds.json') {
                await fs.unlink(path.join(sessionPath, file));
                filesDeleted++;
            }
        }

        if (filesDeleted === 0) {
            await conn.reply(m.chat, '💻 *La carpeta ya fue limpiada*', m);
        } else {
            const done = '✅'; // Emoji de hecho
            m.react(done);
            await conn.reply(m.chat, `⚠︎ *Se eliminaron ${filesDeleted} archivos de sesión, excepto el archivo creds.json*`, m);
            await conn.reply(m.chat, '𒊹︎︎︎ *¿Me ves o no futuro cliente?*', m);
        }
    } catch (err) {
        console.error('Error al leer la carpeta o los archivos de sesión:', err);
        await conn.reply(m.chat, '𖠌 *Ocurrió un fallo*', m);
    }
}

handler.help = ['dsowner'];
handler.tags = ['fix', 'owner'];
handler.command = ['delai', 'delyaemori', 'dsowner', 'clearallsession'];

handler.rowner = true;

export default handler;