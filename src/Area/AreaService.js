import {
  createArea,
  findAreaByNome,
  updateArea,
} from "../repository/AreaRepository.js";

export async function saveAreaService(nome, total) {
  const area = await findAreaByNome(nome);

  if (area === null) {
    await createArea(nome, total);
  } else if (area.total !== total) {
    await updateArea(nome, total);
  }
}
