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
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true)
        .addChoice("Academia Shelby", "PEAKY")
        .addChoice("Bravona", "BV")
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Coldchester United", "CCFC")
        .addChoice("Coldchester U-18", "CU")
        .addChoice("Deportivo Moron", "CDM")
        .addChoice("Galactic Boys", "GB")
        .addChoice("Galactic Boys Academy", "GBA")
        .addChoice("Central Cordoba", "IACC")
        .addChoice("La Realeza", "LR")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Los Caballeros de la Birra", "LCB")
        .addChoice("Los Escuderos de la Birra", "LEB")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Penañol", "PEÑ")
        .addChoice("Puro Humo", "PH")
        .addChoice("Bravona Reserva", "BVR")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("X-Squadron", "XSN")
        .addChoice("X-Squadron Reserva", "XSNR")
        .addChoice("We Make Magic", "WMM")
        .addChoice("TEST", "TEST")
    )
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
      messages[team.toUpperCase()][week].newplayerscount = 0;
    }
    //console.log(messages[team.toUpperCase()][week].players.indexOf(user));
    const index = messages[team.toUpperCase()][week].players.indexOf(user);
    if (index > -1) {
      messages[team.toUpperCase()][week].players.splice(index, 1);
    }
    messages[team.toUpperCase()][week].releases -= 1;
    messages[team.toUpperCase()][week].playerscount -= 1;

    //manageNicks.manageNicks(client, interaction, user, team, "liberar");

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
