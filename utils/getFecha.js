const funcDate = require("./getDate.js");
const funcCreate = require("./createTeam.js");

function getFecha(teams, team, interaction, startDate) {
  let fechaProfesional = funcDate.getDate(startDate);
  let fechaAmateur = funcDate.getDate(startDate);
  let currentFechaID;

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
      // console.log(
      //   `${val.torneo} ${key} ${startDate} ${fechaProfesional} ${fechaAmateur}`
      // );
      funcCreate.createTeamList(teams, currentFechaID, key);
    }
  }

  return currentFechaID;
}

exports.getFecha = getFecha;
