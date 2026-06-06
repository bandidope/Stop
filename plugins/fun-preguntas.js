var handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `*${xfun} Por favor, ingresa un texto a preguntar*\n> *\`Ejemplo:\`*  ${usedPrefix + command} Hoy se follan a la admin?`, m, rcanal )
m.react('❔')
await delay(1000 * 1)
m.react('❓')
await delay(1000 * 1)
m.react('❔')
await delay(1000 * 1)

conn.reply(m.chat, `*⁉️ \`PREGUNTAS\` ⁉️*\n\n*Pregunta:* ${text}\n*Respuesta:* ${['Si','Tal vez sí','Posiblemente','Probablemente no','No','Imposible','Por que haces estas preguntas','Por eso te dejo','Para que quieres saber','No te dire la respuesta'].getRandom()}`, m, rcanal, )

}
handler.help = ['pregunta']
handler.tags = ['fun']
handler.command = /^pregunta|preguntas|apakah$/i
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))