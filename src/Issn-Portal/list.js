import chalk from "chalk";
import prismaClient from "../prismaClient.js";

async function main(num) {
  const data = await prismaClient.portalIssnPeriodico.findMany();

  if (!isNaN(num)) {
    if (num >= data.length) {
      console.log(chalk.redBright("Numero invalido"));
      return;
    }
    var aux = data[num];
    console.log(chalk.yellow(`[${num}] - ${aux.issn}`));
    console.log(`Title: ${aux.title}`);
    console.log(`Other-Title: ${aux.otherTitle}`);
    console.log(`Subject: ${aux.subject}`);
    console.log(`Country: ${aux.country}`);
    console.log(`Language: ${aux.language}`);
    console.log(`Publisher: ${aux.publisher}`);
    return;
  }

  for (let i = 0; i < data.length; i++) {
    var aux = data[i];
    if (i < 5 || (data.length >= 10 && i > data.length - 6)) {
      console.log(
        `${chalk.yellow(`[${i}] - ${aux.issn}`)} - ${aux.title}`
      );
    }
  }

  console.log(chalk.blue(`Total: ${data.length} periodicos`));
}

const args = process.argv.slice(2);
const num = parseInt(args[0], 10);
main(num);
