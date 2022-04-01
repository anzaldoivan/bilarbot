const Discord = require("discord.js");
const decache = require("decache");
const funcDate = require("./getDate.js");
const fs = require("fs");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;

const { DateTime, Interval } = require("luxon");

async function getMatches(interaction, startDate) {
  const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
  const clublist = teamsDB[0];
  const matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
  let matches = matchesDB[0];
  let currentFechaID = funcDate.getDate(startDate);

  let embed = new Discord.MessageEmbed()
    .setTitle(`Partidos confirmados - Semana ${currentFechaID}`)
    .setColor(`#FFFFFF`);
  //.setThumbnail(``);
  let emoji;
  let emoji2;
  let name;
  let name2;
  let streamer;
  let arbitro;
  let canal;

  console.log(`Fecha recibida: ${currentFechaID}`);

  if (!matches[currentFechaID]) currentFechaID -= 1;

  const ordered = Object.keys(matches[currentFechaID])
    .sort()
    .reduce((obj, key) => {
      obj[key] = matches[currentFechaID][key];
      return obj;
    }, {});

  const ordered2 = Object.keys(matches[currentFechaID])
    .sort()
    .reduce((obj, key) => {
      obj[key] = matches[currentFechaID][key];
      return obj;
    }, {});

  console.log(ordered2);

  matches[currentFechaID] = ordered;

  await GetFromDB.updateDb("bilarbot", "matches", matches);

  //console.log(calendar[fecha]);
  for (var key in matches) {
    if (matches.hasOwnProperty(key)) {
      var val = matches[key];
      console.log(val);
      console.log(key);
      for (var key2 in val) {
        if (val.hasOwnProperty(key2)) {
          var match = val[key2];
          for (var key3 in match) {
            if (match.hasOwnProperty(key3)) {
              var matchID = match[key3];
              if (!matchID.arbitro) {
                arbitro = "Sin definir";
              } else {
                arbitro = `<@${matchID.arbitro}>`;
                // arbitro = interaction.guild.members.cache.get(
                //   matchID.arbitro
                // ).displayName;
              }
              if (!matchID.streamer) {
                streamer = "Sin definir";
              } else {
                streamer = `<@${matchID.streamer}>`;
                // streamer = interaction.guild.members.cache.get(
                //   matchID.streamer
                // ).displayName;
              }
              if (!matchID.canal) {
                canal = "Sin definir";
              } else {
                canal = `https://www.twitch.tv/${matchID.canal}`;
              }
              //console.log(matchID);
              let date1 = DateTime.now();
              let date2 = DateTime.fromISO(key2);
              let diff = Interval.fromDateTimes(date2, date1);
              let diffDays = Math.trunc(diff.length("days"));
              if (isNaN(diffDays)) diffDays = 0;
              console.log(`Diff days is: ${diffDays} (${key2})`);
              if (key == currentFechaID && diffDays < 1) {
                let arr = Array.from(matchID.hour);
                embed.addField(
                  `${matchID.day} Partido ${Number(key3) + 1} ${
                    matchID.tournament
                  }`,
                  `${clublist[matchID.home].emoji} ${matchID.home} vs ${
                    matchID.away
                  } ${clublist[matchID.away].emoji}\nHora: ${arr[0]}${arr[1]}:${
                    arr[2]
                  }${
                    arr[3]
                  }\nArbitro: ${arbitro}\nStreamer: ${streamer}\nCanal: ${canal}`
                );
              }
            }
          }
          //console.log(match);
          //console.log(match.home);
        }
      }
    }
  }
  console.log(embed);
  return embed;
}

exports.getMatches = getMatches;
