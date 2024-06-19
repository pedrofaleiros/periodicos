import { listAreas } from "../repository/AreaRepository.js";
import {
  listPeriodicos,
  listPeriodicosByArea,
} from "../repository/PeriodicoRepository.js";

async function listByArea(areaNome) {
  const data = await listPeriodicosByArea(areaNome);
  console.log(`Total: ${data.length} periodicos`);
  for (let i = 0; i < data.length; i++) {
    var aux = data[i];
    if (i < 5 || i > data.length - 6)
      console.log(
        `[${i}] - ${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`
      );
  }
}

async function listAll() {
  const data = await listPeriodicos();
  console.log(`Total: ${data.length} periodicos`);
  for (let i = 0; i < data.length; i++) {
    var aux = data[i];
    if (i < 5 || i > data.length - 6)
      console.log(
        `[${i}] - ${aux.id}; ${aux.titulo}; ${aux.issn}; ${aux.linguagem}`
      );
  }
}

//   const aux = await listAreaPeriodicos();
//   console.log(aux.length);

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
