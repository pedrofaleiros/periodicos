import { BASE_URL, headers } from "../data/request.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { listAreas } from "../repository/AreaRepository.js";
import { savePeriodico } from "./PeriodicoService.js";

async function scrap(areaNome, page) {
  const url = `${BASE_URL}?q=&source=resources&areas%5B%5D=areas%3D%3D${areaNome}&page=${page}`;

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

        var aux = $conteudo.find("p.peerreviewed span.ml-2 b").text().trim();
        var revisado = false;
        if (aux) {
          revisado = true;
        }

        // console.log(`${i} -> ${id} : ${titulo}; ${areaNome}`);
        await savePeriodico(id, titulo, areaNome, revisado);
      });
    } else {
      console.log(`${i} - Nenhum dado encontrado`);
    }
  }
}

async function main(index) {
  const areas = await listAreas();

  if (index < 0 || index >= areas.length) {
    console.log("Numero inválido");
    return;
  }

  /* 
  TODO: se a qtd de periodicos no DB dessa area for igual ao Area.total, não precisa buscar
   */

  const area = areas[index];
  const pages = Math.ceil(area.total / 30);

  console.log(`\nCriando "${area.nome}" - Total: ${area.total}`);
  for (var i = 1; i <= pages; i++) {
    console.log(`\n>>> Página ${i}/${pages}`);

    console.time("Duration");
    await scrap(area.nome, i);
    console.timeEnd("Duration");
  }
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const number = parseInt(args[0], 10);
  main(number);
} else {
  console.log("Informe o número");
}
