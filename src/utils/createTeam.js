const fs = require("fs");
const path = require("path");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
let config = require(`${appRoot}/Config/config.json`);
const torneo = config.tournament.name;

async function createTeamList(teams, fecha, team) {
  //console.log(teams[team.toUpperCase()][fecha - 1]);

  if (teams[team.toUpperCase()][fecha]) {
    //console.log("La fecha ya existe");
    return;
  }
  console.log(`${team} / ${fecha}`);
  console.log(teams[team.toUpperCase()][fecha]);
  teams[team.toUpperCase()][fecha] = teams[team.toUpperCase()][fecha - 1];
  teams[team.toUpperCase()][fecha].transfers = 4;
  teams[team.toUpperCase()][fecha].releases = 4;

  await GetFromDB.updateDb("bilarbot", torneo, teams);
}

exports.createTeamList = createTeamList;
