import prismaClient from "../prismaClient.js";

export async function findPeriodicoById(id) {
  return await prismaClient.periodico.findUnique({ where: { id: id } });
}

export async function createPeriodico(id, titulo, revisado) {
  return await prismaClient.periodico.create({
    data: {
      id: id,
      titulo: titulo,
      revisado_pares: revisado,
    },
  });
}

export async function updatePeriodicoLangAndISSN(id, issn, lang) {
  return await prismaClient.periodico.update({
    where: { id: id },
    data: {
      issn: issn,
      linguagem: lang,
    },
  });
}

export async function listPeriodicos() {
  return await prismaClient.periodico.findMany();
}

export async function listPeriodicosByArea(areaNome) {
  return await prismaClient.periodico.findMany({
    where: {
      areasPeriodico: {
        some: {
          areaNome: areaNome,
        },
      },
    },
  });
}
