const Discord = require("discord.js");
const fs = require("fs");
const { DateTime, Interval } = require("luxon");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

function isCaptain(interaction, team, week) {
  if (!team[week].director) {
    interaction.followUp(
      `Error al leer los datos del equipo. Contactar al Staff.`
    );
    return false;
  }

  // Verifications
  const messageAuthor = interaction.member.user.id;
  var directorID = Number(team[week].director);
  var captainID = Number(team[week].captain);
  var subcaptainID = Number(team[week].subcaptain);
  let perms = false;

  if (messageAuthor == directorID) perms = true;
  if (messageAuthor == captainID) perms = true;
  if (messageAuthor == subcaptainID) perms = true;

  console.log(
    `Week: ${week} / User ID: ${interaction.member.user.id} / CaptainID: ${captainID} / DirectorID: ${directorID} / SubCaptainID: ${subcaptainID}`
  );
  //console.log(team[week]);

  if (!perms) {
    try {
      interaction.followUp(
        `<@${messageAuthor}> Necesitas ser Capitan/DT de ${team.fullname} para realizar esta acción.`
      );
    } catch (error) {
      console.error(error);
    }
  }

  return perms;
}

function checkConfirmedMatches(interaction, matches, matchDate, horario) {
  let counter = 0;
  let minutesDiff;
  let arr1 = Array.from(String(horario));
  let arr2;
  let date1 = DateTime.fromISO(`${arr1[0]}${arr1[1]}:${arr1[2]}${arr1[3]}`);
  let diff;
  let diffMinutes;

  if (matches) {
    console.log(`Testing IF calendar week`);
    if (matches[matchDate]) {
      for (let i = 0; i < 100; i++) {
        if (!matches[matchDate][i]) break;
        arr2 = Array.from(String(matches[matchDate][i].hour));
        minutesDiff = Math.abs(matches[matchDate][i].hour - horario);
        let date2 = DateTime.fromISO(
          `${arr2[0]}${arr2[1]}:${arr2[2]}${arr2[3]}`
        );

        diff = Interval.fromDateTimes(date2, date1);
        diffMinutes = Math.trunc(diff.length("minutes"));
        if (isNaN(diffMinutes)) {
          diff = Interval.fromDateTimes(date1, date2);
          diffMinutes = Math.trunc(diff.length("minutes"));
        }
        console.log(
          `Getting: ${matches[matchDate][i].hour} - ${horario} vs ${date1} DIFF MINUTES ${diffMinutes}`
        );
        console.log(minutesDiff);
        if (diffMinutes < 45) {
          console.log("Adding counter");
          counter += 1;
        }
      }

      console.log(counter);
      if (counter >= 2) {
        interaction.followUp(
          "No se puede confirmar mas de 2 partidos simultaneos."
        );
        return false;
      }
    }
  }
  return true;
}

function checkReleases(interaction, team) {
  // Has releases?
  if (team.releases <= 0) {
    interaction.followUp("No tienes liberaciones disponibles esta semana.");
    return false;
  }
  return true;
}

function checkPlayers(interaction, team, user) {
  // Is in the team?
  if (!team.players.includes(user)) {
    interaction.followUp("El jugador no pertenece a este equipo.");
    return false;
  }
  return true;
}

function checkMinPlayersAmount(interaction, client, team) {
  // Minimum Amount of players verification
  if (team.players.length <= client.config.tournament.minPlayers) {
    interaction.followUp(
      `No puedes liberar jugadores. Tu equipo posee ${team.playerscount} jugadores. El minimo requerido de jugadores es de ${client.config.tournament.minPlayers} jugadores. `
    );
    return false;
  }
  return true;
}

function checkMaxPlayersAmount(interaction, client, team) {
  // Maximum Amount of players verification
  let maxPlayersAmount = client.config.tournament.maxPlayers;

  if (team.players.length >= maxPlayersAmount) {
    interaction.followUp(
      `Usted no puede fichar mas jugadores para este equipo. Has llegado al limite de ${maxPlayersAmount} jugadores.`
    );
    return;
  }
  return true;
}

function checkOtherTeamsPlayers(interaction, teams, week, user, sendMessage) {
  //console.log(user);
  for (var key in teams) {
    if (teams.hasOwnProperty(key)) {
      if (key != "_id" && teams[key][week].players.includes(user)) {
        try {
          if (sendMessage)
            interaction.followUp(
              `El jugador <@${user}> ya pertenece a otro equipo (${teams[key].fullname}).`
            );
          //console.log("returning false!");
        } catch (error) {
          console.error(error);
        }
        return false;
      }
    }
  }
  return true;
}

function checkDivision(interaction, teams, team, user, users, sendMessage) {
  let perms = true;
  let division = teams[team].division.toUpperCase();
  let stringReason;
  console.log(users[user]);
  console.log(division);
  if (users[user]) {
    if (division == "D2") {
      if (users[user].division == "D1") perms = false;
      stringReason = "debido a que ha participado de la D1";
    }
    if (division == "D3") {
      // if (users[user].division == "D1") perms = false;
      // if (users[user].division == "D2") perms = false;
      // stringReason = "debido a que a participo de la D1/D2";
      if (users[user].newbie == false) {
        perms = false;
        stringReason =
          "debido a que no cumple con los requisitos de ser nuevo (6 ofis o menos)";
      }
    }
    console.log("Perms is now " + perms);
    if (!perms) {
      try {
        if (sendMessage)
          interaction.followUp(
            `El jugador <@${user}> no puede jugar en la division ${division} ${stringReason}.`
          );
        console.log("returning false!");
        return perms;
      } catch (error) {
        console.error(error);
      }
    }
  }
  return true;
}

// if (teams[team.toUpperCase()].torneo == "amateur") {
//   if (!member.roles.cache.has("604102329524027392")) {
//     interaction.followUp(
//       "Solamente puedes fichar jugadores con el rol de Nuevo para el Torneo Amateur."
//     );
//     return;
//   }
// }

// if (teams[team.toUpperCase()][week].transfers <= 0) {
//   interaction.followUp("No tienes fichajes disponibles esta semana.");
//   return;
// }

function checkRegistered(interaction, user, users) {
  let perms = true;
  if (!users[user]) perms = false;
  if (users[user] && users[user].steam.length != 17) perms = false;
  try {
    if (!perms)
      interaction.followUp(
        `El jugador designado no tiene registrado un Steam ID. El usuario <@${user}> debe asignarselo con /registrar de manera individual en este mismo canal.`
      );
    console.log("returning false!");
    return perms;
  } catch (error) {
    console.error(error);
  }
  return perms;
}

function canRelease(interaction, client, teams, team, week, user) {
  if (!isCaptain(interaction, teams[team], week)) return false;
  if (!checkReleases(interaction, teams[team][week])) return false;
  if (!checkPlayers(interaction, teams[team][week], user)) return false;
  if (!checkMinPlayersAmount(interaction, client, teams[team][week]))
    return false;
  return true;
}

async function canTransfer(interaction, client, teams, team, user, week) {
  const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
  const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
  const users = await usersDB[0];
  if (!checkRegistered(interaction, user, users)) return false;
  if (!isCaptain(interaction, teams[team], week)) return false;
  if (!checkOtherTeamsPlayers(interaction, teams, week, user, true))
    return false;
  if (!checkDivision(interaction, teams, team, user, users, true)) return false;
  if (
    !checkMaxPlayersAmount(interaction, client, teams[team.toUpperCase()][week])
  )
    return false;
  return true;
}

module.exports = {
  canRelease,
  isCaptain,
  canTransfer,
  checkConfirmedMatches,
  checkOtherTeamsPlayers,
};
