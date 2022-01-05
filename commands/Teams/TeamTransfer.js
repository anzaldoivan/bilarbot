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
    .setName("fichar")
    .setDescription("Fichar jugador para un equipo.")
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
    const torneo = client.config.tournament.name;
    decache(`../../Teams/${torneo}.json`);
    const teams = require(`../../Teams/${torneo}.json`);
    let week = funcDate.getFecha(teams, team);
    const messageAuthor = interaction.member.user.id;
    const member = await interaction.guild.members.fetch({
      user: user,
      force: true,
    });
    //console.log(member);

    let maxPlayersAmount = client.config.tournament.maxPlayers;

    if (
      teams[team.toUpperCase()].reserva != 0 &&
      teams[team.toUpperCase()].torneo == "profesional"
    )
      teams[team.toUpperCase()][week].newplayerscount = 0;
    if (teams[team.toUpperCase()][week].newplayerscount != 0)
      maxPlayersAmount = client.config.tournament.maxPlayers;

    var directorID = Number(teams[team.toUpperCase()][week].director);
    var captainID = Number(teams[team.toUpperCase()][week].captain);
    var subcaptainID = Number(teams[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == directorID) perms = true;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;

    if (!perms) {
      interaction.followUp(
        `Usted no posee permisos para fichar jugadores en ${
          teams[team.toUpperCase()].fullname
        }.`
      );
      return;
    }

    if (teams[team.toUpperCase()][week].playerscount >= maxPlayersAmount) {
      interaction.followUp(
        "Usted no puede fichar mas jugadores para este equipo."
      );
      return;
    }

    if (teams[team.toUpperCase()].torneo == "amateur") {
      if (!member.roles.cache.has("604102329524027392")) {
        interaction.followUp(
          "Solamente puedes fichar jugadores con el rol de Nuevo para el Torneo Amateur."
        );
        return;
      }
    }

    // if (teams[team.toUpperCase()][week].transfers <= 0) {
    //   interaction.followUp("No tienes fichajes disponibles esta semana.");
    //   return;
    // }

    let tempWeek;
    for (var key in teams) {
      if (teams.hasOwnProperty(key)) {
        tempWeek = week;
        //if (teams[team.toUpperCase()].torneo == "amateur") tempWeek++;
        if (
          teams[key].torneo == "amateur" &&
          teams[team.toUpperCase()].torneo == "profesional"
        )
          tempWeek--;
        //console.log(key);
        if (teams[key][tempWeek].players.includes(user)) {
          interaction.followUp(
            `El jugador <@${user}> ya pertenece a otro equipo.`
          );
          return;
        }
      }
    }

    //console.log(user);

    if (member.roles.cache.has("604102329524027392")) {
      //console.log(`Yay, the author of the message has the role!`);

      if (
        teams[team.toUpperCase()][week].playerscount ==
          client.config.tournament.maxPlayers &&
        teams[team.toUpperCase()].reserva != 0
      ) {
        interaction.followUp(
          `No puedes fichar un jugador como cupo de nuevo si tienes un equipo de reserva.`
        );
        return;
      }

      if (teams[team.toUpperCase()][week].newplayerscount == 0) {
        teams[team.toUpperCase()][week].newplayer = user;
        teams[team.toUpperCase()][week].newplayerscount = 1;
      }
    }
    // teams[team.toUpperCase()][week].transfers -= 1;
    teams[team.toUpperCase()][week].playerscount += 1;
    teams[team.toUpperCase()][week].players.push(user);

    manageNicks.manageNicks(client, interaction, user, team, "fichar");

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
        `El jugador <@${user}> ha sido fichado por ${
          teams[team.toUpperCase()].fullname
        }`
      );
  },
};
