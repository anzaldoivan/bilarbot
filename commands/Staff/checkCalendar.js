const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calendario")
    .setDescription("Ver calendario.")
    .addIntegerOption((option) =>
      option.setName("semana").setDescription("Elija la semana.")
    ),
  async execute(interaction) {
    let fecha = interaction.options.getInteger("semana");
    decache("../../calendar/t8sd1.json");
    decache("../../calendar/t8sd1.json");
    const clublist = require(`../../Teams/185191450013597696.json`);
    const calendarsd1 = require(`../../calendar/t8sd1.json`);
    const calendarvalen = require(`../../calendar/valen.json`);
    const calendaramateur = require(`../../calendar/amateur.json`);
    let currentFechaID = funcDate.getDate("2021-10-26");
    //currentFechaID++;

    //console.log(`Diferencia de semanas: ${currentFechaID}`);

    if (!fecha) {
      fecha = currentFechaID;
    } else {
      fecha--;
    }

    async function calendarEmbed(
      tournament,
      image,
      calendar,
      color,
      date,
      fecha
    ) {
      if (tournament == "Copa America") date = "";
      if (!calendar[fecha]) {
        interaction.followUp("Fecha invalida.");
        return;
      }
      let embed = new Discord.MessageEmbed()
        .setTitle(`${tournament} Fecha ${fecha + 1} (${date})`)
        .setColor(`${color}`)
        .setThumbnail(`${image}`);
      let emoji;
      let emoji2;
      let name;
      let name2;
      //console.log(calendar[fecha]);
      for (let p = 0; p < calendar[fecha].length; p++) {
        if (!clublist[calendar[fecha][p][0]]) {
          emoji = "⚽";
          name = "A definir";
        } else {
          emoji = clublist[calendar[fecha][p][0]].emoji;
          name = clublist[calendar[fecha][p][0]].fullname;
        }
        if (!clublist[calendar[fecha][p][1]]) {
          emoji2 = "⚽";
          name2 = "A definir";
        } else {
          emoji2 = clublist[calendar[fecha][p][1]].emoji;
          name2 = clublist[calendar[fecha][p][1]].fullname;
        }
        embed.addField(
          `Partido ${p + 1}`,
          `${emoji} ${name} vs ${name2} ${emoji2}`
        );
      }
      interaction.followUp({ embeds: [embed] });
    }

    // const fs = require("fs");
    // let calendar = require(`../calendar/maradei.json`);
    // let calendard1 = require(`../calendar/calendard1.json`);
    // let calendard2 = require(`../calendar/calendard2.json`);
    // let calendarcopad1 = require(`../calendar/copad1.json`);
    // let calendarcopad2 = require(`../calendar/copad2.json`);
    // let calendaramerica = require(`../calendar/america.json`);
    // let calendarvalen = require(`../calendar/valen.json`);
    // const clublist = require(`../Teams/clublist.json`);
    // const teamsEmojis = require(`../Teams/clubemojis.json`);

    // let arr = message.content.split(/[ ,]+/);
    // let fechaID;

    // const currentFechaID = Math.round(
    //   DateTime.now().diff(DateTime.local(2021, 7, 5), "weeks").weeks
    // );
    // console.log(currentFechaID);

    // if (Object.keys(arr).length == 1) {
    //   fechaID = currentFechaID;
    // } else {
    //   fechaID = Number(arr[1]) - 1;
    // }
    // console.log(arr);

    // copad1Date = DateTime.local(2021, 7, 5)
    //   .plus({ weeks: fechaID + 1 })
    //   .toISODate();
    // finalDate = DateTime.local(2021, 7, 5).plus({ weeks: fechaID }).toISODate();

    // if (fechaID + 1 == 1 || fechaID + 1 == 2) {
    //   finalDate = DateTime.local(2021, 7, 12).toISODate();
    // }

    // function calendarEmbed(tournament, image, calendar, color, date, fecha) {
    //   if (tournament == "Copa America") date = "";
    //   let embed = new Discord.MessageEmbed()
    //     .setTitle(`${tournament} Fecha ${fecha + 1} (${date})`)
    //     .setColor(`${color}`)
    //     .setThumbnail(`${image}`);

    //   for (let p = 0; p < calendar[fecha].length; p++) {
    //     embed.addField(
    //       `Partido ${p + 1}`,
    //       `${teamsEmojis[calendar[fecha][p][0]]} ${calendar[fecha][p][0]} vs ${
    //         calendar[fecha][p][1]
    //       } ${teamsEmojis[calendar[fecha][p][1]]}`
    //     );
    //   }
    //   message.channel.send(embed);
    // }

    let sd1Date = DateTime.local(2021, 10, 25).plus({ weeks: fecha });
    sd1Date = sd1Date.toISODate();
    let semana = fecha * 2;
    if (fecha < 2) {
      await calendarEmbed(
        "Superliga D1",
        "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
        calendarsd1,
        "ORANGE",
        sd1Date,
        semana
      );
      await calendarEmbed(
        "Superliga D1",
        "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
        calendarsd1,
        "ORANGE",
        sd1Date,
        semana + 1
      );
    } else {
      await calendarEmbed(
        "Superliga D1",
        "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
        calendarsd1,
        "ORANGE",
        sd1Date,
        fecha + 2
      );
      await calendarEmbed(
        "Copa ValencArc",
        "https://stats.iosoccer-sa.bid/tournaments/copavalencarc.png",
        calendarvalen,
        "ORANGE",
        sd1Date,
        fecha - 2
      );
    }
    //console.log("La fecha es: " + fecha + " La semana es: " + semana);

    // if (fechaID + 1 > 10) {
    //   calendarEmbed(
    //     "Copa D2",
    //     "https://stats.iosoccer-sa.bid/tournaments/ligad2.png",
    //     calendarcopad2,
    //     "BLUE",
    //     copad1Date,
    //     fechaID - 10
    //   );
    // }

    // if (fechaID + 1 < 7) {
    //   calendarEmbed(
    //     "Copa America",
    //     "https://stats.iosoccer-sa.bid/tournaments/copaamerica.png",
    //     calendaramerica,
    //     "RED",
    //     "",
    //     fechaID
    //   );
    // }

    // if (fechaID + 1 < 11) {
    //   calendarEmbed(
    //     "Liga D1",
    //     "https://stats.iosoccer-sa.bid/tournaments/ligad1.png",
    //     calendard1,
    //     "ORANGE",
    //     finalDate,
    //     fechaID
    //   );
    // }

    // if (fechaID + 1 < 11) {
    //   calendarEmbed(
    //     "Liga D2",
    //     "https://stats.iosoccer-sa.bid/tournaments/ligad2.png",
    //     calendard2,
    //     "BLUE",
    //     finalDate,
    //     fechaID
    //   );
    // }

    // if (fechaID + 1 < 11 && fechaID + 1 > 2) {
    //   calendarEmbed(
    //     "Copa ValencArc",
    //     "https://stats.iosoccer-sa.bid/tournaments/copavalencarc.png",
    //     calendarvalen,
    //     "PURPLE",
    //     finalDate,
    //     fechaID - 2
    //   );
    // }

    // embed = new Discord.MessageEmbed()
    //   .setTitle("COMANDOS UTILES PARA ARBITRAR UN PARTIDO")
    //   .setColor("GREEN")
    //   .addField("Reiniciar el servidor para que no crashee", "sm_rcon quit")
    //   .addField(
    //     "Cambiar mapa",
    //     "sm_rcon changelevel 6v6_academy (cambiar nombre por el mapa deseado)"
    //   )
    //   .addField(
    //     "Ver ID de las camisetas de los equipos",
    //     "sm_rcon mp_teamkits_csv (pueden ver las camisetas y los numeros que necesiten) O pueden usar sm_rcon mp_teamkits MG o sm_rcon mp_teamkits meteors para buscar el ID de Meteors Gaming (lo pueden usar para cualquier equipo)"
    //   );
    //await interaction.followUp("En mantenimiento");
  },
};
