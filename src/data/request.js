import "dotenv/config";

export const BASE_URL =
  "https://www-periodicos-capes-gov-br.ez106.periodicos.capes.gov.br/index.php/acervo/lista-a-z-periodicos.html";

export const cookie = process.env.COOKIE;

function getCookie() {
  if (!cookie) {
    throw new Error("Informe o Cookie");
  }
  return cookie;
}

export const headers = {
  // Accept:
  //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  // "Accept-Encoding": "gzip, deflate, br, zstd",
  // "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
  // "Cache-Control": "max-age=0",
  // Connection: "keep-alive",
  Cookie: getCookie(),
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

// module.exports = {
//   BASE_URL,
//   headers,
// };
