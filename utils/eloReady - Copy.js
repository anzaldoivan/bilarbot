const Discord = require("discord.js");
const fs = require("fs");
const wilsonScore = require("wilson-score-rank");
const singlekeeper = require("../commands/ELO/singlekeeper");
const decache = require("decache");

function eloReady(interaction, config) {
  let embed = new Discord.MessageEmbed();

  const gk = require(`../elo/gk.json`);
  const defensores = require(`../elo/defensores.json`);
  const cm = require(`../elo/cm.json`);
  const delanteros = require(`../elo/delanteros.json`);
  const messages = require(`../Users/185191450013597696.json`);
  const matchinfo = require(`../elo/matchinfo.json`);
  const matchplayers = require(`../elo/matchplayers.json`);

  interaction.followUp(
    "Comenzando emparejamiento de jugadores. Una vez finalizado, se les pedira a los jugadores unirse al servidor."
  );

  let newMatchplayers = [];

  newMatchplayers.push(gk[0].replace(/[^0-9\.]+/g, ""));
  if (!config.elo.singlekeeper) {
    newMatchplayers.push(gk[1].replace(/[^0-9\.]+/g, ""));
  }
  newMatchplayers.push(defensores[0].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(defensores[1].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(defensores[2].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(defensores[3].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(cm[0].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(cm[1].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(delanteros[0].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(delanteros[1].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(delanteros[2].replace(/[^0-9\.]+/g, ""));
  newMatchplayers.push(delanteros[3].replace(/[^0-9\.]+/g, ""));

  fs.writeFileSync(
    `./elo/matchplayers.json`,
    JSON.stringify(newMatchplayers),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );

  let nameGK2;
  if (config.elo.singlekeeper) {
    nameGK2 = gk[0];
  } else {
    nameGK2 = gk[1];
  }

  let playerlist = [
    {
      name: gk[0],
      ELO:
        messages[gk[0].replace(/[^0-9\.]+/g, "")].ELOGK *
        wilsonScore.lowerBound(
          messages[gk[0].replace(/[^0-9\.]+/g, "")].wins,
          messages[gk[0].replace(/[^0-9\.]+/g, "")].wins +
            messages[gk[0].replace(/[^0-9\.]+/g, "")].draws +
            messages[gk[0].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1000,
    },
    {
      name: nameGK2,
      ELO:
        messages[nameGK2.replace(/[^0-9\.]+/g, "")].ELOGK *
        wilsonScore.lowerBound(
          messages[nameGK2.replace(/[^0-9\.]+/g, "")].wins,
          messages[nameGK2.replace(/[^0-9\.]+/g, "")].wins +
            messages[nameGK2.replace(/[^0-9\.]+/g, "")].draws +
            messages[nameGK2.replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1000,
    },
    {
      name: defensores[0],
      ELO:
        messages[defensores[0].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[defensores[0].replace(/[^0-9\.]+/g, "")].wins,
          messages[defensores[0].replace(/[^0-9\.]+/g, "")].wins +
            messages[defensores[0].replace(/[^0-9\.]+/g, "")].draws +
            messages[defensores[0].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1,
    },
    {
      name: defensores[1],
      ELO:
        messages[defensores[1].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[defensores[1].replace(/[^0-9\.]+/g, "")].wins,
          messages[defensores[1].replace(/[^0-9\.]+/g, "")].wins +
            messages[defensores[1].replace(/[^0-9\.]+/g, "")].draws +
            messages[defensores[1].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1,
    },
    {
      name: defensores[2],
      ELO:
        messages[defensores[2].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[defensores[2].replace(/[^0-9\.]+/g, "")].wins,
          messages[defensores[2].replace(/[^0-9\.]+/g, "")].wins +
            messages[defensores[2].replace(/[^0-9\.]+/g, "")].draws +
            messages[defensores[2].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1,
    },
    {
      name: defensores[3],
      ELO:
        messages[defensores[3].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[defensores[3].replace(/[^0-9\.]+/g, "")].wins,
          messages[defensores[3].replace(/[^0-9\.]+/g, "")].wins +
            messages[defensores[3].replace(/[^0-9\.]+/g, "")].draws +
            messages[defensores[3].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 1,
    },
    {
      name: cm[0],
      ELO:
        messages[cm[0].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[cm[0].replace(/[^0-9\.]+/g, "")].wins,
          messages[cm[0].replace(/[^0-9\.]+/g, "")].wins +
            messages[cm[0].replace(/[^0-9\.]+/g, "")].draws +
            messages[cm[0].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 10,
    },
    {
      name: cm[1],
      ELO:
        messages[cm[1].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[cm[1].replace(/[^0-9\.]+/g, "")].wins,
          messages[cm[1].replace(/[^0-9\.]+/g, "")].wins +
            messages[cm[1].replace(/[^0-9\.]+/g, "")].draws +
            messages[cm[1].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 10,
    },
    {
      name: delanteros[0],
      ELO:
        messages[delanteros[0].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[delanteros[0].replace(/[^0-9\.]+/g, "")].wins,
          messages[delanteros[0].replace(/[^0-9\.]+/g, "")].wins +
            messages[delanteros[0].replace(/[^0-9\.]+/g, "")].draws +
            messages[delanteros[0].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 100,
    },
    {
      name: delanteros[1],
      ELO:
        messages[delanteros[1].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[delanteros[1].replace(/[^0-9\.]+/g, "")].wins,
          messages[delanteros[1].replace(/[^0-9\.]+/g, "")].wins +
            messages[delanteros[1].replace(/[^0-9\.]+/g, "")].draws +
            messages[delanteros[1].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 100,
    },
    {
      name: delanteros[2],
      ELO:
        messages[delanteros[2].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[delanteros[2].replace(/[^0-9\.]+/g, "")].wins,
          messages[delanteros[2].replace(/[^0-9\.]+/g, "")].wins +
            messages[delanteros[2].replace(/[^0-9\.]+/g, "")].draws +
            messages[delanteros[2].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 100,
    },
    {
      name: delanteros[3],
      ELO:
        messages[delanteros[3].replace(/[^0-9\.]+/g, "")].ELO *
        wilsonScore.lowerBound(
          messages[delanteros[3].replace(/[^0-9\.]+/g, "")].wins,
          messages[delanteros[3].replace(/[^0-9\.]+/g, "")].wins +
            messages[delanteros[3].replace(/[^0-9\.]+/g, "")].draws +
            messages[delanteros[3].replace(/[^0-9\.]+/g, "")].losses
        ),
      POS: 100,
    },
  ];

  var team1 = 0;
  var team2 = 0;
  var playercount = 12;

  //add players
  var players = new Array();
  for (var i = 0; i < playercount; i++) {
    players[i] = {
      Index: i,
      Mask: 1 << i,
      Name: playerlist[i].name,
      ELO: playerlist[i].ELO,
      POS: playerlist[i].POS,
      toString: function () {
        return this.Name;
      },
    };
    //about the 1 << i:  "<<" is a so called bit wise shift to the left.
    //1 << i has the same outcome as 2 to the power of i
  }

  //the line below would print all players
  for (var pi in players) {
    var p = players[pi];
    // console.log(p + " (Mask:" + p.Mask + "/ ELO: " + p.ELO + ")");
    // document.write(p + " (Mask:" + p.Mask + ")<br>");
  }
  // document.writeln("<br>");

  //create all possible team combinations
  var teams = new Array();

  var playersPerTeam = Math.floor(playercount / 2);
  function Team() {
    this.list = new Array();
    this.mask = 0;
    this.count = 0;
    this.elo = 0;
    this.pos = 0;
    this.full = false;

    this.Add = function (i) {
      this.list.push(players[i]);
      this.mask |= players[i].Mask;
      this.elo += players[i].ELO;
      this.pos += players[i].POS;
      this.full = ++this.count === playersPerTeam;
    };

    this.toString = function () {
      var res = "",
        cnt = this.list.length;
      for (var i = 0; i < cnt; i++) {
        if (i > 0) res += i == cnt - 1 ? " and " : ",";
        res += this.list[i].Name;
      }
      return res;
    };
  }

  function addplayers() {
    var indices = new Array(playersPerTeam);
    for (var p = 0; p < playersPerTeam; p++) indices[p] = p;
    var l = playersPerTeam - 1;

    function addteam() {
      var team = new Team();
      for (var p = 0; p < playersPerTeam; p++) team.Add(indices[p]);
      teams.push(team);
    }

    function addplayer(start, depth) {
      var target = players.length - playersPerTeam + depth + 1;
      var team;
      for (var i = start; i < target; i++) {
        indices[depth] = i;
        if (depth == l) addteam();
        else addplayer(i + 1, depth + 1);
      }
    }

    addplayer(0, 0);
  }
  addplayers();

  //the line below would print the team combinations
  for (var te in teams) {
    var t = teams[te];
    // console.log(t + " (mask:" + t.mask + ")");
    // document.write(t + " (mask:" + t.mask + ")<br>");
  }
  // document.writeln("<br>");

  //create matches
  var matches = new Array();
  //the matches can be created in the same way as the teams, only the first team cannot have players of the second team
  for (var i = 0; i < teams.length; i++) {
    for (var j = i + 1; j < teams.length; j++) {
      var t1 = teams[i],
        t2 = teams[j];
      if ((t1.mask & t2.mask) === 0)
        //this is where the masks come in,
        matches.push({
          singlekeeper: config.elo.singlekeeper,
          Team1: t1,
          Team2: t2,
          toString: function () {
            return this.Team1 + " versus " + this.Team2;
          },
        });
    }
  }

  //randomize matches. Instead of picking a random match per turn, we can randomize at the
  //start, so we know all the matches in advance.
  //this can be done by using a sort on the array with a random index
  //NB, this isn't the most random randomness (or whatever you call it LOL). For better shuffling
  //there are several alternatives, but perhaps this one is enough
  matches.sort(function () {
    return parseInt(Math.random() * 100) % 2;
  });

  var counter = 0;
  var truecounter = 0;
  var mindif = 8000;
  var indexofmatch;
  //the line below prints the matches
  for (var mi in matches) {
    // document.write(matches[mi] + "<br>");
    // console.log(matches[mi]);
    var team1elo = matches[mi].Team1.elo;
    var team2elo = matches[mi].Team2.elo;
    var team1POS = matches[mi].Team1.pos;
    var team2POS = matches[mi].Team2.pos;
    var elodif = Math.abs(team1elo - team2elo);
    var posdif = Math.abs(team1POS - team2POS);
    if (elodif < mindif && posdif == 0) {
      mindif = elodif;
      indexofmatch = [mi];
    }
    if (posdif == 0) {
      truecounter += 1;
    }
    counter += 1;
  }
  console.log("playerlist is: ");
  console.log("TEST OF ELO");
  for (var i = 0; i < 12; i++) {
    console.log(playerlist[i]);
  }
  console.log(playerlist[0].name);
  console.log("best team found at index " + indexofmatch);
  console.log(
    "Team 1 ELO AVG: " +
      matches[indexofmatch].Team1.elo / 6 +
      "Team 1 ELO AVG: " +
      matches[indexofmatch].Team2.elo / 6
  );
  interaction.followUp(
    `Se han encontrado ${counter} emparejamientos posibles.`
  );
  interaction.followUp(`Solo hay ${truecounter} emparejamientos validos.`);
  interaction.followUp(`Se ha encontrado el mejor emparejamiento.`);
  embed = new Discord.MessageEmbed()
    .setTitle("Matchmaking")
    .setColor("RED")
    .addField(
      `LOCAL (${Math.trunc(matches[indexofmatch].Team1.elo)})`,
      `${matches[indexofmatch].Team1.list[0].Name} ${matches[indexofmatch].Team1.list[1].Name} ${matches[indexofmatch].Team1.list[2].Name} ${matches[indexofmatch].Team1.list[3].Name} ${matches[indexofmatch].Team1.list[4].Name} ${matches[indexofmatch].Team1.list[5].Name}`
    )
    .addField(
      `VISITANTE (${Math.trunc(matches[indexofmatch].Team2.elo)})`,
      `${matches[indexofmatch].Team2.list[0].Name} ${matches[indexofmatch].Team2.list[1].Name} ${matches[indexofmatch].Team2.list[2].Name} ${matches[indexofmatch].Team2.list[3].Name} ${matches[indexofmatch].Team2.list[4].Name} ${matches[indexofmatch].Team2.list[5].Name}`
    )
    //.addField("Servidor", `steam://connect/200.73.128.202:27014`);
    .addField(
      "Servidor",
      `steam://connect/${config.serverip}:${config.eloPort}`
    );
  interaction.followUp({ embeds: [embed] });
  interaction.followUp(
    `Los siguientes jugadores tienen 10 minutos para conectarse al partido: ${matches[indexofmatch].Team1.list[0].Name} ${matches[indexofmatch].Team1.list[1].Name} ${matches[indexofmatch].Team1.list[2].Name} ${matches[indexofmatch].Team1.list[3].Name} ${matches[indexofmatch].Team1.list[4].Name} ${matches[indexofmatch].Team1.list[5].Name} ${matches[indexofmatch].Team2.list[0].Name} ${matches[indexofmatch].Team2.list[1].Name} ${matches[indexofmatch].Team2.list[2].Name} ${matches[indexofmatch].Team2.list[3].Name} ${matches[indexofmatch].Team2.list[4].Name} ${matches[indexofmatch].Team2.list[5].Name}`
  );

  console.log(matches[indexofmatch]);

  fs.writeFileSync(
    `./elo/matchinfo.json`,
    JSON.stringify(matches[indexofmatch]),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );

  fs.writeFileSync(
    `./elo/history/${Math.floor(Date.now() / 1000)}.json`,
    JSON.stringify(matches[indexofmatch]),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );

  return matches[indexofmatch];
}

exports.eloReady = eloReady;
