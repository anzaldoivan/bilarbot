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
    .setName("postergarmanual")
    .setDescription(
      "Agregar postergaciones a un equipo. Comando solo disponible para presidentes del Tribunal."
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
    decache("../../Teams/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    let week = funcDate.getFecha(messages, team);
    const messageAuthor = interaction.member.user.id;

    messages[team.toUpperCase()][week].postponement -= 1;

    fs.writeFileSync(
      "./Teams/185191450013597696.json",
      JSON.stringify(messages),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );

    client.channels.cache
      .get("902547421962334219")
      .send(
        `El representante del Tribunal de Disciplina <@${messageAuthor}> ha disminuido las postergaciones de ${
          messages[team.toUpperCase()].fullname
        }`
      );

    interaction.followUp("Postergaciones aumentadas con exito.");
    return;
  },
};
