import prismaClient from "./prismaClient.js";

async function main() {
  const area = await prismaClient.area.findUnique({
    where: { nome: "Infantil" },
  });

  if (area !== null) {
    console.log(`Deletando area: ${area.nome}`);
    await prismaClient.area.delete({ where: { nome: area.nome } });
  }
}
main();
