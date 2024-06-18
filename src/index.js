const fs = require("fs");
const { getPeriodicos } = require("./repository");

const fileName = "dados.csv";

async function main() {
  const data = await getPeriodicos();

  var content = "ID;Titulo;ISSN;Area;Linguagem;Revisado por pares\n";

  for (var i = 0; i < data.length; i++) {
    const el = data[i];
    const titulo = el.titulo;
    const area = el.area;
    const linguagem = el.linguagem;
    const revisado = el.revisado_pares ? "Sim" : "Não";

    content += `${el.id};"${titulo}";${el.issn};"${area}";"${linguagem}";${revisado};\n`;
  }

  fs.writeFile(fileName, content, function (err) {
    if (err) throw err;
    console.log(`Salvo com sucesso em: ${fileName}`);
  });
}

main();
