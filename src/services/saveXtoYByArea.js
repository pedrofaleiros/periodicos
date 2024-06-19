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

        // console.log(`${i + 1} -> ${id} : ${titulo}`);
        await createPeriodico(id, titulo, areaName, null, null, revisado);
      });
    } else {
      console.log(`\t${i} - Nenhum dado encontrado`);
    }
  }
}

async function main(index1, index2) {
  for (var i = index1; i <= index2; i++) {
    const area = areas[i];
    const pages = Math.ceil(area.len / 30);
    console.log(`\n${i} - Buscando ${area.name}`);

    for (var j = 1; j <= pages; j++) {
      console.time("Duration");
      await savePeriodicoByArea(area.name, j).then(() => {
        console.log(`\nCriando "${area.name}" - Página ${j}/${pages}`);
        console.timeEnd("Duration");
      });
    }
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const number = parseInt(args[0], 10);
  const number2 = parseInt(args[1], 10);
  if (
    number >= 0 &&
    number < areas.length &&
    number2 >= 0 &&
    number2 < areas.length
  ) {
    main(number, number2);
  } else {
    console.log("Número inválido");
  }
} else {
  console.log("Informe o número");
}
