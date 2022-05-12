const { SlashCommandBuilder } = require("@discordjs/builders");
const funcRCON = require("../../utils/eloSetup.js");
const funcPlaying = require("../../utils/isPlaying.js");
const decache = require("decache");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

const fs = require("fs");
const e = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configurar partida de Matchmaking ELO.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("Escriba el codigo de partido.")
        .setRequired(true)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const matchID = interaction.options.getInteger("id");
    let playerlist;
    const playerlistDB = await GetFromDB.getEverythingFrom(
      "bilarbot",
      "elomatches"
    );
    if (!playerlistDB[0][matchID]) {
      await interaction.followUp("La ID introducida no existe.");
      return;
    }
    playerlist = playerlistDB[0][matchID];
    //console.log(playerlistDB[0]);
    console.log(playerlist);
    console.log(playerlist.port);
    console.log(matchID);

    let bool = await funcPlaying.isPlaying(interaction);
    if (interaction.member.user.id == "185190495046205451") bool = true;
    console.log(bool);
    if (!bool) {
      await interaction.followUp(
        "Solamente los jugadores de la partida pueden configurarla."
      );
      return;
    }
    // if (!playerlist) {
    //   await interaction.followUp("La ID introducida no existe.");
    //   return;
    // }
    // await funcRCON.eloSetup(
    //   client.config,
    //   playerlist.port,
    //   matchID,
    //   interaction
    // );
    funcRCON.eloSetup(client.config, playerlist.port, matchID);
    await interaction.followUp(
      `Servidor configurado correctamente para el partido #${matchID}.`
    );
    return;
  },
};
