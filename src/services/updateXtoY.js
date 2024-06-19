const axios = require("axios");
const cheerio = require("cheerio");
const areas = require("../data/areas");
const { BASE_URL, headers } = require("../data/request");
const {
  updateLinguagemAndISSN,
  getPeriodicosByArea,
  findPeriodico,
} = require("../repository");

async function updateIssnAndLang(id) {
  const find = await findPeriodico(id);
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
    await updateLinguagemAndISSN(id, updateLANG, updateISSN);
  }
}

async function main(index1, index2) {
  for (var i = index1; i <= index2; i++) {
    const area = areas[i];
    const periodicos = await getPeriodicosByArea(area.name);
    console.log(`ISSN e Linguagem - ${areas[i].name} - total: ${area.len}`);

    for (var j = 0; j < periodicos.length; j++) {
      var aux = periodicos[j];

      console.time("Duration");
      console.log(`\n${j}/${periodicos.length} - Buscando "${aux.id}"`);
      await updateIssnAndLang(periodicos[j].id).then(() => {
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
