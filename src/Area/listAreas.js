import chalk from "chalk";
import { listAreas } from "../repository/AreaRepository.js";

async function main(index) {
  const data = await listAreas();

  if (index === null) {
    for (let i = 0; i < data.length; i++) {
      console.log(`${data[i].nome}: ${data[i].total}`);
    }
    console.log(chalk.green(`\nTotal: ${data.length} areas`));
  } else if (number >= 0 && number < data.length) {
    console.log(`${data[index].nome}: ${data[index].total}`);
  }
}

var number = null;
const args = process.argv.slice(2);
if (args.length > 0) {
  number = parseInt(args[0], 10);
}

main(number);
