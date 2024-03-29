const Discord = require("discord.js");
const { DateTime } = require("luxon");
const bignumber = require("bignumber.js");
const decache = require("decache");
const CheckPerms = require(`${appRoot}/utils/Teams/RoleManager.js`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

function createTeamList(fecha, team, interaction) {
  if (!messages[team.toUpperCase()][fecha - 1]) {
    interaction.followUp(
      `No se ha encontrado la planilla para la semana ${week}.`
    );
  } else {
    interaction.followUp("Planilla valida encontrada.");
    let copy = messages[team.toUpperCase()][fecha - 1];
    copy.transfers = 2;
    copy.releases = 2;
    //console.log(copy);
    //console.log(messages[team.toUpperCase()]);
    messages[team.toUpperCase()].push(`"7": ${copy}`);
    interaction.followUp("Planilla creada.");
  }
}

async function getTeam(messages, team, week, interaction, config) {
  //console.log(messages);
  //console.log(`Team: ${team}`);
  if (!messages[team.toUpperCase()]) {
    interaction.followUp("Equipo no encontrado.");
    return;
  }
  decache("../Users/185191450013597696.json");
  let currentFechaID = Math.round(
    DateTime.now().diff(DateTime.local(2021, 10, 25), "weeks").weeks
  );
  let maxPlayersAmount;
  try {
    let message;
    if (messages[team]) {
      let playerstring = "";
      if (!messages[team][week]) {
        message = "Semana no encontrada.";
        //createTeamList(currentFechaID, team);
        return message;
      }
      //console.log(messages[team][week].players);
      const playersAmount = Object.keys(messages[team][week].players).length;
      //console.log(playersAmount);
      messages[team][week].playerscount = playersAmount;
      if (messages[team][week].newplayerscount) {
        maxPlayersAmount = config.tournament.maxPlayers;
      } else {
        maxPlayersAmount = config.tournament.maxPlayers;
      }
      //console.log(week);

      const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
      const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
      const users = usersDB[0];

      let steam;
      let displayName;
      let discordError = "";

      embed = new Discord.MessageEmbed()
        .setTitle(`Perfil de Equipo`)
        .setColor("#000000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/clubs/${team.toLowerCase()}.png`
        )
        .addField(`Nombre del Equipo`, `${messages[team].fullname}`)
        .addField(`Torneo`, `Torneo ${messages[team].torneo.toUpperCase()}`)
        .addField(`Division`, `${messages[team].division.toUpperCase()}`)
        .addField(`Semana`, `Semana ${week}`)
        .addField(
          `Capitan / Subcapitan`,
          `<@${messages[team][week].captain}> / <@${messages[team][week].subcaptain}>`
        )
        .addField(
          `Fichajes de Emergencia disponibles`,
          `${messages[team][week].emergency}`
        )
        // .addField(
        //   `Fichajes disponibles (Emergencia)`,
        //   `${messages[team][week].transfers} (${messages[team][week].emergency})`
        // )
        .addField(
          `Liberaciones disponibles`,
          `${messages[team][week].releases}`
        )
        .addField(
          `Postergaciones disponibles`,
          `${messages[team][week].postponement}`
        )
        .addField(
          `Jugadores`,
          `${messages[team][week].players.length}/${maxPlayersAmount}`
        );
      for (var key in messages[team][week].players) {
        if (messages[team][week].players.hasOwnProperty(key)) {
          // console.log(
          //   interaction.guild.members.cache.get(
          //     messages[team][week].players[key]
          //   )
          // );
          if (users[messages[team][week].players[key]]) {
            //console.log(users[messages[team][week].players[key]]);

            users[messages[team][week].players[key]].division =
              messages[team].division.toUpperCase();
          }
          if (
            interaction.guild.members.cache.get(
              messages[team][week].players[key]
            )
          ) {
            if (!users[messages[team][week].players[key]]) {
              displayName = interaction.guild.members.cache.get(
                messages[team][week].players[key]
              ).displayName;
            } else {
              if (!users[messages[team][week].players[key]].nick) {
                displayName = interaction.guild.members.cache.get(
                  messages[team][week].players[key]
                ).displayName;
              } else {
                displayName = users[messages[team][week].players[key]].nick;
              }
            }
          } else {
            displayName = "Jugador no encontrado en Discord";
            discordError += `Nombre: <@${messages[team][week].players[key]}> / ID: ${messages[team][week].players[key]}`;
          }
          if (!users[messages[team][week].players[key]]) {
            steam = "Sin registrar";
          } else {
            /*steam = bignumber(
                  users[messages[team][week].players[key]].steam
                ).minus("76561197960265728");*/

            steam = CheckPerms.getSteam(
              users[messages[team][week].players[key]].steam
            );
            // steam = `[${CheckPerms.getSteam(
            //   users[messages[team][week].players[key]].steam
            // )}](http://steamcommunity.com/profiles/${
            //   users[messages[team][week].players[key]].steam
            // })`;
            steam = `[${CheckPerms.getSteam(
              users[messages[team][week].players[key]].steam
            )}](https://iossa-stats.herokuapp.com/jugador/${CheckPerms.getSteam(
              users[messages[team][week].players[key]].steam
            )})`;
          }
          //playerstring += `<@${messages[team][week].players[key]}> (${steam})\n`;

          embed.addField(
            `${displayName}`,
            `<@${messages[team][week].players[key]}> (${steam})`
          );

          //playerstring += `${displayName} (<@${messages[team][week].players[key]}>) (${steam})\n`;
        }
      }
      if (
        messages[team][week].newplayerscount &&
        messages[team].torneo == "profesional"
      )
        embed.addField(`Cupo de nuevo`, `<@${messages[team][week].newplayer}>`);
      if (messages[team].reserva)
        embed.addField(`Equipo de Reserva`, `${messages[team].reserva}`);
      if (messages[team][week].director != messages[team][week].captain)
        embed.addField(
          `Director Tecnico`,
          `<@${messages[team][week].director}>`
        );
      if (discordError) {
        embed.addField(
          `Jugadores fuera de Discord`,
          `${discordError}\n\nPara liberar jugadores fuera de Discord, utilizar el comando /liberarid`
        );
      }
      await GetFromDB.updateDb("bilarbot", "users", users);
      interaction.followUp({ embeds: [embed] });
      return embed;
    } else {
      message = "Equipo no encontrado";
      //console.log("Team not found");
      return message;
    }
  } catch (error) {
    console.error(error);
    getTeam(messages, team, 0, interaction, config);
  }
}

exports.getTeam = getTeam;
