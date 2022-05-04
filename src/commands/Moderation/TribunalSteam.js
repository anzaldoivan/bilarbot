const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");
let config = require(`${appRoot}/Config/config.json`);
const CheckPerms = require(`${appRoot}/utils/Teams/RoleManager.js`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tribunalsteam")
    .setDescription("Modificar SteamID de un jugador.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("dato")
        .setDescription("Escribe el steam ID que deseas asignar.")
        .setRequired(true)
    ),
  permission: ["188714975244582913", "686350086422396983"],
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    let dato = interaction.options.getString("dato");
    const steamString = `[${CheckPerms.getSteam(
      dato
    )}](https://iossa-stats.herokuapp.com/jugador/${CheckPerms.getSteam(
      dato
    )})`;
    let user = interaction.options
      .getUser("usuario")
      .toString()
      .replace(/[^0-9\.]+/g, "");

    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const users = await usersDB[0];
    const emojiUpdate = client.emojis.cache.get("954176214220808192");

    const messageAuthor = interaction.member.user.id;

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
          `${emojiUpdate} El tribunal de disciplina le ha asignado al jugador <@${user}> se le ha asignado el SteamID ${steamString}`
        );
    } else {
      client.channels.cache
        .get("902547421962334219")
        .send(
          `${emojiUpdate} El tribunal de disciplina le ha asignado al <@${user}> se le ha asignado el SteamID ${steamString}`
        );
    }

    users[user].steam = dato;

    interaction.followUp("Acción realizada con exito.");

    await GetFromDB.updateDb("bilarbot", "users", users);
  },
};
