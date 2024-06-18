const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Todos periodicos
async function getPeriodicos() {
  const data = await prisma.periodico.findMany({
    orderBy: { created_at: "asc" },
  });
  return data;
}

//Filtra periodicos por area
async function getPeriodicosByArea(area) {
  const data = await prisma.periodico.findMany({
    where: { area: area },
    orderBy: { created_at: "asc" },
  });
  return data;
}

//Filtra periodicos por linguagem
async function getPeriodicosByLang(linguagem) {
  const data = await prisma.periodico.findMany({
    where: { linguagem: linguagem },
    orderBy: { created_at: "asc" },
  });
  return data;
}

//Procura periodico pelo ID
async function findPeriodico(id) {
  const data = await prisma.periodico.findUnique({ where: { id: id } });
  return data;
}

//Atualiza Linguagem e ISSN do Periodico
async function updateLinguagemAndISSN(id, linguagem, issn) {
  const data = await findPeriodico(id);

  if (data !== null) {
    await prisma.periodico.update({
      where: { id: id },
      data: {
        issn: issn,
        linguagem: linguagem,
      },
    });
  }
}

//Cria periodico
async function createPeriodico(
  id,
  titulo,
  area,
  linguagem,
  issn,
  revisado_pares
) {
  const data = await findPeriodico(id);

  //Não cria se ja existir periodico com esse ID
  if (data === null) {
    await prisma.periodico.create({
      data: {
        id: id,
        titulo: titulo,
        area: area,
        linguagem: linguagem,
        issn: issn,
        revisado_pares: revisado_pares,
      },
    });
  }
}

//Deleta periodico pelo ID
async function deletePeriodico(id) {
  const data = await findPeriodico(id);
  if (data !== null) {
    await prisma.periodico.delete({ where: { id: data.id } });
  }
}

//Delete TODOS periodicos
async function deleteAll() {
  await prisma.periodico.deleteMany();
}

module.exports = {
  findPeriodico,
  getPeriodicos,
  getPeriodicosByArea,
  getPeriodicosByLang,
  createPeriodico,
  updateLinguagemAndISSN,
  deletePeriodico,
  deleteAll,
};
