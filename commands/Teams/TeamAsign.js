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
    .setName("asignarequipo")
    .setDescription("Asignar capitanes, steamID o nicks de un equipo.")
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
    .addStringOption((option) =>
      option
        .setName("modo")
        .setDescription(
          "Selecciona el modo que deseas utilizar. Asignar capitanes, SteamID o Nicks"
        )
        .setRequired(true)
        .addChoice("Capitan", "capitan")
        .addChoice("Subcapitan", "subcapitan")
        .addChoice("SteamID", "steamid")
        .addChoice("Nick", "nick")
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("dato")
        .setDescription("Escribe el steam ID o nick que deseas asignar.")
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    let modo = interaction.options.getString("modo");
    let dato = interaction.options.getString("dato");
    let user = interaction.options
      .getUser("usuario")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    decache("../../Teams/185191450013597696.json");
    decache("../../Users/185191450013597696.json");
    const users = require(`../../Users/185191450013597696.json`);
    const messages = require(`../../Teams/185191450013597696.json`);
    let week = funcDate.getFecha(messages, team);
    const messageAuthor = interaction.member.user.id;
    var directorID = Number(messages[team.toUpperCase()][week].director);
    var captainID = Number(messages[team.toUpperCase()][week].captain);
    var subcaptainID = Number(messages[team.toUpperCase()][week].subcaptain);
    var captainRole;
    let perms = false;
    if (messageAuthor == directorID) perms = true;

    if (!messages[team][week].players.includes(user)) {
      interaction.followUp("El jugador no pertenece a este equipo.");
      return;
    }

    if (modo == "capitan") {
      let capitan = user;
      if (!perms) {
        interaction.followUp(`Usted no posee permisos para asignar capitanes.`);
        return;
      }

      if (messages[team].torneo == "amateur") {
        captainRole = "905584692588314675";
      } else {
        captainRole = "458075157253062657";
      }

      if (!messages[team][week].players.includes(capitan)) {
        interaction.followUp(
          `El jugador <@${capitan}> no pertenece a este equipo.`
        );
        return;
      }

      if (
        interaction.guild.members.cache.get(
          messages[team.toUpperCase()][week].captain.toString()
        )
      )
        interaction.guild.members.cache
          .get(messages[team.toUpperCase()][week].captain.toString())
          .roles.remove(captainRole);

      interaction.guild.members.cache
        .get(capitan.toString())
        .roles.add(captainRole);

      messages[team.toUpperCase()][week].captain = capitan;
      client.channels.cache
        .get("902547421962334219")
        .send(
          `El jugador <@${capitan}> ha sido designado como el nuevo subcapitan de ${
            messages[team.toUpperCase()].fullname
          }`
        );
    }

    if (modo == "subcapitan") {
      let subcapitan = user;
      if (!perms) {
        interaction.followUp(`Usted no posee permisos para asignar capitanes.`);
        return;
      }

      if (messages[team].torneo == "amateur") {
        captainRole = "905584692588314675";
      } else {
        captainRole = "458075157253062657";
      }

      if (!messages[team][week].players.includes(subcapitan)) {
        interaction.followUp(
          `El jugador <@${subcapitan}> no pertenece a este equipo.`
        );
        return;
      }

      if (
        interaction.guild.members.cache.get(
          messages[team.toUpperCase()][week].subcaptain.toString()
        )
      )
        interaction.guild.members.cache
          .get(messages[team.toUpperCase()][week].subcaptain.toString())
          .roles.remove(captainRole);

      interaction.guild.members.cache
        .get(subcapitan.toString())
        .roles.add(captainRole);

      messages[team.toUpperCase()][week].subcaptain = subcapitan;
      client.channels.cache
        .get("902547421962334219")
        .send(
          `El jugador <@${subcapitan}> ha sido designado como el nuevo subcapitan de ${
            messages[team.toUpperCase()].fullname
          }`
        );
    }

    if (modo == "steamid") {
      if (!perms && user == interaction.member.id) {
        interaction.followUp(`Usted no posee permisos para asignar SteamID.`);
        return;
      }
      if (!dato) {
        interaction.followUp(
          `Usted debe escribir un SteamID con la opcion de Dato.`
        );
        return;
      }
      if (dato.toString().length != 17) {
        console.log(dato.toString().length);
        interaction.followUp(
          `Usted debe escribir un SteamID valido de 17 caracteres. Ejemplo: 76561198829366232`
        );
        return;
      }

      if (users[user] && users[user] != "Sin registrar") {
        interaction.followUp(
          `El jugador <@${user}> ya tiene asignado un SteamID. Contactar al Staff para cambiar su SteamID.`
        );
        return;
      }

      if (!users[user]) {
        users[user] = {
          user: user,
          nick: interaction.guild.members.cache.get(user).displayName,
          ping: `<@${user}>`,
          steam: dato,
          ELO: 100,
          ELOGK: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          lastMatch: 0,
          country: "Sin definir",
        };
        client.channels.cache
          .get("902547421962334219")
          .send(
            `El jugador <@${user}> de ${
              messages[team.toUpperCase()].fullname
            } se le ha asignado un SteamID`
          );
      } else {
        client.channels.cache
          .get("902547421962334219")
          .send(
            `El jugador <@${user}> de ${
              messages[team.toUpperCase()].fullname
            } se le ha asignado su Steam ID.`
          );
      }

      // users[user].steam = dato;
    }

    if (modo == "nick") {
      console.log(`${user} ${interaction.member.id}`);
      if (!perms && user != interaction.member.id) {
        interaction.followUp(`Usted no posee permisos para asignar nicks.`);
        return;
      }
      if (!dato) {
        interaction.followUp(
          `Usted debe escribir un Nick con la opcion de Dato.`
        );
        return;
      }
      if (!users[user]) {
        users[user] = {
          user: user,
          nick: dato,
          ping: `<@${user}>`,
          steam: "Sin registrar",
          ELO: 100,
          ELOGK: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          lastMatch: 0,
          country: "Sin definir",
        };
        client.channels.cache
          .get("902547421962334219")
          .send(
            `El jugador <@${user}> de ${
              messages[team.toUpperCase()].fullname
            } se le ha asignado un Nick`
          );
      } else {
        users[user].nick = dato;
        client.channels.cache
          .get("902547421962334219")
          .send(
            `El jugador <@${user}> de ${
              messages[team.toUpperCase()].fullname
            } ha cambiado su Nick por ${dato}`
          );
      }
    }

    fs.writeFileSync(
      "./Users/185191450013597696.json",
      JSON.stringify(users),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );

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
  },
};
