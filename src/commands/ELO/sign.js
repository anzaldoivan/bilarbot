const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const isSigned = require("../../utils/isSigned.js");
const isPlaying = require("../../utils/isPlaying.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const eloManager = require(`${appRoot}/utils/eloManager.js`);

const fs = require("fs");
const e = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Unirse a la lista de espera de Matchmaking ELO.")
    .addStringOption((option) =>
      option
        .setName("pos")
        .setDescription("Elija la posicion en la que desea jugar.")
        .setRequired(true)
        .addChoice("Arquero", "gk")
        .addChoice("Defensor", "defensores")
        .addChoice("Mediocampista", "cm")
        .addChoice("Delantero", "delanteros")
    )
    .addIntegerOption((option) =>
      option
        .setName("duo")
        .setDescription("Escriba la ID de la sala DUO")
        .setRequired(false)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const position = interaction.options.getString("pos");
    const duoID = interaction.options.getInteger("duo");

    await eloManager.sign(interaction, client, position, duoID);
    interaction.deleteReply();
  },
};
