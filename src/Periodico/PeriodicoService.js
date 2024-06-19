import {
  createAreaPeriodico,
  findAreaPeriodico,
} from "../repository/AreaPeriodicoRepository.js";
import { findAreaByNome } from "../repository/AreaRepository.js";
import {
  createPeriodico,
  findPeriodicoById,
} from "../repository/PeriodicoRepository.js";

export async function savePeriodico(id, titulo, areaNome, revisado_pares) {
  var periodico = await findPeriodicoById(id);
  if (periodico === null) {
    periodico = await createPeriodico(id, titulo, revisado_pares);
  }

  const area = await findAreaByNome(areaNome);
  if (area === null) return;

  const areaPeriodico = await findAreaPeriodico(periodico.id, area.nome);

  if (areaPeriodico === null) {
    await createAreaPeriodico(periodico.id, area.nome);
  }
}
