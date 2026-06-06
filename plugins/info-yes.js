
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { downloadContentFromMessage} from '@whiskeysockets/baileys';
import { pipeline} from 'stream';
import { promisify} from 'util';

const streamPipeline = promisify(pipeline);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const tryConvert = (inputPath, outputPath, inputOptions = []) => {
  return new Promise((resolve, reject) => {
    const cmd = ffmpeg(inputPath);

    if (Array.isArray(inputOptions) && inputOptions.length) {
      cmd.inputOptions(inputOptions);
}

    cmd
.audioCodec('libmp3lame')
.audioBitrate('128k')
.format('mp3')
.outputOptions(['-y']) // forzar overwrite
.on('end', () => resolve())
.on('error', (err) => reject(err))
.save(outputPath);
});
};

const handler = async (msg, { conn}) => {
  const chatId = msg.key.remoteJid;
  const pref = global.prefixes?.[0] || ".";

  const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const audioMsg = quotedMsg?.audioMessage;
  const docMsg = quotedMsg?.documentMessage;
  const isAudioDoc = docMsg?.mimetype?.startsWith("audio");

  if (!audioMsg &&!isAudioDoc) {
    return conn.sendMessage(chatId, {
      text: `✳️ *Uso incorrecto.*\n📌 Responde a un *audio* o *mp3 dañado* con *${pref}ff2* para repararlo.`
}, { quoted: msg});
}

  await conn.sendMessage(chatId, { react: { text: '🎧', key: msg.key}});

  try {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true});

    const baseName = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const inputPath = path.join(tmpDir, `${baseName}.raw`);
    const outputPath = path.join(tmpDir, `${baseName}_fixed.mp3`);

    const stream = await downloadContentFromMessage(audioMsg || docMsg, 'audio');

    const writable = fs.createWriteStream(inputPath);
    if (typeof stream[Symbol.asyncIterator] === 'function') {
      for await (const chunk of stream) writable.write(chunk);
      await new Promise(r => writable.end(r));
} else {
      await streamPipeline(stream, writable);
}

    await sleep(200);

    const stats = fs.existsSync(inputPath)? fs.statSync(inputPath): null;
    if (!stats || stats.size < 500) {
      try { fs.unlinkSync(inputPath);} catch (e) {}
      await conn.sendMessage(chatId, {
        text: '❌ El audio descargado está incompleto o demasiado pequeño.\n📌 Pide al usuario que reenvíe el archivo o inténtalo de nuevo.'
}, { quoted: msg});
      await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key}});
      return;
}

    const startTime = Date.now();

    const strategies = [
      { name: 'normal', opts: []},
      { name: 'force-ogg', opts: ['-f', 'ogg']},
      { name: 'force-opus', opts: ['-f', 'opus']},
      { name: 'force-mp3', opts: ['-f', 'mp3']},
      { name: 'ignore-err-ogg', opts: ['-f', 'ogg', '-err_detect', 'ignore_err', '-fflags', '+discardcorrupt']},
      { name: 'ignore-err-opus', opts: ['-f', 'opus', '-err_detect', 'ignore_err', '-fflags', '+discardcorrupt']}
    ];

    let converted = false;
    let lastErr = null;

    for (const s of strategies) {
      try {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        await tryConvert(inputPath, outputPath, s.opts);

        if (fs.existsSync(outputPath)) {
          const outStats = fs.statSync(outputPath);
          if (outStats.size> 1000) {
            converted = true;
            break;
} else {
            lastErr = new Error(`Output too small for strategy ${s.name}`);
            try { fs.unlinkSync(outputPath);} catch (e) {}
            continue;
}
}
} catch (e) {
        lastErr = e;
        console.error(`[ff2] strategy ${s.name} failed:`, e.message || e);
}
}
const endTime = ((Date.now() - startTime) / 1000).toFixed(1);

    if (!converted) {
      try { fs.unlinkSync(inputPath);} catch (e) {}
      try { if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);} catch (e) {}
      console.error('❌.ff2 - all strategies failed:', lastErr?.message || lastErr);
      await conn.sendMessage(chatId, {
        text: `❌ No fue posible reparar el audio.\n📝 Error: _${lastErr?.message || 'desconocido'}_\n\n📌 Pide al usuario que reenvíe el audio o que lo exporte como MP3 desde su reproductor y vuelva a enviarlo.`
}, { quoted: msg});
      await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key}});
      return;
}

    const audioBuffer = fs.readFileSync(outputPath);
    await conn.sendMessage(chatId, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `audio_reparado.mp3`,
      ptt: audioMsg?.ptt || false,
      caption: `✅ *Audio reparado correctamente*\n⏱️ *Tiempo de reparación:* ${endTime}s\n\n🎧 *Realizado por ᴇʀᴇɴ-ʙᴏᴛ ɪᴀ*`
}, { quoted: msg});

    try { fs.unlinkSync(inputPath);} catch (e) {}
    try { fs.unlinkSync(outputPath);} catch (e) {}

    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key}});

} catch (err) {
    console.error('❌ Error en.ff2 (fatal):', err);
    await conn.sendMessage(chatId, {
      text: `❌ *Ocurrió un error al reparar el audio:*\n_${err.message}_`
}, { quoted: msg});
    await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key}});
}
};

handler.command = ['f2'];

export default handler;