import fs from "fs";
import { listPeriodicos } from "./repository/PeriodicoRepository.js";
import { listPeriodicoAreas } from "./repository/AreaPeriodicoRepository.js";
import cliProgress from "cli-progress";

const fileName = "dados.csv";

async function main() {
  const data = await listPeriodicos();

  var content = "ID;Titulo;ISSN;Area;Linguagem;Revisado por pares\n";

  const progressBar = new cliProgress.SingleBar(
    {
      format: "{bar} | {percentage}% ",
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(data.length, 0);

  for (var i = 0; i < data.length; i++) {
    const el = data[i];
    const titulo = el.titulo;
    const linguagem = el.linguagem;
    const revisado = el.revisado_pares ? "Sim" : "Não";

    const areas = await listPeriodicoAreas(el.id);
    areas.forEach((area) => {
      content += `${el.id};${titulo};${el.issn};${area.areaNome};${linguagem};${revisado};\n`;
    });
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
