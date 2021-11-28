const Discord = require("discord.js");
const decache = require("decache");
const funcDate = require("./getDate.js");
const fs = require("fs");

const { DateTime, Interval } = require("luxon");

function getMatches(interaction) {
  decache("../Teams/185191450013597696.json");
  decache("../calendar/matches.json");
  const clublist = require(`../Teams/185191450013597696.json`);
  let matches = require(`../calendar/matches.json`);
  let currentFechaID = funcDate.getDate("2021-10-26");

  let embed = new Discord.MessageEmbed()
    .setTitle(`Partidos confirmados - Semana ${currentFechaID + 1}`)
    .setColor(`#FFFFFF`);
  //.setThumbnail(``);
  let emoji;
  let emoji2;
  let name;
  let name2;
  let streamer;
  let arbitro;

  const ordered = Object.keys(matches[currentFechaID + 1])
    .sort()
    .reduce((obj, key) => {
      obj[key] = matches[currentFechaID + 1][key];
      return obj;
    }, {});

  const ordered2 = Object.keys(matches[currentFechaID + 1])
    .sort()
    .reduce((obj, key) => {
      obj[key] = matches[currentFechaID + 1][key];
      return obj;
    }, {});

  //console.log(ordered2);

  matches[currentFechaID + 1] = ordered;

  fs.writeFileSync(
    `./calendar/matches.json`,
    JSON.stringify(matches),
    (err) => {
      if (err) {
        console.log(err);
        client.channels.cache.get(client.config.mm_channel).send(err);
      }
    }
  );

  //console.log(calendar[fecha]);
  for (var key in matches) {
    if (matches.hasOwnProperty(key)) {
      var val = matches[key];
      //console.log(val);
      //console.log(key);
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
              //console.log(matchID);
              let date1 = DateTime.now();
              let date2 = DateTime.fromISO(key2);
              let diff = Interval.fromDateTimes(date2, date1);
              let diffDays = Math.trunc(diff.length("days"));
              if (isNaN(diffDays)) diffDays = 0;
              //console.log(`Diff days is: ${diffDays} (${key2})`);
              if (key == currentFechaID + 1 && diffDays < 1) {
                let arr = Array.from(matchID.hour);
                embed.addField(
                  `${matchID.day} Partido ${Number(key3) + 1} ${
                    matchID.tournament
                  }`,
                  `${clublist[matchID.home].emoji} ${matchID.home} vs ${
                    matchID.away
                  } ${clublist[matchID.away].emoji}\nHora: ${arr[0]}${arr[1]}:${
                    arr[2]
                  }${arr[3]}\nArbitro: ${arbitro}\nStreamer: ${streamer}`
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
  return embed;
}

exports.getMatches = getMatches;
