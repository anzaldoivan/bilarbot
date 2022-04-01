const { SlashCommandBuilder } = require("@discordjs/builders");
const funcRCON = require("../../utils/eloSetup.js");
const funcPrivate = require("../../utils/privateMessage.js");
const funcReady = require("../../utils/eloReady.js");
const funcRemove = require("../../utils/removeSigned.js");
const isSigned = require("../../utils/isSigned.js");
const decache = require("decache");
const funcPlayers = require("../../utils/getPlayers.js");

const fs = require("fs");
const e = require("express");

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ready")
    .setDescription("Comenzar la partida de Matchmaking ELO.")
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription("Elija el servidor donde enviar el comando.")
        .setRequired(true)
        // .addChoice("Servidor #1", "27015")
        // .addChoice("Servidor #2", "27016")
        // .addChoice("Servidor #3", "27017")
        // .addChoice("Servidor #4", "27018")
        .addChoice("Privado #1", "24555")
        .addChoice("Privado #2", "24556")
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const serverport = interaction.options.getString("servidor");
    const matchID = between(100000, 999999);
    let gk;
    let defensores;
    let cm;
    let delanteros;
    decache("../../elo/matchinfo.json");
    const matchinfo = require(`../../elo/matchinfo.json`);

    if (interaction.channelId == "779460129065009172") {
      gk = require(`../../elo/gk.json`);
      defensores = require(`../../elo/defensores.json`);
      cm = require(`../../elo/cm.json`);
      delanteros = require(`../../elo/delanteros.json`);
    } else {
      gk = require(`../../elo/gk_nuevos.json`);
      defensores = require(`../../elo/defensores_nuevos.json`);
      cm = require(`../../elo/cm_nuevos.json`);
      delanteros = require(`../../elo/delanteros_nuevos.json`);
    }

    // if (matchinfo.length != 0) {
    //   interaction.followUp(
    //     "No se puede comenzar el emparejamiento si hay una partida en curso."
    //   );
    //   return;
    // }

    let maxGK;
    if (client.config.elo.singlekeeper) {
      maxGK = 1;
    } else {
      maxGK = 2;
    }

    if (
      gk.length >= maxGK &&
      defensores.length >= 4 &&
      cm.length >= 2 &&
      delanteros.length >= 4
    ) {
      let bool = await funcPlayers.getPlayers(
        interaction,
        client.config,
        serverport
      );
      let players;
      players = client.config.players;
      players = players.split(" ");
      if (players[2] >= 5) {
        interaction.followUp("El servidor tiene mas de 5 jugadores jugando.");
        return;
      }
      let playerlist = await funcReady.eloReady(
        interaction,
        client.config,
        matchID,
        serverport
      );

      funcRCON.eloSetup(client.config, serverport, matchID);
      let readyOFF = true;
      let matchSK = false;
      //console.log(playerlist);
      //console.log(playerlist.Team1.list);
      //console.log(playerlist.Team2.list);

      funcPrivate.privateMessage(client, serverport, matchID);
      funcRemove.removeSigned(client);
    } else {
      interaction.followUp(
        "Insuficientes jugadores para comenzar el matchmaking."
      );
    }
  },
};
