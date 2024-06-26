import chalk from "chalk";
import { listAreas } from "../repository/AreaRepository.js";
import {
  listPeriodicos,
  listPeriodicosByArea,
} from "../repository/PeriodicoRepository.js";

async function listByArea(areaNome) {
  const data = await listPeriodicosByArea(areaNome);
  for (let i = 0; i < data.length; i++) {
    var aux = data[i];
    if (i < 5) {
      console.log(`${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`);
    }

    if (i > data.length - 6 && data.length > 10) {
      console.log(`${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`);
    }
  }
  console.log(chalk.yellow(`${areaNome}`));
  console.log(chalk.blue(`Total: ${data.length} periodicos`));
}

async function listAll() {
  const data = await listPeriodicos();
  for (let i = 0; i < data.length; i++) {
    var aux = data[i];
    if (i < 5) {
      console.log(`${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`);
    }

    if (i > data.length - 6 && data.length > 10) {
      console.log(`${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`);
    }
  }
  console.log(chalk.blue(`Total: ${data.length} periodicos`));
}

async function main(index) {
  if (index === null) {
    await listAll();
  } else {
    const areas = await listAreas();
    if (index >= 0 && index < areas.length) {
      await listByArea(areas[index].nome);
    } else {
      console.log("Numero invalido");
    }
  }
}

var number = null;
const args = process.argv.slice(2);
if (args.length > 0) {
  number = parseInt(args[0], 10);
}

main(number);
