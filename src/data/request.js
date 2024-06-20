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
  Cookie: getCookie(),
};
