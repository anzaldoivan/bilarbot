const funcDate = require("./getDate.js");
const funcCreate = require("./createTeam.js");

function getFecha(messages, team, interaction) {
  let fechaProfesional = funcDate.getDate("2021-10-26");
  let fechaAmateur = funcDate.getDate("2021-11-02");
  let currentFechaID;

  if (!messages[team.toUpperCase()]) {
    interaction.followUp("Equipo no encontrado.");
    return;
  }

  if (messages[team.toUpperCase()].torneo == "amateur") {
    currentFechaID = fechaAmateur;
  } else {
    currentFechaID = fechaProfesional;
  }

  if (currentFechaID < 0) currentFechaID = 0;
  currentFechaID++;

  for (var key in messages) {
    if (messages.hasOwnProperty(key)) {
      var val = messages[key];
      // console.log(
      //   `${val.torneo} ${key} ${fechaProfesional + 1} ${fechaAmateur + 1}`
      // );
      if (val.torneo == "amateur")
        funcCreate.createTeamList(messages, fechaAmateur + 1, key);
      if (val.torneo == "profesional")
        funcCreate.createTeamList(messages, fechaProfesional + 1, key);
    }
  }

  return currentFechaID;
}

exports.getFecha = getFecha;
