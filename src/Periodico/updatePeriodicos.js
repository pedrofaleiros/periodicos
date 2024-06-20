import { BASE_URL, headers } from "../data/request.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { listAreas } from "../repository/AreaRepository.js";
import { savePeriodico } from "./PeriodicoService.js";
import { listPeriodicosByArea } from "../repository/PeriodicoRepository.js";
import chalk from "chalk";

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

async function main(start, end) {
  const areas = await listAreas();

  if (isNaN(start) || start < 0 || start >= areas.length) {
    console.log("Numero inválido");
    return;
  }

  if (isNaN(end)) {
    end = start;
  } else {
    if (end <= start || end >= areas.length) {
      console.log("Numero inválido");
      return;
    }
  }

  console.log(
    `Atualizar Periodico - ${start}${start === end ? "" : ` -> ${end}`}`
  );

  console.time("Tempo Total");
  for (let index = start; index <= end; index++) {
    const area = areas[index];
    const periodicos = await listPeriodicosByArea(area.nome);

    if (periodicos.length !== area.total) {
      const pages = Math.ceil(area.total / 30);
      console.log(
        chalk.yellow(`\n[${index}] - "${area.nome}" - Total: ${area.total}`)
      );

      for (let page = 1; page <= pages; page++) {
        console.log(`\n> Página ${page}/${pages}`);

        console.time("Duration");
        await scrap(area.nome, page);
        console.timeEnd("Duration");
      }
    } else {
      console.log(chalk.green(`\n[${index}] - ${area.nome} - OK`));
    }
  }
  console.log("");
  console.timeEnd("Tempo Total");
}

const args = process.argv.slice(2);
const num = parseInt(args[0], 10);
const num2 = parseInt(args[1], 10);
main(num, num2);
