const Discord = require("discord.js");
const fs = require("fs");
const funcTeam = require("../getTeam.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

async function manageNicks(client, interaction, user, team, mode) {
  var nickold = interaction.guild.members.cache.get(user.toString()).nickname;
  var nick;
  var fullNick = "";
  if (nickold == null) {
    nick = interaction.guild.members.cache.get(user.toString()).user.username;
  } else {
    nick = nickold.split(" ").slice(1).join(" ");
  }
  if (mode == "liberar") {
    fullNick = `[FREE] ${nick}`;
    if (fullNick.length > 32) fullNick = fullNick.substring(0, 31);
    try {
      await interaction.guild.members.cache
        .get(user.toString())
        .setNickname(fullNick);
      await interaction.guild.members.cache
        .get(user.toString())
        .roles.remove("737114701565263932");
    } catch (error) {
      console.log(error);
    }
  }
  if (mode == "fichar") {
    fullNick = `[${team}] ${nick}`;
    if (fullNick.length > 32) fullNick = fullNick.substring(0, 31);
    try {
      await interaction.guild.members.cache
        .get(user.toString())
        .setNickname(fullNick);
      await interaction.guild.members.cache
        .get(user.toString())
        .roles.add("737114701565263932");
    } catch (error) {
      console.log(error);
    }
  }
  return;
}

async function transferPlayerDB(interaction, client, user) {
  const torneo = client.config.tournament.name;
  const emojiTransfer = client.emojis.cache.get("954174577142030366");
  let stringFichaje = "fichado";
  if (mode == "emergencia") {
    stringFichaje += " de emergencia";
    teams[team.toUpperCase()][week].emergency -= 1;
  }

  // if (member.roles.cache.has("604102329524027392")) {
  //   //console.log(`Yay, the author of the message has the role!`);

  //   if (
  //     teams[team.toUpperCase()][week].playerscount ==
  //       client.config.tournament.maxPlayers &&
  //     teams[team.toUpperCase()].reserva != 0
  //   ) {
  //     interaction.followUp(
  //       `No puedes fichar un jugador como cupo de nuevo si tienes un equipo de reserva.`
  //     );
  //     return;
  //   }

  //   if (teams[team.toUpperCase()][week].newplayerscount == 0) {
  //     teams[team.toUpperCase()][week].newplayer = user;
  //     teams[team.toUpperCase()][week].newplayerscount = 1;
  //   }
  // }

  teams[team.toUpperCase()][week].playerscount =
    teams[team.toUpperCase()][week].players.length;
  teams[team.toUpperCase()][week].players.push(user);

  manageNicks(client, interaction, user, team, "fichar");

  await GetFromDB.updateDb("bilarbot", torneo, teams);

  await funcTeam.getTeam(teams, team, week, interaction, client.config);
  client.channels.cache
    .get("902547421962334219")
    .send(
      `${emojiTransfer} El jugador <@${user}> ha sido ${stringFichaje} por ${
        teams[team.toUpperCase()].fullname
      }`
    );
  return;
}

module.exports = {
  releasePlayer,
  releasePlayerDB,
  transferPlayer,
  transferPlayerDB,
  freezeTeam,
  manageNicks,
};
