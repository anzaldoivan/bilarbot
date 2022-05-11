const Discord = require("discord.js");
const { DateTime } = require("luxon");
const bignumber = require("bignumber.js");
const decache = require("decache");
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

async function getTeamEmbed(json, week, interaction, config) {
  decache("../Users/185191450013597696.json");
  let maxPlayersAmount;
  try {
    let message;
    let playerstring = "";
    if (!json[week]) {
      message = "Semana no encontrada.";
      //createTeamList(currentFechaID, team);
      return message;
    }
    //console.log(json[week].players);
    const playersAmount = Object.keys(json[week].players).length;
    //console.log(playersAmount);
    json[week].playerscount = playersAmount;
    if (json[week].newplayerscount) {
      maxPlayersAmount = config.tournament.maxPlayers;
    } else {
      maxPlayersAmount = config.tournament.maxPlayers;
    }
    //console.log(week);
    const messagesDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const users = messagesDB[0];
    let steam;
    let displayName;
    let discordError = "";

    embed = new Discord.MessageEmbed()
      .setTitle(`Perfil de Equipo`)
      .setColor("#000000")
      .setThumbnail(
        `https://stats.iosoccer-sa.bid/clubs/${json.id.toLowerCase()}.png`
      )
      .addField(`Nombre del Equipo`, `${json.fullname}`)
      .addField(`Torneo`, `Torneo ${json.torneo}`)
      .addField(`Semana`, `Semana ${week}`)
      .addField(
        `Capitan / Subcapitan`,
        `<@${json[week].captain}> / <@${json[week].subcaptain}>`
      )
      .addField(`Fichajes de Emergencia disponibles`, `${json[week].emergency}`)
      // .addField(
      //   `Fichajes disponibles (Emergencia)`,
      //   `${json[week].transfers} (${json[week].emergency})`
      // )
      .addField(`Liberaciones disponibles`, `${json[week].releases}`)
      .addField(`Postergaciones disponibles`, `${json[week].postponement}`)
      .addField(`Jugadores`, `${playersAmount}/${maxPlayersAmount}`);
    for (var key in json[week].players) {
      if (json[week].players.hasOwnProperty(key)) {
        // console.log(
        //   interaction.guild.members.cache.get(
        //     json[week].players[key]
        //   )
        // );
        if (interaction.guild.members.cache.get(json[week].players[key])) {
          if (!users[json[week].players[key]]) {
            displayName = interaction.guild.members.cache.get(
              json[week].players[key]
            ).displayName;
          } else {
            if (!users[json[week].players[key]].nick) {
              displayName = interaction.guild.members.cache.get(
                json[week].players[key]
              ).displayName;
            } else {
              displayName = users[json[week].players[key]].nick;
            }
          }
        } else {
          displayName = "Jugador no encontrado en Discord";
          discordError += `Nombre: <@${json[week].players[key]}> / ID: ${json[week].players[key]}`;
        }
        if (!users[json[week].players[key]]) {
          steam = "Sin registrar";
        } else {
          /*steam = bignumber(
                  users[json[week].players[key]].steam
                ).minus("76561197960265728");*/

          steam = `[STEAM_0:${users[json[week].players[key]].steam % 2}:${
            (users[json[week].players[key]].steam -
              (76561197960265728 +
                (users[json[week].players[key]].steam % 2))) /
            2
          }](http://steamcommunity.com/profiles/${
            users[json[week].players[key]].steam
          })`;
        }
        //playerstring += `<@${json[week].players[key]}> (${steam})\n`;
        embed.addField(
          `${displayName}`,
          `<@${json[week].players[key]}> (${steam})`
        );
        //playerstring += `${displayName} (<@${json[week].players[key]}>) (${steam})\n`;
      }
    }
    if (json[week].newplayerscount && json.torneo == "profesional")
      embed.addField(`Cupo de nuevo`, `<@${json[week].newplayer}>`);
    if (json.reserva) embed.addField(`Equipo de Reserva`, `${json.reserva}`);
    if (json[week].director != json[week].captain)
      embed.addField(`Director Tecnico`, `<@${json[week].director}>`);
    if (discordError) {
      embed.addField(
        `Jugadores fuera de Discord`,
        `${discordError}\n\nPara liberar jugadores fuera de Discord, utilizar el comando /liberarid`
      );
    }
    interaction.followUp({ embeds: [embed] });
    return embed;
  } catch (error) {
    console.error(error);
    getTeam(messages, team, 0, interaction, config);
  }
}

exports.getTeamEmbed = getTeamEmbed;
