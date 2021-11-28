const fs = require("fs");

function createTeamList(messages, fecha, team) {
  //console.log(messages[team.toUpperCase()][fecha - 1]);
  if (messages[team.toUpperCase()][fecha]) {
    //console.log("La fecha ya existe");
    return;
  }
  //console.log(`${team} / ${fecha}`);
  messages[team.toUpperCase()][fecha] = messages[team.toUpperCase()][fecha - 1];
  messages[team.toUpperCase()][fecha].transfers = 2;
  messages[team.toUpperCase()][fecha].releases = 2;

  fs.writeFileSync(
    `./Teams/185191450013597696.json`,
    JSON.stringify(messages),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

exports.createTeamList = createTeamList;
