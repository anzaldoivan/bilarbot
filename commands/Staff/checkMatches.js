const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
const funcMatches = require("../../utils/getMatches.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("partidos")
    .setDescription("Ver partidos confirmados.")
    .addIntegerOption((option) =>
      option.setName("semana").setDescription("Elija la semana.")
    ),
  async execute(interaction) {
    let fecha = interaction.options.getInteger("semana");
    decache("../../Teams/185191450013597696.json");
    decache("../../calendar/matches.json");
    const clublist = require(`../../Teams/185191450013597696.json`);
    const matches = require(`../../calendar/matches.json`);
    let currentFechaID = funcDate.getDate("2021-10-26");
    currentFechaID++;
    //console.log(`Diferencia de semanas: ${currentFechaID}`);

    if (!fecha) {
      fecha = currentFechaID;
    } else {
      fecha--;
    }

    let date = DateTime.local(2021, 10, 25).plus({ weeks: fecha });
    date = date.toISODate();

    if (!matches[fecha]) {
      interaction.followUp("No hay partidos confirmados para esta fecha.");
      return;
    }

    embed = funcMatches.getMatches(interaction);
    interaction.followUp({ embeds: [embed] });
  },
};
