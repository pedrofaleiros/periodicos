import { BASE_URL, headers } from "../data/request.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { listAreas } from "../repository/AreaRepository.js";
import {
  findPeriodicoById,
  listPeriodicosByArea,
  updatePeriodicoLangAndISSN,
} from "../repository/PeriodicoRepository.js";

async function scrap(id) {
  const find = await findPeriodicoById(id);
  if (find === null) {
    return;
  }

  if (find.linguagem === null && find.issn === null) {
    const url = `${BASE_URL}?task=detalhes&source=resources&id=${id}`;

    const response = await axios.get(url, { headers });
    const data = response.data;
    const $ = cheerio.load(data);

    const $lang = $("#item-language").first();
    const list = $lang.text().split(":");
    const lang = list[list.length - 1].trim();

    const $content = $("#content-print");
    const issn = $content.find("p.text-muted.mb-3.block").text().trim();

    var updateISSN = null;
    var updateLANG = null;
    if (lang) {
      updateLANG = lang;
    }
    if (issn) {
      updateISSN = issn;
    }

    // console.log(`${id}; ${updateLANG}; ${updateISSN}`);
    await updatePeriodicoLangAndISSN(id, updateISSN, updateLANG);
  }
}

async function main(index) {
  const areas = await listAreas();

  if (index < 0 || index >= areas.length) {
    console.log("Numero inválido");
    return;
  }

  const area = areas[index];
  console.log(`ISSN e Linguagem - ${area.nome} - Total: ${area.total}`);

  const periodicos = await listPeriodicosByArea(area.nome);

  for (var i = 0; i < periodicos.length; i++) {
    var aux = periodicos[i];

    // console.log(`${i}; ${aux.id}; ${aux.titulo}`);
    console.time("Duration");
    console.log(`\n${i}/${periodicos.length} - Buscando "${aux.id}"`);
    await scrap(periodicos[i].id);
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
