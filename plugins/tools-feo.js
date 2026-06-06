const handler = async (m, { command}) => {
  m.reply("😖 Muy feo");
};

handler.command = ["feo5"];
handler.tags = ["premiumsub"];
handler.help = ["feo5"];
export default handler;