import chalk from "chalk";
import { listAreas } from "../repository/AreaRepository.js";
import { listPeriodicosByArea } from "../repository/PeriodicoRepository.js";

function padString(str, targetLength) {
  if (str.length > targetLength) {
    return str.substring(0, targetLength);
  }
  return str.padStart(targetLength, " ");
}

async function main() {
  const areas = await listAreas();

  for (let i = 0; i < areas.length; i++) {
    var area = areas[i];
    const per = await listPeriodicosByArea(area.nome);
    console.log(
      `${padString(`${i}`, 3)} - ${area.nome} - ${chalk.yellow(
        `${per.length}`
      )}`
    );
  }
}

main();
