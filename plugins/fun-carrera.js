const animales = [
    "🐎 Caballo", "🐢 Tortuga", "🐇 Conejo", "🦁 León", "🐍 Serpiente", "🐘 Elefante", "🐕 Perro", "🦜 Loro",
    "🦄 Unicornio", "🐊 Cocodrilo", "🐅 Tigre", "🐿️ Ardilla", "🦌 Ciervo", "🐧 Pingüino", "🦥 Perezoso", "🦭 Foca",
    "🦘 Canguro", "🦔 Erizo", "🦃 Pavo", "🐙 Pulpo"
];

const handler = async (m, { conn }) => {
    conn.raceAnimalGame = conn.raceAnimalGame || {};

    if (conn.raceAnimalGame[m.chat]) return m.reply("🏁 Ya hay una convocatoria activa en este chat.");

    let mensajeInicial = `🏁 *Carrera de Animales* 🏁\n\n`;
    mensajeInicial += `📌 **Elige tu animal respondiendo con el número:**\n\n`;

    animales.forEach((animal, i) => {
        mensajeInicial += `🔹 ${i + 1}. ${animal}\n`;
    });

    mensajeInicial += "\n📢 *Se requieren 4 jugadores para iniciar automáticamente.*";

    conn.raceAnimalGame[m.chat] = { 
        jugadores: {}, 
        isStarted: false 
    };

    await conn.sendMessage(m.chat, { text: mensajeInicial });
};

handler.before = async (m, { conn }) => {
    conn.raceAnimalGame = conn.raceAnimalGame || {};
    const game = conn.raceAnimalGame[m.chat];

    if (!game || game.isStarted) return;

    const eleccion = parseInt(m.text.trim());
    
    // Validar si el mensaje es un número de la lista
    if (!isNaN(eleccion) && eleccion >= 1 && eleccion <= animales.length) {
        
        if (game.jugadores[m.sender]) return m.reply("❌ Ya estás inscrito en la carrera.");

        const animalSeleccionado = animales[eleccion - 1];
        const usuario = conn.getName(m.sender);

        // Registrar jugador
        game.jugadores[m.sender] = { nombre: usuario, animal: animalSeleccionado };
        
        const count = Object.keys(game.jugadores).length;
        await conn.reply(m.chat, `✅ *${usuario}* se unió con: ${animalSeleccionado}\n👥 Jugadores: ${count}/4`, m);

        // Si llega a 4 jugadores, inicia la carrera
        if (count === 4) {
            game.isStarted = true;
            await conn.reply(m.chat, "🏁 ¡Cupo lleno! La carrera comienza en breve...", m);

            setTimeout(async () => {
                const participantes = Object.values(game.jugadores);
                const ganador = participantes[Math.floor(Math.random() * participantes.length)];

                let mensajeCarrera = "🏁 *RESULTADOS DE LA CARRERA* 🏁\n\n";
                participantes.forEach(({ nombre, animal }) => {
                    mensajeCarrera += `👤 ${nombre}: ${animal}\n`;
                });

                mensajeCarrera += `\n🎉 *El ganador es:* ${ganador.nombre} con ${ganador.animal} 🏆`;

                await conn.sendMessage(m.chat, { text: mensajeCarrera });
                delete conn.raceAnimalGame[m.chat]; // Limpiar juego
            }, 3000);
        }
    }
};

handler.command = ["animal", "carrera"];
export default handler;
