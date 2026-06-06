import axios from 'axios';

let yeon = async (m, { conn, text, usedPrefix, command }) => {
    const validRatios = ['1:1', '9:7', '7:9', '19:13', '13:19', '7:4', '4:7', '12:5', '5:12'];
    
    const args = text?.trim().split(/\s*\|\s*/);
    if (!text || !args || args.length < 2) {
        await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
        let caption = `🎨 *Generador de Imágenes Animagine AI* 📌 *Ejemplo de Uso:* *${usedPrefix + command}* 1girl, solo, school uniform|1:1\n\n`;
        
        caption += `📐 *Ratios Disponibles:* ${validRatios.join(', ')}\n\n`;
        
        caption += `📝 *Notas:* • El prompt debe ser detallado (ej: personaje, fondo, estado de ánimo)  
• El ratio ajusta el tamaño de la imagen  
• Si no se especifica, el ratio por defecto es "1:1"`;

        return conn.sendMessage(m.chat, {
            text: caption
        });
    }

    const [prompt, rawRatio] = args;
    const aspect_ratio = rawRatio.toLowerCase();

    if (!validRatios.includes(aspect_ratio)) {
        await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
        return conn.sendMessage(m.chat, {
            text: `📐 *Senpai*, ¡ratio inválido!  
Usa uno de estos: ${validRatios.join(', ')}.  
Ejemplo: *${usedPrefix + command}* 1girl, cute, school|1:1`
        });
    }

    try {
        await conn.sendMessage(m.chat, {
            react: { text: "⏳", key: m.key }
        });

        const generateImage = async (prompt, aspect_ratio) => {
            const session_hash = Math.random().toString(36).substring(2);
            const url = `https://asahina2k-animagine-xl-4-0.hf.space/queue/join?`;
            
            const conf = {
                samplers: ['Euler a'],
                ratios: {
                    '1:1': '1024 x 1024',
                    '9:7': '1152 x 896',
                    '7:9': '896 x 1152',
                    '19:13': '1216 x 832',
                    '13:19': '832 x 1216',
                    '7:4': '1344 x 768',
                    '4:7': '768 x 1344',
                    '12:5': '1536 x 640',
                    '5:12': '640 x 1536'
                },
                styles: ['Anim4gine']
            };

            const payload = {
                data: [
                    prompt, 
                    'lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, worst score, average score, signature, watermark, username, blurry', 
                    Math.floor(Math.random() * 2147483648), 
                    1024, 
                    1024, 
                    5, 
                    28, 
                    'Euler a', 
                    conf.ratios[aspect_ratio], 
                    conf.styles[0], 
                    false, 
                    0.55, 
                    1.5, 
                    true 
                ],
                event_data: null,
                fn_index: 5,
                trigger_id: 43,
                session_hash: session_hash
            };

            await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            let resultUrl = null;
            let attempts = 0;
            while (!resultUrl && attempts < 20) {
                const res = await axios.get(`https://asahina2k-animagine-xl-4-0.hf.space/queue/data?session_hash=${session_hash}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0'
                    }
                });

                const lines = res.data.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const d = JSON.parse(line.substring(6));
                        if (d.msg === 'process_completed') {
                            resultUrl = d.output.data[0][0].image.url;
                            break;
                        }
                    }
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            if (!resultUrl) {
                throw new Error('No se recibió ningún resultado en 1 minuto. Intenta de nuevo más tarde.');
            }

            return resultUrl;
        };

        const imageUrl = await generateImage(prompt, aspect_ratio);

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `✨ *¡Imagen generada con éxito, Senpai!* 📌 *Prompt:* _${prompt}_  
📐 *Ratio:* ${aspect_ratio}  
🖼️ *URL:* ${imageUrl}`
        });

        await conn.sendMessage(m.chat, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error('Error:', e.message);
        await conn.sendMessage(m.chat, {
            react: { text: "❌", key: m.key }
        });
        await conn.sendMessage(m.chat, {
            text: `⚠️ *¡Uy, ha ocurrido un error, Senpai!* Esta función está experimentando problemas, inténtalo de nuevo más tarde 😅`
        });
    }
};

yeon.help = ['animagine <prompt>|<ratio>'];
yeon.tags = ['ai'];
yeon.command = /^animagine$/i;
yeon.register = true;
yeon.limit = true;

export default yeon;
