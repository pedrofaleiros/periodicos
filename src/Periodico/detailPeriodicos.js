import { BASE_URL, headers } from "../data/request.js";
import axios from "axios";
import * as cheerio from "cheerio";
import { listAreas } from "../repository/AreaRepository.js";
import {
	findPeriodicoById,
	listPeriodicosByArea,
	updatePeriodicoLangAndISSN,
} from "../repository/PeriodicoRepository.js";
import chalk from "chalk";

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

	console.log(`Detalhar Area - ${start}${start === end ? "" : ` -> ${end}`}`);

	console.time("Tempo Total");
	for (let index = start; index <= end; index++) {
		const area = areas[index];
		console.log(
			chalk.yellow(`\nISSN e Linguagem - ${area.nome} - Total: ${area.total}`)
		);

		const periodicos = await listPeriodicosByArea(area.nome);

		for (var j = 0; j < periodicos.length; j++) {
			var aux = periodicos[j];

			// console.log(`${j}; ${aux.id}; ${aux.titulo}`);
			console.time("Duration");
			console.log(`\n${j + 1}/${periodicos.length} - Buscando "${aux.id}"`);
			await scrap(periodicos[j].id);
			console.timeEnd("Duration");
		}
	}
	console.log("");
	console.timeEnd("Tempo Total");
}

const args = process.argv.slice(2);
const num = parseInt(args[0], 10);
const num2 = parseInt(args[1], 10);
main(num, num2);
