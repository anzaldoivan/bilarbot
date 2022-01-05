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
    .setName("liberarid")
    .setDescription("Liberar jugador de un equipo.")
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
    .addStringOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Escribe la ID del usuario que deseas liberar. Ejemplo: 866700554293346314"
        )
        .setRequired(true)
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    let user = interaction.options.getString("usuario");
    const torneo = client.config.tournament.name;
    decache(`../../Teams/${torneo}.json`);
    const teams = require(`../../Teams/${torneo}.json`);
    let week = funcDate.getFecha(teams, team);
    const messageAuthor = interaction.member.user.id;
    var directorID = Number(teams[team.toUpperCase()][week].director);
    var captainID = Number(teams[team.toUpperCase()][week].captain);
    var subcaptainID = Number(teams[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == directorID) perms = true;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;
    if (!perms) {
      interaction.followUp(
        `Usted no posee permisos para liberar jugadores en ${
          teams[team.toUpperCase()].fullname
        }.`
      );
      return;
    }

    if (teams[team.toUpperCase()][week].releases <= 0) {
      interaction.followUp("No tienes liberaciones disponibles esta semana.");
      return;
    }
    //console.log("The player ID sent on $liberar is: " + user);

    if (!teams[team][week].players.includes(user)) {
      interaction.followUp("El jugador no pertenece a este equipo.");
      return;
    }

    if (teams[team.toUpperCase()][week].newplayer == user) {
      //console.log(`Yay, the user is in new player section!`);
      teams[team.toUpperCase()][week].newplayer = "";
      teams[team.toUpperCase()][week].newplayerscount = 0;
    }
    //console.log(teams[team.toUpperCase()][week].players.indexOf(user));
    const index = teams[team.toUpperCase()][week].players.indexOf(user);
    if (index > -1) {
      teams[team.toUpperCase()][week].players.splice(index, 1);
    }
    teams[team.toUpperCase()][week].releases -= 1;
    teams[team.toUpperCase()][week].playerscount -= 1;

    //manageNicks.manageNicks(client, interaction, user, team, "liberar");

    fs.writeFileSync(`./Teams/${torneo}.json`, JSON.stringify(teams), (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    });

    funcTeam.getTeam(teams, team, week, interaction, client.config);
    client.channels.cache
      .get("902547421962334219")
      .send(
        `El jugador <@${user}> ha sido liberado de ${
          teams[team.toUpperCase()].fullname
        }`
      );
  },
};
