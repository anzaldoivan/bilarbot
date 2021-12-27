const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const decache = require("decache");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("historial")
    .setDescription("Historial de partido arbitrados / asignados")
    .addStringOption((option) =>
      option
        .setName("opcion")
        .setDescription("Elija el historial.")
        .setRequired(true)
        .addChoice("Arbitros", "arbitro")
        .addChoice("Streamers", "streamer")
    ),
  permission: [
    "485322687682445345",
    "188714975244582913",
    "481215985261740033",
  ],
  channel: ["479442064971661312", "481214239323979787"],
  async execute(interaction) {
    embed = new Discord.MessageEmbed()
      .setTitle("Historial de Partidos Arbitrados/Stremeados")
      .setColor("GREEN");
    decache("../../calendar/matches.json");
    const opcion = interaction.options.getString("opcion");
    let matches = require(`../../calendar/matches.json`);
    let arbitros = [];
    let streamers = [];

    if (opcion == "arbitro") {
      for (var key in matches) {
        if (matches.hasOwnProperty(key)) {
          var val = matches[key];
          for (var key2 in val) {
            if (val.hasOwnProperty(key2)) {
              var match = val[key2];
              for (var key3 in match) {
                if (match.hasOwnProperty(key3)) {
                  var matchID = match[key3];
                  if (!matchID.arbitro) continue;
                  if (!arbitros[matchID.arbitro]) {
                    arbitros[matchID.arbitro] = {
                      counter: 1,
                    };
                  } else {
                    arbitros[matchID.arbitro].counter += 1;
                  }
                }
              }
              //console.log(match);
              //console.log(match.home);
            }
          }
        }
      }

      arbitros.sort(function (a, b) {
        console.log(a[0]);
        return a[0].counter.localeCompare(b[0].counter);
      });

      console.log(arbitros);
      for (var key in arbitros) {
        if (arbitros.hasOwnProperty(key)) {
          var val = arbitros[key];
          let displayName =
            interaction.guild.members.cache.get(key).displayName;
          embed.addField(
            `${displayName}`,
            `<@${key}> / Partidos arbitrados: ${val.counter}`
          );
        }
      }
    }

    if (opcion == "streamer") {
      for (var key in matches) {
        if (matches.hasOwnProperty(key)) {
          var val = matches[key];
          for (var key2 in val) {
            if (val.hasOwnProperty(key2)) {
              var match = val[key2];
              for (var key3 in match) {
                if (match.hasOwnProperty(key3)) {
                  var matchID = match[key3];
                  if (!matchID.streamer) continue;
                  if (!streamers[matchID.streamer]) {
                    streamers[matchID.streamer] = {
                      counter: 1,
                    };
                  } else {
                    streamers[matchID.streamer].counter += 1;
                  }
                }
              }
              //console.log(match);
              //console.log(match.home);
            }
          }
        }
      }

      streamers.sort(function (a, b) {
        console.log(a[0]);
        return a[0].counter.localeCompare(b[0].counter);
      });

      console.log(streamers);
      for (var key in streamers) {
        if (streamers.hasOwnProperty(key)) {
          var val = streamers[key];
          let displayName =
            interaction.guild.members.cache.get(key).displayName;
          embed.addField(
            `${displayName}`,
            `<@${key}> / Partidos stremeados: ${val.counter}`
          );
        }
      }
    }
    //interaction.deleteReply();
    await interaction.followUp({ embeds: [embed] });
  },
};
