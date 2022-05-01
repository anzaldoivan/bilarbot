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
    .setName("registrar")
    .setDescription("Asignar un SteamID para registrarse en las competencias.")
    .addStringOption((option) =>
      option
        .setName("steamid")
        .setDescription("El SteamID debe ser de 17 caracteres numericos.")
        .setRequired(true)
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const steamID = interaction.options.getString("steamid");
    const user = interaction.member.id;
    const emojiUpdate = client.emojis.cache.get("954176214220808192");

    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
    const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const teams = await teamsDB[0];
    const users = await usersDB[0];
    console.log(users);

    if (steamID.toString().length != 17) {
      console.log(steamID.toString().length);
      interaction.followUp(
        `Usted debe escribir un SteamID valido de 17 caracteres. Ejemplo: 76561198829366232`
      );
      return;
    }

    for (var key in users) {
      if (users.hasOwnProperty(key) && key != "_id") {
        //console.log(key);
        var val = users[key];
        if (val.key == "steamID") {
          interaction.followUp(
            `El SteamID que escribio ya fue asignado al usuario <@${key}>.`
          );
          return;
        }
      }
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
        steam: steamID,
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
          `${emojiUpdate} El jugador <@${user}> se le ha asignado un SteamID`
        );
    } else {
      users[user].steam = steamID;
      client.channels.cache
        .get("902547421962334219")
        .send(
          `${emojiUpdate} El jugador <@${user}> se le ha asignado su Steam ID.`
        );
    }

    interaction.followUp("Registro realizado con exito.");

    await GetFromDB.updateDb("bilarbot", "users", users);
  },
};
