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
    .setName("liberar")
    .setDescription("Liberar jugador de un equipo.")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true)
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Puro Humo", "PH")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("TEST", "TEST")
    )
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
    decache("../../Teams/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    let week = funcDate.getFecha(messages, team);
    const messageAuthor = interaction.member.user.id;
    var directorID = Number(messages[team.toUpperCase()][week].director);
    var captainID = Number(messages[team.toUpperCase()][week].captain);
    var subcaptainID = Number(messages[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == directorID) perms = true;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;
    if (!perms) {
      interaction.followUp(
        `Usted no posee permisos para liberar jugadores en ${
          messages[team.toUpperCase()].fullname
        }.`
      );
      return;
    }

    if (messages[team.toUpperCase()][week].releases <= 0) {
      interaction.followUp("No tienes liberaciones disponibles esta semana.");
      return;
    }
    //console.log("The player ID sent on $liberar is: " + user);

    if (!messages[team][week].players.includes(user)) {
      interaction.followUp("El jugador no pertenece a este equipo.");
      return;
    }

    if (messages[team.toUpperCase()][week].newplayer == user) {
      //console.log(`Yay, the user is in new player section!`);

      messages[team.toUpperCase()][week].newplayer = "";
      if (messages[team.toUpperCase()].torneo != "amateur")
        messages[team.toUpperCase()][week].newplayerscount = 0;
    }
    //console.log(messages[team.toUpperCase()][week].players.indexOf(user));
    const index = messages[team.toUpperCase()][week].players.indexOf(user);
    if (index > -1) {
      messages[team.toUpperCase()][week].players.splice(index, 1);
    }
    messages[team.toUpperCase()][week].releases -= 1;
    messages[team.toUpperCase()][week].playerscount -= 1;

    manageNicks.manageNicks(client, interaction, user, team, "liberar");

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

    funcTeam.getTeam(messages, team, week, interaction);
    client.channels.cache
      .get("902547421962334219")
      .send(
        `El jugador <@${user}> ha sido liberado de ${
          messages[team.toUpperCase()].fullname
        }`
      );
  },
};
