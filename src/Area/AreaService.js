import chalk from "chalk";
import {
  createArea,
  findAreaByNome,
  updateArea,
} from "../repository/AreaRepository.js";

export async function saveAreaService(nome, total) {
  const area = await findAreaByNome(nome);

  if (area === null) {
    console.log(`Criando ${nome}; Total: ${total}`);
    await createArea(nome, total);
  } else if (area.total !== total) {
    console.log(
      chalk.green(`Atualizando ${nome}; Total: ${area.total} -> ${total}`)
    );
    await updateArea(nome, total);
  } else {
    console.log(chalk.blue(`${nome} - OK`));
  }
}
