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
    .setName("asignarequipo")
    .setDescription("Asignar capitanes, steamID o nicks de un equipo.")
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

    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
    const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const teams = await teamsDB[0];
    const users = await usersDB[0];
    const emojiUpdate = client.emojis.cache.get("954176214220808192");

    let week = await funcDate.getFecha(
      teams,
      team,
      interaction,
      client.config.tournament.startDate
    );
    console.log(`Teams ${teams} ${team} ${week}`);
    console.log(teams);
    const messageAuthor = interaction.member.user.id;
    var directorID = Number(teams[team.toUpperCase()][week].director);
    var captainID = Number(teams[team.toUpperCase()][week].captain);
    var subcaptainID = Number(teams[team.toUpperCase()][week].subcaptain);
    var captainRole;
    let perms = false;
    if (messageAuthor == directorID) perms = true;

    if (!teams[team][week].players.includes(user)) {
      interaction.followUp(`El jugador <@${user}> no pertenece a este equipo.`);
      return;
    }

    if (modo == "capitan") {
      let capitan = user;
      if (!perms) {
        interaction.followUp(
          `Solo los directores tecnicos pueden asignar capitanes.`
        );
        return;
      }

      if (teams[team].torneo == "amateur") {
        captainRole = "905584692588314675";
      } else {
        captainRole = "458075157253062657";
      }

      if (!teams[team][week].players.includes(capitan)) {
        interaction.followUp(
          `El jugador <@${capitan}> no pertenece a este equipo.`
        );
        return;
      }

      if (
        interaction.guild.members.cache.get(
          teams[team.toUpperCase()][week].captain.toString()
        )
      )
        await interaction.guild.members.cache
          .get(teams[team.toUpperCase()][week].captain.toString())
          .roles.remove(captainRole);

      await interaction.guild.members.cache
        .get(capitan.toString())
        .roles.add(captainRole);

      teams[team.toUpperCase()][week].captain = capitan;
      client.channels.cache
        .get("902547421962334219")
        .send(
          `${emojiUpdate} El jugador <@${capitan}> ha sido designado como el nuevo capitan de ${
            teams[team.toUpperCase()].fullname
          }`
        );
    }

    if (modo == "subcapitan") {
      let subcapitan = user;
      if (!perms) {
        interaction.followUp(
          `Solo los directores tecnicos pueden asignar subcapitanes.`
        );
        return;
      }

      if (teams[team].torneo == "amateur") {
        captainRole = "905584692588314675";
      } else {
        captainRole = "458075157253062657";
      }

      if (!teams[team][week].players.includes(subcapitan)) {
        interaction.followUp(
          `El jugador <@${subcapitan}> no pertenece a este equipo.`
        );
        return;
      }

      if (
        interaction.guild.members.cache.get(
          teams[team.toUpperCase()][week].subcaptain.toString()
        )
      )
        interaction.guild.members.cache
          .get(teams[team.toUpperCase()][week].subcaptain.toString())
          .roles.remove(captainRole);

      interaction.guild.members.cache
        .get(subcapitan.toString())
        .roles.add(captainRole);

      teams[team.toUpperCase()][week].subcaptain = subcapitan;
      client.channels.cache
        .get("902547421962334219")
        .send(
          `${emojiUpdate} El jugador <@${subcapitan}> ha sido designado como el nuevo subcapitan de ${
            teams[team.toUpperCase()].fullname
          }`
        );
    }

    if (modo == "steamid") {
      if (user != interaction.member.id) {
        if (!perms) {
          interaction.followUp(
            `Solo los directores tecnicos pueden cambiar SteamID ajenos al tuyo.`
          );
          return;
        }
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

      if (users[user]) {
        if (users[user].steam != "Sin registrar") {
          interaction.followUp(
            `El jugador <@${user}> ya tiene asignado un SteamID. Contactar al Staff para cambiar su SteamID.`
          );
          return;
        }
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
            `${emojiUpdate} El jugador <@${user}> de ${
              teams[team.toUpperCase()].fullname
            } se le ha asignado un SteamID`
          );
      } else {
        client.channels.cache
          .get("902547421962334219")
          .send(
            `${emojiUpdate} El jugador <@${user}> de ${
              teams[team.toUpperCase()].fullname
            } se le ha asignado su Steam ID.`
          );
      }

      users[user].steam = dato;
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
            `${emojiUpdate} El jugador <@${user}> de ${
              teams[team.toUpperCase()].fullname
            } se le ha asignado un Nick`
          );
      } else {
        users[user].nick = dato;
        client.channels.cache
          .get("902547421962334219")
          .send(
            `${emojiUpdate} El jugador <@${user}> de ${
              teams[team.toUpperCase()].fullname
            } ha cambiado su Nick por ${dato}`
          );
      }
    }

    await GetFromDB.updateDb("bilarbot", torneo, teams);
    await GetFromDB.updateDb("bilarbot", "users", users);

    await funcTeam.getTeam(teams, team, week, interaction, client.config);
  },
};
