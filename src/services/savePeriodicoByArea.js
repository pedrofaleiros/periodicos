const axios = require("axios");
const cheerio = require("cheerio");
const areas = require("../data/areas");
const { createPeriodico } = require("../repository");
const { BASE_URL, headers } = require("../data/request");

async function savePeriodicoByArea(areaName, page) {
  const url = `${BASE_URL}?q=&source=resources&areas%5B%5D=areas%3D%3D${areaName}&page=${page}`;

  const response = await axios.get(url, { headers });
  const data = response.data;
  const $ = cheerio.load(data);

  for (var i = 0; i < 30; i++) {
    const $conteudo = $(`#conteudo-${i}`);

    if ($conteudo.length > 0) {
      $conteudo.find("h6").each(async (index, element) => {
        const titulo = $(element).find("a.titulo-busca").text();
        const link = $(element).find("a.titulo-busca").attr("href");

        const list = link.split("=");
        const id = list[list.length - 1];

        const textoRevisado = $conteudo
          .find("p.peerreviewed span.ml-2 b")
          .text()
          .trim();
        var revisado = false;
        if (textoRevisado) {
          revisado = true;
        }

        console.log(`${i + 1} -> ${id} : ${titulo}`);
        await createPeriodico(id, titulo, areaName, null, null, revisado);
      });
    } else {
      console.log(`\t${i} - Nenhum dado encontrado`);
    }
  }
}

async function main(index) {
  const area = areas[index];
  const pages = Math.ceil(area.len / 30);

  for (var i = 1; i <= pages; i++) {
    console.time("Duration");
    console.log(`\nCriando "${area.name}" - Página ${i}/${pages}`);
    await savePeriodicoByArea(area.name, i).then(() => {
      console.timeEnd("Duration");
    });
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const number = parseInt(args[0], 10);
  if (number >= 0 && number < areas.length) {
    main(number);
  } else {
    console.log("Número inválido");
  }
} else {
  console.log("Informe o número");
}
