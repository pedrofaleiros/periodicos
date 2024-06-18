const BASE_URL =
  "https://www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br/index.php/acervo/lista-a-z-periodicos.html";

const cookie =
  "_ga=GA1.1.503857174.1718625245; politica_cookies_portal_informada=true; f8d43d5899660e032f00f861565869ba=b0eb3de24496958b9731333489a61d04; ezproxyn=eMTeRMOctMmOvNd; ezproxy=eMTeRMOctMmOvNd; ezproxyl=eMTeRMOctMmOvNd; _ga_DSV7MH35Q7=GS1.1.1718708392.3.0.1718708392.60.0.0";

const headers = {
  // Accept:
  //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  // "Accept-Encoding": "gzip, deflate, br, zstd",
  // "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  // "Cache-Control": "max-age=0",
  // Connection: "keep-alive",
  Cookie: cookie,
  // Host: "www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br",
  // Referer: "https://www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br/",
  // "Sec-Fetch-Dest": "document",
  // "Sec-Fetch-Mode": "navigate",
  // "Sec-Fetch-Site": "same-origin",
  // "Sec-Fetch-User": "?1",
  // "Upgrade-Insecure-Requests": "1",
  // "User-Agent":
  //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  // "sec-ch-ua":
  //   '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  // "sec-ch-ua-mobile": "?0",
  // "sec-ch-ua-platform": '"Windows"',
};

module.exports = {
  BASE_URL,
  headers,
};
