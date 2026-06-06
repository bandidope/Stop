import axios from 'axios';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) {
    throw `*⚠️ INGRESE PALABRAS CLAVE PARA BUSCAR GRUPOS*\n\n*📝 Ejemplo de uso:*\n${usedPrefix + command} programming,coding`;
  }

  m.reply('🔍 *Buscando grupos de WhatsApp...*\nEsto puede tomar un momento, por favor espere.');

  try {
    const groups = await searchGroups(text);
    let response = formatResults(groups);
    m.reply(response);
  } catch (e) {
    m.reply('❌ *Error:* ' + e.message);
  }
};

async function searchGroups(keywords) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Referer": "https://groupda1.link/add/group/search",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html, */*; q=0.01",
    "Host": "groupda1.link",
    "Origin": "https://groupda1.link",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  };

  const results = [];
  const keywordList = keywords.split(',');

  for (const name of keywordList) {
    const keyword = name.trim();
    let loop_count = 0;

    while (loop_count < 10) {
      const data = {
        group_no: `${loop_count}`,
        search: true,
        keyword: keyword
      };

      try {
        const response = await axios.post(
          "https://groupda1.link/add/group/loadresult",
          new URLSearchParams(data),
          { headers, timeout: 10000 }
        );

        if (response.status !== 200 || !response.data || response.data.length === 0) {
          break;
        }

        const $ = cheerio.load(response.data);
        let found = false;

        for (const maindiv of $('.maindiv').toArray()) {
          const tag = $(maindiv).find('a[href]');
          if (!tag.length) continue;

          const link = tag.attr('href');
          const title = tag.attr('title').replace('Whatsapp group invite link: ', '');
          const description_tag = $(maindiv).find('p.descri');
          const description = description_tag.text().trim() || 'No hay descripción';
          const group_id = link.split('/').pop();
          const group_link = `https://chat.whatsapp.com/${group_id}`;

          if (!results.some(g => g.Code === group_id)) {
            results.push({
              Name: title,
              Code: group_id,
              Link: group_link,
              Description: description,
              Keyword: keyword
            });
            found = true;
          }
        }

        if (!found) break;
        loop_count++;
        await new Promise(r => setTimeout(r, 1000));

      } catch (error) {
        break;
      }
    }
  }

  return results;
}

function formatResults(groups) {
  if (!groups.length) {
    return '❌ *No se encontraron grupos.*';
  }

  let message = '📋 *RESULTADOS DE LA BÚSQUEDA*\n' + '═'.repeat(30) + '\n\n';

  groups.forEach((group, index) => {
    message += `*${index + 1}. ${group.Name}*\n`;
    message += `📲 *Link:* ${group.Link}\n`;
    message += `📝 *Descripción:* ${group.Description}\n`;
    message += `🔎 *Keyword:* ${group.Keyword}\n`;
    message += '─'.repeat(30) + '\n';
  });

  message += `\n✅ *Total de Grupos:* ${groups.length}`;
  return message;
}

handler.help = ['searchgroups <keywords>'];
handler.tags = ['tools'];
handler.command = ['searchgroups', 'buscargrupos', 'grupos'];

export default handler;