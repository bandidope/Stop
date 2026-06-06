import axios from 'axios';  

let keni = async (m, { conn, text, usedPrefix, command }) => {
    const args = text.trim().split(/\s*\|\s*/);
    
    if (args.length < 2) return conn.sendMessage(m.chat, {
        text: `🚫  ¡formato equivocado!  
Ejemplo: *${usedPrefix + command}* <Título>|<Texto>  
Uso: *${usedPrefix + command}* NGL|Hola mundo`
    });

    const title = args[0];
    const textInput = args[1];

    try {
        const response = await axios.get(`https://flowfalcon.dpdns.org/imagecreator/ngl?title= ${encodeURIComponent(title)}&text=${encodeURIComponent(textInput)}`, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data, 'binary'),
            caption: `✨ *¡Imagen creada exitosamente!*  
📌 *Título:* ${title}  
📝 *Texto:* _${textInput}_`
        });
    } catch (e) {
        console.error('Error:', e.message);
        let errorMsg = `⚠️ *¡Uy, algo salió mal!*
Inténtalo de nuevo más tarde; esta función no funciona correctamente. 😅`;

        if (e.response?.status === 400) {
            errorMsg = `🚫 ¡Asegúrate de que el título y el texto estén completos!
Ejemplo: *${usedPrefix + command}* NGL|Hola Mundo`;
        }

        await conn.sendMessage(m.chat, { text: errorMsg });
    }
};

keni.help = ['fakengl *<titulo>|<texto>*'];
keni.tags = ['maker'];
keni.command = /^fakengl$/i;
keni.register = false;
keni.limit = false;

export default keni;