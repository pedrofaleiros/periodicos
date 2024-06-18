const axios = require("axios");
const cheerio = require("cheerio");
const linguagens = require("./linguagens");
const { createPeriodico, updateLinguagem } = require("../repository");

const BASE_URL =
  "https://www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br/index.php/acervo/lista-a-z-periodicos.html";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive",
  Cookie:
    "_ga=GA1.1.503857174.1718625245; politica_cookies_portal_informada=true; f8d43d5899660e032f00f861565869ba=b0eb3de24496958b9731333489a61d04; ezproxyn=eMTeRMOctMmOvNd; ezproxy=eMTeRMOctMmOvNd; ezproxyl=eMTeRMOctMmOvNd; _ga_DSV7MH35Q7=GS1.1.1718708392.3.0.1718708392.60.0.0",
  Host: "www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br",
  Referer: "https://www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br/",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "sec-ch-ua":
    '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

async function savePeriodicoByLinguagem(linguagem, page) {
  //   const url = `${BASE_URL}?q=&source=resources&areas%5B%5D=areas%3D%3D${areaName}&page=${page}`;
  const url = `${BASE_URL}?q=&source=resources&language%5B%5D=language%3D%3D${linguagem}&page=${page}`;

  const response = await axios.get(url, { headers });
  const data = response.data;
  const $ = cheerio.load(data);

  for (var i = 0; i < 30; i++) {
    const $conteudo = $(`#conteudo-${i}`);

    if ($conteudo.length === 0) {
      console.log(`\t${i} - Nenhum dado encontrado`);
      return;
    }

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

      console.log(`${i + 1} -> ${id}; ${titulo}; ${linguagem}; ${revisado}`);
      // await createPeriodico(id, titulo, areaName, null, null, revisado);
    //   await updateLinguagem(id, linguagem);
    });
  }
}

async function main(index) {
  const linguagem = linguagens[index];
  const pages = Math.ceil(linguagem.len / 30);

  for (var i = 1; i <= pages; i++) {
    console.time("Duration");
    await savePeriodicoByLinguagem(linguagem, i).then(() => {
      console.log(`\nCriando "${linguagem}" - Página ${i}/${pages}`);
      console.timeEnd("Duration");
    });
  }
}

const LANG_SELECTED = 0;
main(LANG_SELECTED);
