import axios from 'axios'
import FormData from 'form-data'

const detectorTextoIA = {
  analizar: async (texto) => {
    if (texto.length === 20000) {
      throw new Error("📛 Tu texto es demasiado largo 😂, máximo 20000 caracteres")
}

    const formulario = new FormData()
    formulario.append("content", texto)

    const encabezados = {
      headers: {
...formulario.getHeaders(),
        "Product-Serial": "808e957638180b858ca40d9c3b9d5bd3"
}
}

    const encabezadoConsulta = {
      headers: {
        "Product-Serial": "808e957638180b858ca40d9c3b9d5bd3"
}
}

    const { data: crearTrabajo} = await axios.post(
      "https://api.decopy.ai/api/decopy/ai-detector/create-job",
      formulario,
      encabezados
)

    const jobId = crearTrabajo.result.job_id

    const { data: resultadoProceso} = await axios.get(
      `https://api.decopy.ai/api/decopy/ai-detector/get-job/${jobId}`,
      encabezadoConsulta
)

    const salida = resultadoProceso.result.output

    const resultadoFormateado = salida.sentences.map((frase, i) => ({
      no: i + 1,
      frase: frase.content.trim(),
      puntuación: Number(frase.score.toFixed(3)),
      estado: frase.status === 1? "GENERADO_POR_IA": "GENERADO_POR_HUMANO"
}))

    return resultadoFormateado
}
}

// Manejador para comandos
let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) throw `✏️ Ejemplo de uso: ${usedPrefix}${command} Hola, soy Chat GPT`
  m.reply('⏳ Analizando tu texto...')
  try {
    const resultado = await detectorTextoIA.analizar(text)
    let salida = resultado.map(r =>
      `📍 Número: ${r.no}\n🗨️ Frase: ${r.frase}\n📊 Puntuación: ${r.puntuación}\n🔎 Estado: ${r.estado}`
).join('\n\n')
    m.reply(salida)
} catch (err) {
    m.reply(`❌ Error: ${err.message}`)
}
}

handler.help = ['aidetector <texto>']
handler.tags = ['ai']
handler.command = ['aidetector']

export default handler