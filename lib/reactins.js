import fs from 'fs'
import path from 'path'

const filePath = path.join('./database/reacciones')

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true })
}

export const createMessageWithReactions = async (conn, msg, actions) => {
  const id = msg.key.id

  const serializableActions = {}
  for (const emoji in actions) {
    serializableActions[emoji] = { type: actions[emoji].type, data: actions[emoji].data }
  }

  const messageData = {
    chat: msg.key.remoteJid,
    id: id,
    actions: serializableActions,
  }

  const dataPath = path.join(filePath, `${id}.json`)
  fs.writeFileSync(dataPath, JSON.stringify(messageData, null, 2))
}

export const handleReaction = async (reaction, sender, conn) => {
  const key = reaction.key
  const emoji = reaction.text

  const dataPath = path.join(filePath, `${key.id}.json`)
  if (!fs.existsSync(dataPath)) return

  const fileData = fs.readFileSync(dataPath, 'utf-8')
  const messageData = JSON.parse(fileData)

  const action = messageData.actions[emoji]
  if (!action) return

  try {
    const callback = getCallbackForAction(action.type);
    if (callback) {
      await callback(conn, reaction.key.remoteJid, action.data);
    }
  } catch (error) {
    console.error(`Error al ejecutar la acción del emoji: ${error}`)
  }
}

const actionCallbacks = {}
export const setActionCallback = (type, callback) => {
  actionCallbacks[type] = callback
}
const getCallbackForAction = (type) => {
  return actionCallbacks[type]
}

global.conn.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m?.message?.reactionMessage) return

  const reaction = m.message.reactionMessage
  const sender = m.key.participant || m.key.remoteJid

  handleReaction(reaction, sender, global.conn)
})