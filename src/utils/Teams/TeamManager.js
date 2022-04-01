const Discord = require("discord.js");
const fs = require("fs");
const funcTeam = require("../getTeam.js");
const GetFromDB = require("../../Database/GetFromDB.js");

function updateFile(interaction, file, newFile) {
  fs.writeFileSync(
    `./src/Teams/${file}.json`,
    JSON.stringify(newFile),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );
}

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

function releasePlayer(interaction, client, teams, week, team, user) {
  const torneo = client.config.tournament.name;
  const emojiRelease = client.emojis.cache.get("954175513327443998");

  // Is a new player?
  if (teams[team.toUpperCase()][week].newplayer == user) {
    //console.log(`Yay, the user is in new player section!`);

    teams[team.toUpperCase()][week].newplayer = "";
    if (teams[team.toUpperCase()].torneo != "amateur")
      teams[team.toUpperCase()][week].newplayerscount = 0;
  }
  //console.log(teams[team.toUpperCase()][week].players.indexOf(user));
  const index = teams[team.toUpperCase()][week].players.indexOf(user);
  if (index > -1) {
    teams[team.toUpperCase()][week].players.splice(index, 1);
  }
  teams[team.toUpperCase()][week].releases -= 1;
  teams[team.toUpperCase()][week].playerscount =
    teams[team.toUpperCase()][week].players.length;

  if (interaction.guild.members.cache.get(user.toString()))
    manageNicks(client, interaction, user, team, "liberar");

  updateFile(interaction, torneo, teams);

  funcTeam.getTeam(teams, team, week, interaction, client.config);
  client.channels.cache
    .get("902547421962334219")
    .send(
      `${emojiRelease} El jugador <@${user}> ha sido liberado de ${
        teams[team.toUpperCase()].fullname
      }`
    );
  return;
}

function freezeTeam(interaction, client, teams, week, team) {
  const torneo = client.config.tournament.name;

  teams[team.toUpperCase()][week].director = "779492937176186881";
  teams[team.toUpperCase()][week].captain = "779492937176186881";
  teams[team.toUpperCase()][week].subcaptain = "779492937176186881";

  updateFile(interaction, torneo, teams);

  funcTeam.getTeam(teams, team, week, interaction, client.config);
  client.channels.cache
    .get("902547421962334219")
    .send(
      `Se han bloqueado los fichajes / liberaciones de ${
        teams[team.toUpperCase()].fullname
      }.`
    );
  return;
}

async function releasePlayerDB(interaction, client, teams, week, team, user) {
  const torneo = client.config.tournament.name;
  const emojiRelease = client.emojis.cache.get("954175513327443998");

  // Is a new player?
  if (teams[team.toUpperCase()][week].newplayer == user) {
    //console.log(`Yay, the user is in new player section!`);

    teams[team.toUpperCase()][week].newplayer = "";
    if (teams[team.toUpperCase()].torneo != "amateur")
      teams[team.toUpperCase()][week].newplayerscount = 0;
  }
  //console.log(teams[team.toUpperCase()][week].players.indexOf(user));
  const index = teams[team.toUpperCase()][week].players.indexOf(user);
  if (index > -1) {
    teams[team.toUpperCase()][week].players.splice(index, 1);
  }
  teams[team.toUpperCase()][week].releases -= 1;
  teams[team.toUpperCase()][week].playerscount =
    teams[team.toUpperCase()][week].players.length;

  manageNicks(client, interaction, user, team, "liberar");

  await GetFromDB.updateDb("bilarbot", torneo, teams);

  await funcTeam.getTeam(teams, team, week, interaction, client.config);
  client.channels.cache
    .get("902547421962334219")
    .send(
      `${emojiRelease} El jugador <@${user}> ha sido liberado de ${
        teams[team.toUpperCase()].fullname
      }`
    );
  return;
}

function transferPlayer(interaction, client, teams, week, team, user) {
  const torneo = client.config.tournament.name;
  const emojiTransfer = client.emojis.cache.get("954174577142030366");

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

  teams[team.toUpperCase()][week].playerscount =
    teams[team.toUpperCase()][week].players.length;
  teams[team.toUpperCase()][week].players.push(user);

  manageNicks.manageNicks(client, interaction, user, team, "fichar");

  fs.writeFileSync(
    `./src/Teams/${torneo}.json`,
    JSON.stringify(teams),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );

  funcTeam.getTeam(teams, team, week, interaction, client.config);
  client.channels.cache
    .get("902547421962334219")
    .send(
      `${emojiTransfer} El jugador <@${user}> ha sido fichado por ${
        teams[team.toUpperCase()].fullname
      }`
    );
}

async function transferPlayerDB(interaction, client, teams, week, team, user) {
  const torneo = client.config.tournament.name;
  const emojiTransfer = client.emojis.cache.get("954174577142030366");

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
      `${emojiTransfer} El jugador <@${user}> ha sido fichado por ${
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
