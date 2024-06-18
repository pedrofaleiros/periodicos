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

  if (find.linguagem === null || find.issn === null) {
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

async function main(index) {
  const area = areas[index];
  const periodicos = await getPeriodicosByArea(area.name);

  for (var i = 0; i < periodicos.length; i++) {
    var aux = periodicos[i];

    console.time("Duration");
    await updateIssnAndLang(periodicos[i].id).then(() => {
      console.log(`\n${i}/${periodicos.length} - Buscando "${aux.id}"`);
      console.timeEnd("Duration");
    });
  }
}

const AREA_SELECTED = 0;
main(AREA_SELECTED);
