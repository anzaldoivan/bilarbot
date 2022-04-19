const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
const funcMatches = require("../../utils/getMatches.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hora")
    .setDescription("Ver hora actual."),
  async execute(interaction, client) {
    const hora = DateTime.local;
    const horaARG = hora.setZone("Argentina/Buenos_Aires");

    await interaction.followUp(`Hora del SV: ${hora}\nHora local: ${horaARG}`);
  },
};
