const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
let config = require(`${appRoot}/Config/config.json`);
const torneo = config.tournament.name;

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
    const clublist = require(`${appRoot}/Teams/t9.json`);
    const calendarsd1 = require(`${appRoot}/calendar/${torneo}d1.json`);
    const calendarsd2 = require(`${appRoot}/calendar/${torneo}d2.json`);
    const calendarsd3 = require(`${appRoot}/calendar/${torneo}d3.json`);
    const calendarvalen = require(`../../calendar/valen.json`);
    const calendaramateur = require(`../../calendar/amateur.json`);
    let currentFechaID = funcDate.getDate("2022-03-28");
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
      console.log(calendar[fecha]);
      for (let p = 0; p < calendar[fecha].length; p++) {
        console.log(calendar[fecha][p][0]);
        if (!clublist[calendar[fecha][p][0]]) {
          emoji = "⚽";
          name = calendar[fecha][p][0];
        } else {
          emoji = clublist[calendar[fecha][p][0]].emoji;
          name = clublist[calendar[fecha][p][0]].fullname;
        }
        if (!clublist[calendar[fecha][p][1]]) {
          emoji2 = "⚽";
          name2 = calendar[fecha][p][1];
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
    let sd1Date = DateTime.local(2022, 03, 28).plus({ weeks: fecha - 1 });
    sd1Date = sd1Date.toISODate();
    let semana = fecha * 2;

    await calendarEmbed(
      "D1",
      "https://stats.iosoccer-sa.bid/tournaments/d1.png",
      calendarsd1,
      "ORANGE",
      sd1Date,
      semana
    );
    await calendarEmbed(
      "D2",
      "https://stats.iosoccer-sa.bid/tournaments/d2.png",
      calendarsd2,
      "BLUE",
      sd1Date,
      semana
    );
    await calendarEmbed(
      "D3",
      "https://stats.iosoccer-sa.bid/tournaments/d2.png",
      calendarsd3,
      "GREEN",
      sd1Date,
      semana
    );

    // T8
    // if (fecha < 2) {

    //   await calendarEmbed(
    //     "Superliga D1",
    //     "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
    //     calendarsd1,
    //     "ORANGE",
    //     sd1Date,
    //     semana
    //   );
    //   await calendarEmbed(
    //     "Superliga D1",
    //     "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
    //     calendarsd1,
    //     "ORANGE",
    //     sd1Date,
    //     semana + 1
    //   );
    // } else {
    //   await calendarEmbed(
    //     "Superliga D1",
    //     "https://stats.iosoccer-sa.bid/tournaments/sd1.png",
    //     calendarsd1,
    //     "ORANGE",
    //     sd1Date,
    //     fecha + 2
    //   );
    //   await calendarEmbed(
    //     "Copa ValencArc",
    //     "https://stats.iosoccer-sa.bid/tournaments/copavalencarc.png",
    //     calendarvalen,
    //     "ORANGE",
    //     sd1Date,
    //     fecha - 2
    //   );
    // }

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
