const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
const funcMatches = require("../../utils/getMatches.js");
const fs = require("fs");
const configuration = require("../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asignarfecha")
    .setDescription("Asignar arbitros / streamers")
    .addStringOption((option) => {
      option
        .setName("partido")
        .setDescription("Elija el partido a modificar.")
        .setRequired(true);
      //decache("../../calendar/matches.json");
      const matches = require(`../../calendar/matches.json`);
      const startDate = configuration.tournament.startDate;
      let currentFechaID = funcDate.getDate(startDate);
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
                  let date1 = DateTime.now();
                  let date2 = DateTime.fromISO(key2);
                  let diff = Interval.fromDateTimes(date2, date1);
                  let diffDays = Math.trunc(diff.length("days"));
                  if (isNaN(diffDays)) diffDays = 0;
                  //console.log(`Diff days is: ${diffDays} (${key2})`);
                  if (key == currentFechaID && diffDays < 1) {
                    option.addChoice(
                      `${matchID.day} ${matchID.home} vs ${matchID.away}`,
                      `${currentFechaID}/${key}/${key2}/${key3}`
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
      return option;
    })
    .addStringOption((option) =>
      option
        .setName("fecha")
        .setDescription("Selecciona la nueva fecha.")
        .setRequired(true)
        .addChoice("Martes", "1")
        .addChoice("Miercoles", "2")
        .addChoice("Jueves", "3")
        .addChoice("Viernes", "4")
        .addChoice("Sabado", "5")
        .addChoice("Domingo", "6")
        .addChoice("Lunes", "7")
        //.addChoice("Borrar Partido", "delete")
        .addChoice("No cambiar fecha", "nochange")
    )
    .addIntegerOption((option) =>
      option
        .setName("horario")
        .setDescription(
          "Escriba el nuevo horario a jugar. Ejemplo: 2200 o 2230 (22:30hs)"
        )
        .setRequired(true)
    ),
  channel: ["931392747259191317", "481214239323979787"],
  async execute(interaction, client) {
    const fecha = interaction.options.getString("fecha");
    const horario = interaction.options.getInteger("horario");
    const partido = interaction.options.getString("partido").split("/");
    decache("../../calendar/matches.json");
    const matches = require(`../../calendar/matches.json`);
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

    if (!matches[partido[0]][partido[2]][partido[3]]) {
      interaction.followUp("El partido seleccionado no existe.");
      return;
    }

    if (!matches[currentFechaID]) {
      interaction.followUp("No hay partidos confirmados para esta fecha.");
      return;
    }

    if (horario.toString().length != 4) {
      interaction.followUp(
        `Formato de horario incorrecto. Utilice un formato de horario militar.`
      );
      return;
    }

    console.log(partido);
    console.log(matches[partido[0]][partido[2]][partido[3]]);

    let newdate;
    if (fecha != "delete" && fecha != "nochange") {
      newdate = DateTime.local(
        Number(startDateSplit[0]),
        Number(startDateSplit[1]),
        Number(startDateSplit[2])
      )
        .plus({ weeks: currentFechaID - 1 })
        .plus({ days: fecha - 1 });
      newdate = newdate.toISODate();
      matches[partido[0]][partido[2]][partido[3]].day = newdate;
      console.log(newdate);
    }
    matches[partido[0]][partido[2]][partido[3]].hour = horario.toString();

    client.channels.cache
      .get("506620871952171028")
      .send(
        `<@${
          interaction.member.id
        }> ha cambiado el horario/fecha del partido de ${
          matches[partido[0]][partido[2]][partido[3]].home
        } contra ${
          matches[partido[0]][partido[2]][partido[3]].away
        } para el dia ${
          matches[partido[0]][partido[2]][partido[3]].day
        } a las ${matches[partido[0]][partido[2]][partido[3]].hour}hs`
      );

    console.log(matches[partido[0]][partido[2]][partido[3]]);

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

    embed = funcMatches.getMatches(interaction, startDate);
    interaction.followUp({ embeds: [embed] });
  },
};
