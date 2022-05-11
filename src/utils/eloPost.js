const fs = require("fs");
const funcRCON = require("./eloDisable.js");
const funcElo = require("./eloCalculator.js");
const funcEloSK = require("./eloCalculatorSK.js");
const Discord = require("discord.js");
const decache = require("decache");

async function eloPost(req, res, config, client) {
  console.log(req.ip);
  console.log(config.serverip);
  console.log(config.elo.token);
  if (req.ip != config.serverip || req.ip != config.serverip) {
    res.end("Incorrect Token");
    console.log(req.ip);
    console.log(config.serverip);

    console.dir(
      `Received JSON from ${req.ip}. Valid IP is ${config.serverip}. Response is ended`
    );
    return;
  }
  const token = req.body.access_token.split(":", 2);
  console.log(token);
  if (token[0] != config.elo.token) {
    console.dir(
      `Received JSON TOKEN from ${req.ip}: ${token[0]}. Valid Token is ${config.elo.token}. Response is ended`
    );
    return;
  }
  try {
    decache("../elo/matchinfo.json");
    let playerlist = require(`../elo/${token[1]}.json`);
    let torneo = `${token[1]}`;
    let vod = "";
    let local = 0;
    let visitante = 0;
    let homeresult = 0;

    let date = new Date();
    let bonus = false;
    let hour = date.getHours();

    if (
      hour == "00" ||
      hour == "01" ||
      hour == "02" ||
      hour == "04" ||
      hour == "05"
    ) {
      bonus = true;
    }
    console.log(`Hour from MM is: ${hour} / Bonus is: ${bonus} `);

    if (req.body.matchData.teams[0].matchTotal.name == "Equipo 1") {
      console.log("Teams[0] is Team 1");
      local = req.body.matchData.teams[0].matchTotal.statistics[12];
      visitante = req.body.matchData.teams[1].matchTotal.statistics[12];
    } else {
      console.log("Teams[1] is Team 1");
      local = req.body.matchData.teams[1].matchTotal.statistics[12];
      visitante = req.body.matchData.teams[0].matchTotal.statistics[12];
    }

    if (local == visitante) {
      homeresult = 0.5;
    } else {
      if (local > visitante) {
        homeresult = 1;
      } else {
        homeresult = -1;
      }
    }
    console.log(playerlist);
    console.log(
      `JSON received. Comparing JSON IP ${req.ip} with valid IP ${config.serverip}`
    );

    funcRCON.eloDisable(req.ip, playerlist.port, config);
    console.log("DEBUG PLAYERLIST");
    console.log(playerlist);
    if (playerlist.singlekeeper) {
      await funcEloSK.eloCalculatorSK(homeresult, playerlist, bonus, 6);
      console.log("Json with SK Received correctly");
    } else {
      await funcElo.eloCalculator(homeresult, playerlist, bonus, 6);
      console.log("Json without SK Received correctly");
    }
    res.end(" -> JSON subido con exito");
    embed = new Discord.MessageEmbed()
      .setTitle("Matchmaking - Resultado")
      .setColor("BLUE")
      .addField(
        `LOCAL - ${local}`,
        `${playerlist.Team1.list[0].Name} ${playerlist.Team1.list[1].Name} ${playerlist.Team1.list[2].Name} ${playerlist.Team1.list[3].Name} ${playerlist.Team1.list[4].Name} ${playerlist.Team1.list[5].Name}`
      )
      .addField(
        `VISITANTE - ${visitante}`,
        `${playerlist.Team2.list[0].Name} ${playerlist.Team2.list[1].Name} ${playerlist.Team2.list[2].Name} ${playerlist.Team2.list[3].Name} ${playerlist.Team2.list[4].Name} ${playerlist.Team2.list[5].Name}`
      )
      .addField("ELO Boost", `${bonus}`);
    client.channels.cache.get("779460129065009172").send({ embeds: [embed] });
    console.log("ELO Match finished correctly!");
  } catch (e) {
    console.error(e);
    res.end(e.toString());
  }
  console.log("Cleaning matchinfo and players");

  playerlist = [];
  let isPlaying = [];
  fs.unlink(`./elo/${token[1]}.json`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  //   fs.writeFileSync(
  //     `./elo/${token[1]}.json`,
  //     JSON.stringify(playerlist),
  //     (err) => {
  //       if (err) {
  //         console.log(err);
  //         interaction.followUp(err);
  //       }
  //     }
  //   );
  fs.writeFileSync(
    `./src/elo/matchplayers.json`,
    JSON.stringify(isPlaying),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );
  return;
}

exports.eloPost = eloPost;
