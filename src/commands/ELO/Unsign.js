const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const unsign = require("../../utils/unsign.js");
const isSigned = require("../../utils/isSigned.js");
const fs = require("fs");
const e = require("express");
const eloManager = require(`${appRoot}/utils/eloManager.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unsign")
    .setDescription("Abandonar la lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    await eloManager.unsign(interaction, client);
    interaction.deleteReply();
    return;
  },
};
