import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import csv from "csv-parser";
import chalk from "chalk";
import prismaClient from "../prismaClient.js";

// console.log("");
// console.log(`ISSN: ${findIssn}`);
// console.log(chalk.yellow(`Titulo: ${map["Title proper"]}`));
// console.log(`Other Title: ${map["other-title"] ?? null}`);
// console.log(`Subject: ${map["Subject"] ?? null}`);
// console.log(`Language: ${map["Language"] ?? null}`);
// console.log(`Country: ${map["Country"] ?? null}`);
// console.log(`Publisher: ${map["Publisher"] ?? null}`);

const headers = {
	Accept:
		"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
	"Accept-Encoding": "gzip, deflate, br, zstd",
	"Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
	"Cache-Control": "max-age=0",
	Cookie:
		"SSESSe1375f0b694e1f3d11e5b5a7a73f8cd9=5uCTw9InCLEmTDGllgA4993AYo_oC27GGSn9DYNsIks; _ga=GA1.1.1408439780.1719403745; has_js=1; _pk_ses.1.a79b=1; _pk_id.1.a79b=71731954e21b24a4.1719403745.3.1719487882.1719414684.; _ga_1JHP66NXLS=GS1.1.1719487269.4.1.1719487881.0.0.0",
	"Sec-Ch-Ua":
		'"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
	"Sec-Ch-Ua-Mobile": "?0",
	"Sec-Ch-Ua-Platform": '"Windows"',
	"Sec-Fetch-Dest": "document",
	"Sec-Fetch-Mode": "navigate",
	"Sec-Fetch-Site": "none",
	"Sec-Fetch-User": "?1",
	"Upgrade-Insecure-Requests": "1",
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};

async function readCSV() {
	return new Promise((resolve, reject) => {
		const results = [];
		fs.createReadStream("ISSNPubliArtigos2000-2024.csv")
			.pipe(csv({ separator: ";" }))
			.on("data", (data) => {
				results.push(data["CASEWHENSUBSTR(ART.TXT_ISSN_IS"]);
			})
			.on("end", () => resolve(results))
			.on("error", (error) => reject(error));
	});
}

async function scrap(issn) {
	// const url = `https://portal.issn.org/api/search?search[]=MUST=allissnbis=%22${issn}%22`;
	const url = `https://portal.issn.org/resource/ISSN/${issn}`;

	const map = {};

	console.log(chalk.blue(`\nBuscando ${url}`));

	const response = await axios.get(url, { headers });
	const data = response.data;

	const $ = cheerio.load(data);

	const $tab = $("#tab0");

	const div = $tab.find(".item-result-content-text").first();

	const paragraphs = div.find("p").toArray();

	if (paragraphs.length === 0) {
		console.log(chalk.redBright("Nao encontrado"));
		return;
	}

	paragraphs.forEach((p, index) => {
		const span = $(p).find("span").first().text().replace(":", "").trim();
		const text = $(p)
			.contents()
			.filter((_, el) => el.type === "text")
			.text()
			.trim();

		if (
			span != "Title proper" &&
			span.includes("title") &&
			span != "Original alphabet of title"
		) {
			if (map["other-title"]) {
				map["other-title"] = `${map["other-title"]}; ${text}`;
			} else {
				map["other-title"] = text;
			}
		}

		if (map[span]) {
			map[span] = `${map[span]}; ${text}`;
		} else {
			map[span] = text;
		}
	});

	return map;
}

async function main(start, end) {
	if (isNaN(start) || start < 0) {
		console.log(chalk.redBright("Numero inválido"));
		return;
	}

	if (isNaN(end)) {
		end = start;
	} else {
		if (end <= start) {
			console.log(chalk.redBright("Numero inválido"));
			return;
		}
	}

	console.time("Duration");
	console.log(chalk.greenBright("Lendo arquivo"));
	const data = await readCSV();
	console.timeEnd("Duration");

	for (let num = start; num <= end && num < data.length; num++) {
		const issn = data[num];

		if (issn === undefined) {
			console.log(chalk.red("Não encontrado"));
		} else {
			const findIssn = issn.trim().replace(" ", "");

			console.time("Duration");
			const map = await scrap(findIssn);

			if (map) {
				const find = await prismaClient.portalIssnPeriodico.findUnique({
					where: { issn: findIssn },
				});

				if (find) {
					console.log(chalk.yellow(`[${num}] - Atualizando ${findIssn}`));
					await prismaClient.portalIssnPeriodico.update({
						where: { issn: findIssn },
						data: {
							title: map["Title proper"] ?? null,
							otherTitle: map["other-title"] ?? null,
							subject: map["Subject"] ?? null,
							language: map["Language"] ?? null,
							country: map["Country"] ?? null,
							publisher: map["Publisher"] ?? null,
						},
					});
				} else {
					console.log(chalk.green(`[${num}] - Criando ${findIssn}`));
					await prismaClient.portalIssnPeriodico.create({
						data: {
							issn: findIssn,
							title: map["Title proper"] ?? null,
							otherTitle: map["other-title"] ?? null,
							subject: map["Subject"] ?? null,
							language: map["Language"] ?? null,
							country: map["Country"] ?? null,
							publisher: map["Publisher"] ?? null,
						},
					});
				}
			}

			console.timeEnd("Duration");
		}
	}
}

const args = process.argv.slice(2);
const num = parseInt(args[0], 10);
const num2 = parseInt(args[1], 10);
main(num, num2);
