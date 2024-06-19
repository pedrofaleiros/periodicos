import prismaClient from "../prismaClient.js";

export async function findAreaByNome(nome) {
  return await prismaClient.area.findUnique({ where: { nome: nome } });
}

export async function createArea(nome, total) {
  return await prismaClient.area.create({
    data: {
      nome: nome,
      total: total,
    },
  });
}

export async function updateArea(nome, total) {
  return await prismaClient.area.update({
    where: { nome: nome },
    data: { total: total },
  });
}

export async function listAreas() {
  return await prismaClient.area.findMany();
}
