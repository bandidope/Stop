import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import Jimp from "jimp"
import FormData from "form-data"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!/^image\/(jpe?g|png)$/.test(mime)) {
      return m.reply(`*${xtools} Por favor, responde a una imagen para eliminar el fondo.*`)
    }

    await m.react('👨🏻‍🔧')

    const buffer = await q.download()
    const image = await Jimp.read(buffer)
    image.resize(800, Jimp.AUTO)

    const tmp = path.join(__dirname, `tmp_${Date.now()}.jpg`)
    await image.writeAsync(tmp)

    const url = await uploadToUguu(tmp)
    if (!url) throw new Error("No se pudo subir la imagen.")

    const img = await removeBg(url)
    await conn.sendFile(m.chat, img, "creditosawillzek.jpg", "✅ Fondo eliminado", m)

  } catch (err) {
    conn.reply(m.chat, `⚠️ Error: ${err.message}`, m)
  }
}

handler.help = ['quitarfondo']
handler.tags = ['tools']
handler.command = ['removebg', 'quitarfondo']

export default handler

async function uploadToUguu(filePath) {
  const form = new FormData()
  form.append("files[]", fs.createReadStream(filePath))

  try {
    const res = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })

    const json = await res.json()
    await fs.promises.unlink(filePath)
    return json.files?.[0]?.url
  } catch {
    await fs.promises.unlink(filePath)
    return null
  }
}

async function removeBg(imageUrl) {
  const res = await fetch(`https://api.siputzx.my.id/api/iloveimg/removebg?image=${encodeURIComponent(imageUrl)}&scale=2`)
  if (!res.ok) throw new Error("No se pudo eliminar el fondo.")
  return await res.buffer()
}
