const funcDate = require("./getDate.js");
const funcCreate = require("./createTeam.js");

async function getFecha(teams, team, interaction, startDate) {
  let fechaProfesional = funcDate.getDate(startDate);
  let fechaAmateur = funcDate.getDate(startDate);
  let currentFechaID;

  // console.log(teams);
  // console.log("Testing Team Fecha");
  console.log(teams[team.toUpperCase()]);
  // console.log("Fecha: " + fechaProfesional);

  if (!teams[team.toUpperCase()]) {
    interaction.followUp("Equipo no encontrado.");
    return;
  }

  if (teams[team.toUpperCase()].torneo == "amateur") {
    currentFechaID = fechaAmateur;
  } else {
    currentFechaID = fechaProfesional;
  }

  if (currentFechaID < 0) currentFechaID = 0;

  for (var key in teams) {
    if (teams.hasOwnProperty(key)) {
      var val = teams[key];
      //console.log(`${val.torneo} ${key} ${startDate} ${currentFechaID}`);
      if (key != "_id")
        await funcCreate.createTeamList(teams, currentFechaID, key);
    }
  }

  return currentFechaID;
}

exports.getFecha = getFecha;
