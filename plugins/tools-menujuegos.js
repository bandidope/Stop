
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn}) => {
  const pluginsDir = path.resolve('./plugins');
  const ignoredFiles = ['.DS_Store'];

  const jsFiles = fs.readdirSync(pluginsDir)
.filter(file => file.endsWith('.js') &&!ignoredFiles.includes(file))
.map(file => path.join(pluginsDir, file));

  await m.react('🔍');
  conn.sendPresenceUpdate('composing', m.chat);

  let response = `🧩 *Plugins con errores detectados:*\n\n`;
  let hasIssues = false;

  for (const file of jsFiles) {
    try {
      const plugin = await import(`file://${file}`);

      // Detecta si el plugin exporta un objeto con propiedad 'command'
      const exported = plugin?.default?? plugin;
      const isValid =
        exported &&
        typeof exported === 'object' &&
        Array.isArray(exported.command) &&
        exported.command.length> 0;

      if (!isValid) {
        hasIssues = true;
        response += `❌ *Plugin inválido:* ${path.basename(file)}\nNo se encontró 'command' válido.\n\n`;
}
} catch (error) {
      hasIssues = true;
      response += `🚫 *Error al importar:* ${path.basename(file)}\n${error.message}\n\n`;
}
}

  if (!hasIssues) {
    response = '✅ ¡Todos los plugins están correctamente definidos!';
}

  await conn.reply(m.chat, response, m);
  await m.react('✅');
};

handler.command = ['revplugins'];
handler.help = ['revplugins'];
handler.tags = ['tools'];
handler.owner = true;

export default handler;
