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
    .setName("tribunaldiscord")
    .setDescription("Modificar el Discord de un jugador.")
    .addStringOption((option) =>
      option
        .setName("olduser")
        .setDescription("Escriba el ID de Discord del usuario a modificar.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("newuser")
        .setDescription("Selecciona el nuevo usuario.")
        .setRequired(true)
    ),
  permission: ["188714975244582913", "686350086422396983"],
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    let olduser = interaction.options.getString("olduser");
    let newuser = interaction.options
      .getUser("newuser")
      .toString()
      .replace(/[^0-9\.]+/g, "");

    if (olduser.toString().length < 17 && olduser.toString().length > 18) {
      console.log(dato.toString().length);
      interaction.followUp(
        `Usted debe escribir un Discord ID valido de 17/18 caracteres. Ejemplo: 185190495046205451`
      );
      return;
    }

    const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
    const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const users = await usersDB[0];
    const usersCount = Object.keys(users).length;
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", "t9");
    const teams = await teamsDB[0];
    const teamsCount = Object.keys(teams).length;
    const emojiUpdate = client.emojis.cache.get("954176214220808192");

    let week = await funcDate.getFecha(
      teams,
      "TEST",
      interaction,
      client.config.tournament.startDate
    );

    if (!users[olduser]) {
      interaction.followUp(
        `El usuario antiguo que ha ingresado no fue encontrado en nuestra base de datos.`
      );
      return;
    }

    if (users[newuser]) {
      interaction.followUp(
        `El usuario nuevo que ha ingresado fue encontrado en nuestra base de datos. No se puede reemplazar un usuario ya existente.`
      );
      return;
    }

    console.log(users[olduser]);
    users[newuser] = users[olduser];
    delete users[olduser];

    for (var key in teams) {
      if (teams.hasOwnProperty(key)) {
        if (key != "_id") {
          if (!teams[key][week]) {
            interaction.followUp(
              `Error encontrado al acceder el perfil de ${key} de la semana ${week}. Contactar con el Staff.`
            );
            return;
          }
          for (let i = 0; i < teams[key][week].players.length; i++) {
            if (teams[key][week].players[i] == olduser) {
              console.log("Player found!");
              teams[key][week].players[i] = newuser;
              break;
            }
          }
        }
      }
    }

    if (usersCount != Object.keys(users).length) {
      interaction.followUp(
        `Error encontrado al modificar usuarios. Contactar con el Staff.`
      );
      return;
    }

    await GetFromDB.updateDb("bilarbot", "users", users);
    await GetFromDB.updateDb("bilarbot", torneo, teams);

    interaction.followUp("Acción realizada con exito.");

    client.channels.cache
      .get("902547421962334219")
      .send(
        `${emojiUpdate} El tribunal de disciplina ha cambiado el discord del usuario <@${olduser}> por <@${newuser}>`
      );
  },
};
