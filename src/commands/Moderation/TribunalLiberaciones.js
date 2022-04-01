const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aumentarliberaciones")
    .setDescription(
      "Aumentar liberaciones de un equipo. Comando solo disponible para presidentes del Tribunal."
    )
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
    }),
  permission: ["686350086422396983"],
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    const torneo = client.config.tournament.name;
    decache(`../../Teams/${torneo}.json`);
    const teams = require(`../../Teams/${torneo}.json`);
    let week = funcDate.getFecha(
      teams,
      team,
      interaction,
      client.config.tournament.startDate
    );
    const messageAuthor = interaction.member.user.id;

    teams[team.toUpperCase()][week].releases += 1;

    fs.writeFileSync(`./Teams/${torneo}.json`, JSON.stringify(teams), (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    });

    client.channels.cache
      .get("902547421962334219")
      .send(
        `El representante del Tribunal de Disciplina <@${messageAuthor}> ha aumentado las liberaciones de ${
          teams[team.toUpperCase()].fullname
        }`
      );

    interaction.followUp("Liberaciones aumentadas con exito.");
    return;
  },
};
