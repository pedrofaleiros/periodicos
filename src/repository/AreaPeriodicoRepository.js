import prismaClient from "../prismaClient.js";

export async function findAreaPeriodico(id, areaNome) {
  return await prismaClient.areaPeriodico.findUnique({
    where: {
      periodicoId_areaNome: {
        areaNome: areaNome,
        periodicoId: id,
      },
    },
  });
}

export async function createAreaPeriodico(id, areaNome) {
  return await prismaClient.areaPeriodico.create({
    data: {
      periodicoId: id,
      areaNome: areaNome,
    },
  });
}

export async function listAreaPeriodicos() {
  return await prismaClient.areaPeriodico.findMany();
}

export async function listPeriodicoAreas(id) {
  return await prismaClient.areaPeriodico.findMany({
    where: { periodicoId: id },
    include: {
      area: true,
    },
  });
}
