const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
const funcMatches = require("../../utils/getMatches.js");
const fs = require("fs");
const configuration = require("../../Config/config.json");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asignar")
    .setDescription("Asignar arbitros / streamers")
    .addStringOption((option) => {
      option
        .setName("partido")
        .setDescription("Elija el partido a modificar.")
        .setRequired(true);
      const matches = require(`${appRoot}/calendar/matches.json`);

      const startDate = configuration.tournament.startDate;
      let currentFechaID = funcDate.getDate(startDate);
      //console.log(calendar[fecha]);
      for (var key in matches) {
        if (matches.hasOwnProperty(key)) {
          var val = matches[key];
          for (var key2 in val) {
            if (val.hasOwnProperty(key2)) {
              var match = val[key2];
              for (var key3 in match) {
                if (match.hasOwnProperty(key3)) {
                  var matchID = match[key3];
                  let date1 = DateTime.now();
                  let date2 = DateTime.fromISO(key2);
                  let diff = Interval.fromDateTimes(date2, date1);
                  let diffDays = Math.trunc(diff.length("days"));
                  if (isNaN(diffDays)) diffDays = 0;
                  //console.log(`Diff days is: ${diffDays} (${key2})`);
                  if (key == currentFechaID && diffDays < 1) {
                    //console.log(matchID);
                    option.addChoice(
                      `${matchID.day} ${matchID.home} vs ${matchID.away}`,
                      `${currentFechaID}/${key}/${key2}/${key3}`
                    );
                  }
                }
              }
            }
          }
        }
      }
      return option;
    })
    .addStringOption((option) =>
      option
        .setName("rol")
        .setDescription("Selecciona al usuario que deseas asignar.")
        .setRequired(true)
        .addChoice("Arbitro", "arbitro")
        .addChoice("Streamer", "streamer")
    )
    .addStringOption((option) =>
      option
        .setName("canal")
        .setDescription(
          "Selecciona el canal donde vas a Stremear (Solo para Streamers)."
        )
        .setRequired(true)
        .addChoice("ios_sa", "ios_sa")
        .addChoice("ios_sa2", "ios_sa2")
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Selecciona al usuario que deseas asignar. Seleccione a BilarBOT para desasignar gente."
        )
    ),
  channel: ["931392747259191317", "481214239323979787"],
  async execute(interaction, client) {
    const role = interaction.options.getString("rol");
    //const partido = interaction.options.getString("partido").split("/");
    const partido = interaction.options.getString("partido");
    let canal = interaction.options.getString("canal");
    let user = interaction.options.getUser("usuario");
    if (user) user = user.toString().replace(/[^0-9\.]+/g, "");
    let matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
    let matches = matchesDB[0];
    const messageAuthor = interaction.member.user.id;
    let asignatedUser = messageAuthor;
    const startDate = client.config.tournament.startDate;
    const startDateSplit = startDate.split("-");
    let currentFechaID = funcDate.getDate(startDate);

    let date = DateTime.local(
      Number(startDateSplit[0]),
      Number(startDateSplit[1]),
      Number(startDateSplit[2])
    ).plus({ weeks: currentFechaID });
    date = date.toISODate();

    if (!matches[currentFechaID]) {
      interaction.followUp("No hay partidos confirmados para esta fecha.");
      return;
    }

    if (!matches[partido[0]][partido[2]][partido[3]]) {
      interaction.followUp("El partido seleccionado no existe.");
      return;
    }

    if (user) asignatedUser = user;
    if (asignatedUser == "779492937176186881") {
      asignatedUser = "";
      if (role == "arbitro") {
        interaction.followUp(
          `Se ha quitado al usuario <@${
            matches[partido[0]][partido[2]][partido[3]].arbitro
          }> de su partido asignado.`
        );
      } else {
        canal = "";
        interaction.followUp(
          `Se ha quitado al usuario <@${
            matches[partido[0]][partido[2]][partido[3]].streamer
          }> de su partido asignado.`
        );
      }
    }

    if (role == "arbitro") {
      matches[partido[0]][partido[2]][partido[3]].arbitro = asignatedUser;
    } else {
      matches[partido[0]][partido[2]][partido[3]].streamer = asignatedUser;
      matches[partido[0]][partido[2]][partido[3]].canal = canal;
    }

    await GetFromDB.updateDb("bilarbot", "matches", matches);

    embed = await funcMatches.getMatches(interaction, startDate);
    interaction.followUp({ embeds: [embed] });
  },
};
