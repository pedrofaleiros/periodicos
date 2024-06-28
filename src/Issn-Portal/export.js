import fs from "fs";
import cliProgress from "cli-progress";
import prismaClient from "../prismaClient.js";

const fileName = "DadosPortalIssn.csv";

async function main() {
  const data = await prismaClient.portalIssnPeriodico.findMany();

  var content = "ISSN;Title;Other Title;Subject;Country;Language;Publisher\n";

  const progressBar = new cliProgress.SingleBar(
    {
      format: "{bar} | {percentage}% ",
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(data.length, 0);

  for (var i = 0; i < data.length; i++) {
    const el = data[i];
    content += `${el.issn};${el.title};"${el.otherTitle}";"${el.subject}";"${el.country}";"${el.language}";"${el.publisher}";\n`;
    progressBar.update(i);
  }

  progressBar.update(data.length);
  progressBar.stop();

  fs.writeFile(fileName, content, function (err) {
    if (err) throw err;
    console.log(`Salvo com sucesso em: ${fileName}`);
  });
}

main();
