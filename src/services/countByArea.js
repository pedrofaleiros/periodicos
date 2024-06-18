const { getPeriodicosByArea } = require("../repository");
const areas = require("../data/areas");

const args = process.argv.slice(2);
var num = parseInt(args[0], 10);
getPeriodicosByArea(areas[num].name).then((data) => {
  console.log(`${areas[num].name} - ${data.length}`);
});
