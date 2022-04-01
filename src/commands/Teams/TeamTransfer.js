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

// verano2022 hard code

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fichar")
    .setDescription("Fichar jugador para un equipo.")
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
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario que deseas liberar.")
        .setRequired(true)
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    let user = interaction.options
      .getUser("usuario")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    decache("../../Users/185191450013597696.json");

    const GetFromDB = require("../../Database/GetFromDB.js");
    const teams = await GetFromDB.getEverythingFrom("bilarbot", torneo);

    let week = await funcDate.getFecha(
      teams[0],
      team,
      interaction,
      client.config.tournament.startDate
    );
    console.log("Week is " + week);

    // Validation
    if (
      !(await perms.canTransfer(
        interaction,
        client,
        teams[0],
        team,
        user,
        week
      ))
    )
      return;

    // Release Player
    await TeamManager.transferPlayerDB(
      interaction,
      client,
      teams[0],
      week,
      team,
      user
    );
  },
};
