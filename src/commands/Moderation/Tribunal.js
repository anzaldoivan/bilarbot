const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");
let config = require(`${appRoot}/Config/config.json`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tribunal")
    .setDescription(
      "Modificar postergaciones, liberaciones y otros datos de un equipo."
    )
    .addStringOption((option) => {
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true);
      const teamsOptions = require(`${appRoot}/Teams/${torneo}.json`);
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
        .setName("modo")
        .setDescription("Selecciona la accion que deseas realizar.")
        .setRequired(true)
        .addChoice("Aumentar Postergaciones", "postergaciones+")
        .addChoice("Disminuir Postergaciones", "postergaciones-")
        .addChoice("Aumentar Liberaciones", "liberaciones+")
        .addChoice("Disminuir Liberaciones", "liberaciones-")
        .addChoice("Aumentar Fichajes de Emergencia", "emergencia+")
        .addChoice("Disminuir Fichajes de Emergencia", "emergencia-")
    ),
  permission: ["188714975244582913", "686350086422396983"],
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    const modo = interaction.options.getString("modo");
    const torneo = client.config.tournament.name;
    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
    const teams = teamsDB[0];
    let week = await funcDate.getFecha(
      teams,
      team,
      interaction,
      client.config.tournament.startDate
    );
    const messageAuthor = interaction.member.user.id;
    let stringMessage;

    if (!teams[team.toUpperCase()][week]) {
      interaction.followUp(
        `Error encontrado al acceder el perfil de ${team.toUpperCase()} de la semana ${week}. Contactar con el Staff.`
      );
      return;
    }

    if (modo == "postergaciones+") {
      teams[team.toUpperCase()][week].postponement += 1;
      stringMessage = "aumentado las postergaciones";
    }

    if (modo == "postergaciones-") {
      teams[team.toUpperCase()][week].postponement -= 1;
      stringMessage = "disminuido las postergaciones";
    }

    if (modo == "liberaciones+") {
      teams[team.toUpperCase()][week].releases += 1;
      stringMessage = "aumentado las liberaciones";
    }

    if (modo == "liberaciones-") {
      teams[team.toUpperCase()][week].releases -= 1;
      stringMessage = "disminuido las liberaciones";
    }

    if (modo == "emergencia+") {
      teams[team.toUpperCase()][week].emergency += 1;
      stringMessage = "aumentado los fichajes de emergencia";
    }

    if (modo == "emergencia-") {
      teams[team.toUpperCase()][week].emergency -= 1;
      stringMessage = "disminuido los fichajes de emergencia";
    }

    await GetFromDB.updateDb("bilarbot", torneo, teams);

    client.channels.cache
      .get("902547421962334219")
      .send(
        `<@${messageAuthor}> ha ${stringMessage} de ${
          teams[team.toUpperCase()].fullname
        }`
      );

    interaction.followUp("Acción realizada con exito.");
    return;
  },
};
