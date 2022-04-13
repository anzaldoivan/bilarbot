const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");
const perms = require("../../utils/Teams/CheckPerms.js");
const TeamManager = require("../../utils/Teams/TeamManager.js");
let config = require(`${appRoot}/Config/config.json`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("liberarid")
    .setDescription("Liberar jugador de un equipo.")
    .addStringOption((option) => {
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }

      return option;
    })
    .addStringOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Escribe la ID del usuario que deseas liberar. Ejemplo: 866700554293346314"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("modo")
        .setDescription("Selecciona el tipo de liberacion.")
        .setRequired(true)
        .addChoice("Normal", "normal")
        .addChoice(
          "Ex Jugador (no puede ser fichado por otros equipos)",
          "exjugador"
        )
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    const mode = interaction.options.getString("modo");
    let user = interaction.options.getString("usuario");
    const torneo = client.config.tournament.name;

    const GetFromDB = require("../../Database/GetFromDB.js");
    const teams = await GetFromDB.getEverythingFrom("bilarbot", torneo);

    let week = await funcDate.getFecha(
      teams[0],
      team,
      interaction,
      client.config.tournament.startDate
    );

    // Validation
    if (!perms.canRelease(interaction, client, teams[0], team, week, user))
      return;

    await TeamManager.releasePlayerDB(
      interaction,
      client,
      teams[0],
      week,
      team,
      user,
      mode
    );
  },
};
