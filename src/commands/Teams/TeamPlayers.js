const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");
const fs = require("fs");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const funcTeam = require("../../utils/getTeam.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");
const GetFromDB = require("../../Database/GetFromDB.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plantel")
    .setDescription("Plantel del equipo seleccionado")
    .addStringOption((option) => {
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/verano2022.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }

      return option;
    })
    .addIntegerOption((option) =>
      option
        .setName("semana")
        .setDescription("Elija la semana del plantel.")
        .setRequired(false)
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    let week = interaction.options.getInteger("semana");

    const torneo = client.config.tournament.name;

    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const teams = await GetFromDB.getEverythingFrom("bilarbot", torneo);

    let currentFechaID = await funcDate.getFecha(
      teams[0],
      team,
      interaction,
      client.config.tournament.startDate
    );
    if (week == null) week = currentFechaID;
    if (week > currentFechaID) {
      interaction.followUp("No puedes ver planteles de fechas futuras");
      return;
    }
    //console.log(currentFechaID);

    await funcTeam.getTeam(teams[0], team, week, interaction, client.config);
  },
};
