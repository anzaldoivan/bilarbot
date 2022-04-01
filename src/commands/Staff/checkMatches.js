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
  async execute(interaction, client) {
    let fecha = interaction.options.getInteger("semana");
    const startDate = client.config.tournament.startDate;
    const startDateSplit = startDate.split("-");
    let currentFechaID = funcDate.getDate(startDate);
    //console.log(`Diferencia de semanas: ${currentFechaID}`);

    if (!fecha) {
      fecha = currentFechaID;
    }

    let date = DateTime.local(
      Number(startDateSplit[0]),
      Number(startDateSplit[1]),
      Number(startDateSplit[2])
    ).plus({ weeks: fecha });
    date = date.toISODate();

    console.log(`Fecha: ${date}`);

    embed = await funcMatches.getMatches(interaction, startDate);
    interaction.followUp({ embeds: [embed] });
  },
};
