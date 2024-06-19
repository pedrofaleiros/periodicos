import { BASE_URL, headers } from "../data/request.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { saveAreaService } from "./AreaService.js";

async function scrap() {
  const response = await axios.get(BASE_URL, { headers });

  const data = response.data;
  const $ = cheerio.load(data);

  const elements = $('[id^="faceta-areas-"]');

  for (let i = 0; i < elements.length; i++) {
    const el = $(elements[i]);
    const id = el.attr("id");
    const parent = el.closest("div");
    if (parent.length) {
      const idList = id.split("-");
      const nome = idList[idList.length - 1];
      const total = parseInt(parent.find("span").text().trim());

      if (typeof nome === "string" && typeof total === "number") {
        // console.log(`${nome}; ${total}`);
        await saveAreaService(nome, total);
      }
    }
  }
}

async function main() {
  await scrap();
}

main();
