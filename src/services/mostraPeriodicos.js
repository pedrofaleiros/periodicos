const { getPeriodicos, deleteAll } = require("../repository");

async function main() {
  const data = await getPeriodicos();

  console.log(`Total: ${data.length}`);

  for (var i = 0; i < data.length; i++) {
    //Mostra os 5 primeiros
    if (i < 5) {
      var el = data[i];
      console.log(
        `${el.id}; ${el.titulo}; ${el.area}; ${el.linguagem}; ${el.issn}; ${el.revisado_pares}`
      );
    }

    //Mostra os 5 ultimos
    if (i > data.length - 5 - 1) {
      var el = data[i];
      console.log(
        `${el.id}; ${el.titulo}; ${el.area}; ${el.linguagem}; ${el.issn}; ${el.revisado_pares}`
      );
    }
  }
}

main();
