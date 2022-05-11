const { SlashCommandBuilder } = require("@discordjs/builders");
const funcRCON = require("../../utils/eloSetup.js");
const funcPlaying = require("../../utils/isPlaying.js");
const decache = require("decache");

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
    try {
      // a path we KNOW is totally bogus and not a module
      decache(`../../elo/${matchID}.json`);
      playerlist = require(`../../elo/${matchID}.json`);
    } catch (e) {
      console.log("oh no big error");
      console.log(e);
      interaction.followUp("No se ha podido encontrar la sala.");
      return;
    }
    let bool = await funcPlaying.isPlaying(interaction);
    console.log(bool);
    if (!bool) {
      interaction.followUp(
        "Solamente los jugadores de la partida pueden configurarla."
      );
      return;
    }
    if (!playerlist) {
      interaction.followUp("La ID introducida no existe.");
      return;
    }
    await funcRCON.eloSetup(
      client.config,
      playerlist.port,
      matchID,
      interaction
    );
    interaction.followUp(
      `Servidor configurado correctamente en el servidor steam://connect/${client.config.serverip}:${playerlist.port}/elomatch.`
    );
    return;
  },
};
