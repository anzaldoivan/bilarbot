const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const unsign = require("../../utils/unsign.js");
const fetchTop = require("../../utils/fetchTop.js");
const fs = require("fs");
const e = require("express");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

async function fetchRank(topindex, interaction) {
  let roleDiamond = "782472483727081482";
  let roleGold = "782734771582533682";
  let roleSilver = "782732956036628530";
  let roleBronce = "782734886804258816";
  let roleMadera = "796164942909800469";
  if (topindex <= 4) {
    return (rank = "Diamante");
    interaction.member.roles.add(roleDiamond);
    if (roleSilver) interaction.member.roles.remove(roleSilver);
    if (roleBronce) interaction.member.roles.remove(roleBronce);
    if (roleMadera) interaction.member.roles.remove(roleMadera);
  } else {
    if (topindex <= 9) {
      return (rank = "Oro");
      interaction.member.roles.add(roleGold);
      if (roleDiamond) interaction.member.roles.remove(roleDiamond);
      if (roleSilver) interaction.member.roles.remove(roleSilver);
    } else {
      if (topindex <= 14) {
        return (rank = "Plata");
        interaction.member.roles.add(roleSilver);
        if (roleDiamond) interaction.member.roles.remove(roleDiamond);
        if (roleBronce) interaction.member.roles.remove(roleBronce);
        if (roleGold) interaction.member.roles.remove(roleGold);
      } else {
        if (topindex <= 19) {
          return (rank = "Bronce");
          interaction.member.roles.add(roleBronce);
          if (roleGold) interaction.member.roles.remove(roleGold);
          if (roleSilver) interaction.member.roles.remove(roleSilver);
          if (roleMadera) interaction.member.roles.remove(roleMadera);
        } else {
          if (topindex <= 24) {
            return (rank = "Madera");
            interaction.member.roles.add(roleMadera);
            if (roleDiamond) interaction.member.roles.remove(roleDiamond);
            if (roleBronce) interaction.member.roles.remove(roleBronce);
            if (roleSilver) interaction.member.roles.remove(roleSilver);
            if (roleGold) interaction.member.roles.remove(roleGold);
          } else {
            return (rank = "Novato");
            if (roleBronce) interaction.member.roles.remove(roleBronce);
            if (roleMadera) interaction.member.roles.remove(roleMadera);
          }
        }
      }
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("perfil")
    .setDescription("Ver perfil de Matchmaking ELO.")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Puedes ver el perfil de otros usuarios de manera opcional."
        )
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const messagesDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const messages = messagesDB[0];
    let rank = "Inactivo";
    let roleDiamond = "782472483727081482";
    let roleGold = "782734771582533682";
    let roleSilver = "782732956036628530";
    let roleBronce = "782734886804258816";
    let roleMadera = "796164942909800469";
    let user = interaction.options.getUser("usuario");
    if (!user) {
      user = interaction.member.user.id;
    } else {
      user = user.id;
    }

    if (!messages[user]) {
      client.users.cache
        .get(user)
        .send(
          "Usuario no encontrado.\nRecordar configurarlo utilizando $setuser ID. La ID se encuentra en http://iosoccer.com/player-list\nEjemplo: http://iosoccer.com/player-profile/268/statistics -> ID = 268"
        );
      interaction.deleteReply();
      return;
    }

    var topindex = fetchTop.fetchTop(messages, user, "NORMAL");
    var topindexGK = fetchTop.fetchTop(messages, user, "GK");
    var rankGK = await fetchRank(topindexGK, interaction);

    var counter = 0;
    var totalELO = 0;

    console.log(user);
    console.log(interaction.member.user.id);
    // ARREGLAR ROLES
    if (topindex != 0 && topindex <= 5) {
      rank = "Diamante";
      if (interaction.member.user.id == user.id)
        interaction.member.roles.add(roleDiamond);
    }

    if (topindex > 5 && topindex <= 15) rank = "Platino";

    if (topindex > 15 && topindex <= 30) rank = "Oro";

    if (topindex > 30 && topindex <= 50) rank = "Plata";

    if (topindex > 50 && topindex <= 70) rank = "Bronce";

    if (topindex > 70 && topindex <= 90) rank = "Madera";

    if (topindex > 90) rank = "Novato";

    userID = messages[user].user;
    wins = messages[user].wins;
    draws = messages[user].draws;
    losses = messages[user].losses;
    lastMM = messages[user].lastMatch;

    let infoColor = "#000000";
    switch (rank) {
      case "Diamante":
        infoColor = "#00FFF9";
        break;
      case "Platino":
        infoColor = "#FFFFFF";
        break;
      case "Oro":
        infoColor = "#FCFF00";
        break;
      case "Plata":
        infoColor = "#979797";
        break;
      case "Bronce":
        infoColor = "#A36D37";
        break;
      case "Madera":
        infoColor = "#8E7761";
        break;
      case "Novato":
        infoColor = "#888888";
        break;
      case "Inactivo":
        infoColor = "#000000";
        break;
    }

    let rankText = `${rank} (#${topindex})`;
    let rankTextGK = `${rankGK} (#${topindexGK})`;
    if (topindex === 0) rankText = "Inactivo";
    if (topindexGK === 0) rankTextGK = "Inactivo";

    let avatar = client.guilds
      .resolve(interaction.guild.id)
      .members.resolve(user)
      .user.avatarURL();

    embed = new Discord.MessageEmbed()
      .setTitle("Perfil de Matchmaking ELO")
      .setColor(infoColor)
      .setThumbnail(avatar)
      .addField(`Usuario`, `<@${user}>: #${userID}`)
      .addField(`Rango`, `${rankText}`)
      .addField(`Rango (Arquero)`, `${rankTextGK}`)
      .addField(
        `Historial de partidos (Wins/Draws/Losses)`,
        `(${wins}/${draws}/${losses})`
      )
      .addField(
        "Perfil de Steam",
        `http://steamcommunity.com/profiles/${messages[user].steam}`
      )
      .addField(
        "Estadisticas de Matchmaking",
        `http://iosoccer.com/player-profile/${messages[user].user}/statistics`
      )
      .addField(`Ultimo MM Jugado`, `${lastMM}`);

    await interaction.followUp({ embeds: [embed] });
  },
};
