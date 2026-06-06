
const handler = async (m, { conn, text}) => {
  try {
    if (!text) {
      return m.reply('❌ *Error:* Debes escribir el nuevo nombre después del comando.\n📌 Ejemplo: `.setname TuNombre`');
}

    // Actualiza el nombre de perfil del bot
    await conn.updateProfileName(text);

    m.reply(`✅ *Nombre actualizado correctamente.* ✨\n📌 *Nuevo nombre:* ${text}`);

} catch (error) {
    console.error('Error al actualizar el nombre:', error);
    m.reply(`⚠️ No se pudo cambiar el nombre.\n${error.message}`);
}
};

handler.command = /^setname$/i;
handler.tags = ['perfil'];
export default handler;