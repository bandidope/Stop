import { WAMessageStubType } from '@whiskeysockets/baileys';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function before(m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return true;

    const chat = global.db?.data?.chats?.[m.chat];
    if (!chat || !chat.bienvenida) return true;

    // --- ✅ Imagen local configurada ---
    const imgBuffer = readFileSync(join(process.cwd(), 'storage', 'img', 'catalogo.png'));

    const fkontak = {
      key: {
        participants: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        fromMe: true,
        id: 'Pᴏᴡᴇʀᴇᴅ Bʏ Tᴇᴀᴍ Nɪɢʜᴛᴡɪsʜ 🌀'
      },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN: Pᴏᴡᴇʀᴇᴅ Bʏ Tᴇᴀᴍ Nɪɢʜᴛᴡɪsʜ 🌀\nitem1.TEL;waid=${
            conn.user.jid.split('@')[0]
          }:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    };

    let userJid;
    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        userJid = m.messageStubParameters?.[0];
        break;
      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        userJid = m.key.participant;
        break;
      default:
        return true;
    }

    if (!userJid) return true;

    const user = `@${userJid.split('@')[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'Sin descripción disponible.';

    const { customWelcome, customBye, customKick } = chat;

    // --- 🟢 BIENVENIDA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = customWelcome
        ? customWelcome.replace(/@user/gi, user).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc)
        : `✨ *¡Bienvenido/a!* ✨\n\nHola ${user}, es un gusto tenerte en *${groupName}*.\n\n📝 *REGLAS Y INFO:*\n${groupDesc}\n\n> *Pᴏᴡᴇʀᴇᴅ Bʏ Tᴇᴀᴍ Nɪɢʜᴛᴡɪsʜ 🌀*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: welcomeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🔴 SALIDA VOLUNTARIA ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const goodbyeText = customBye
        ? customBye.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `*Adiós ${user} Estorbo 🤝🏼*\n\n_*-1 Planta En Este Hermoso Grupo 😮‍💨*_\n\n> *${groupName}*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: goodbyeText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }

    // --- 🚫 ELIMINADO ---
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const kickText = customKick
        ? customKick.replace(/@user/gi, user).replace(/@group/gi, groupName)
        : `*¡Fue Expulsado ${user}!* ⚡\n\n_*-1 Perro En Este Grupo*_\n\n> *${groupName}*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: kickText,
        mentions: [userJid]
      }, { quoted: fkontak });
    }
  } catch (error) {
    console.error('❌ Error en el sistema de bienvenida:', error);
  }
}