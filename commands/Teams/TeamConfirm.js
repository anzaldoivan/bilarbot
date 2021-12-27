const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const { DateTime, Interval } = require("luxon");
const fs = require("fs");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const funcDate = require("../../utils/getFecha.js");
const funcDate2 = require("../../utils/getDate.js");
const funcTeam = require("../../utils/getTeam.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("confirmar")
    .setDescription("Confirmar un partido con el equipo seleccionado.")
    .addStringOption((option) =>
      option
        .setName("myteam")
        .setDescription("Elija su Equipo.")
        .setRequired(true)
        .addChoice("Academia Shelby", "PEAKY")
        .addChoice("Bravona", "BV")
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Coldchester United", "CCFC")
        .addChoice("Coldchester U-18", "CU")
        .addChoice("Deportivo Moron", "CDM")
        .addChoice("Galactic Boys", "GB")
        .addChoice("Galactic Boys Academy", "GBA")
        .addChoice("Central Cordoba", "IACC")
        .addChoice("La Realeza", "LR")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Los Caballeros de la Birra", "LCB")
        .addChoice("Los Escuderos de la Birra", "LEB")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Penañol", "PEÑ")
        .addChoice("Puro Humo", "PH")
        .addChoice("Bravona Reserva", "BVR")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("X-Squadron", "XSN")
        .addChoice("X-Squadron Reserva", "XSNR")
        .addChoice("We Make Magic", "WMM")
        .addChoice("TEST", "TEST")
    )
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el equipo rival.")
        .setRequired(true)
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Puro Humo", "PH")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("TEST", "TEST")
    )
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Escriba el dia a jugar.")
        .setRequired(true)
        .addChoice("Superliga D1", "<:superligad1:769067664710434816>")
        .addChoice("Liga Zero", "<:ligazero:906284883750576159>")
        .addChoice("Copa ValencArc", "<:copavalencarc:768612526077509672>")
    )
    .addStringOption((option) =>
      option
        .setName("dia")
        .setDescription("Escriba el dia a jugar.")
        .setRequired(true)
        .addChoice("Martes", "1")
        .addChoice("Miercoles", "2")
        .addChoice("Jueves", "3")
        .addChoice("Viernes", "4")
        .addChoice("Sabado", "5")
        .addChoice("Domingo", "6")
        .addChoice("Lunes", "7")
    )
    .addIntegerOption((option) =>
      option
        .setName("horario")
        .setDescription(
          "Escriba el horario a jugar. Ejemplo: 2200 o 2230 (22:30hs)"
        )
        .setRequired(true)
    ),
  channel: ["460972681076932613", "904808330076254238"],
  async execute(interaction) {
    const team = interaction.options.getString("myteam");
    const otherteam = interaction.options.getString("team");
    const torneo = interaction.options.getString("torneo");
    const horario = interaction.options.getInteger("horario");
    const dia = interaction.options.getString("dia");
    decache("../../Teams/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    decache("../../calendar/matches.json");
    const matches = require(`../../calendar/matches.json`);
    const messageAuthor = interaction.member.user.id;
    let week = funcDate.getFecha(messages, team);
    let weekDate = week - 1;
    let calendarWeek = funcDate2.getDate("2021-10-26") + 1;
    //console.log(messages[team].torneo + " " + weekDate);
    if (messages[team].torneo == "amateur") {
      weekDate = weekDate + 1;
    }
    let matchDate = DateTime.local(2021, 10, 25)
      .plus({ weeks: weekDate })
      .plus({ days: dia });
    matchDate = matchDate.toISODate();
    //console.log(matchDate);
    //console.log("WEEK IS: " + week + " WEEKDATE is " + weekDate);

    var directorID = Number(messages[team.toUpperCase()][week].director);
    var captainID = Number(messages[team.toUpperCase()][week].captain);
    var subcaptainID = Number(messages[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == directorID) perms = true;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;
    //console.log(`${perms} ${messageAuthor} ${directorID}`);
    if (!perms) {
      interaction.followUp(`Usted no posee permisos para confirmar partidos.`);
      return;
    }

    if (horario.toString().length != 4) {
      interaction.followUp(
        `Formato de horario incorrecto. Utilice un formato de horario militar.`
      );
      return;
    }

    let counter = 0;
    let minutesDiff;
    let arr1 = Array.from(String(horario));
    let arr2;
    let date1 = DateTime.fromISO(`${arr1[0]}${arr1[1]}:${arr1[2]}${arr1[3]}`);
    let diff;
    let diffMinutes;

    console.log(`Getting: ${calendarWeek} ${matchDate} `);
    if (matches[calendarWeek]) {
      if (matches[calendarWeek][matchDate]) {
        for (let i = 0; i < 100; i++) {
          if (!matches[calendarWeek][matchDate][i]) break;
          arr2 = Array.from(String(matches[calendarWeek][matchDate][i].hour));
          minutesDiff = Math.abs(
            matches[calendarWeek][matchDate][i].hour - horario
          );
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
            `Getting: ${matches[calendarWeek][matchDate][i].hour} - ${horario} vs ${date1} DIFF MINUTES ${diffMinutes}`
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
          return;
        }
      }
    }

    const embed = new MessageEmbed()
      .setTitle(
        `${messages[team].fullname} vs ${messages[otherteam].fullname} el dia ${matchDate} a las ${horario}hs por la ${torneo}`
      )
      .setDescription("Confirmar el partido.");

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("confirmar")
        .setPlaceholder("Selecciona el menu para confirmar el partido.")
        .addOptions([
          {
            label: `Confirmar partido con ${messages[team].fullname} el dia ${matchDate} a las ${horario} horas`,
            description:
              "Confirmar el partido. Ignorar el mensaje para no confirmarlo.",
            value: `${team}/${otherteam}/${week}/${horario}/${matchDate}/${torneo}`,
          },
        ])
    );
    await interaction.editReply({ embeds: [embed], components: [row] });
    console.log(`${otherteam} ${messages[otherteam][week].captain}`);
    await interaction.followUp(
      `<@${messages[otherteam][week].captain}> <@${messages[otherteam][week].subcaptain}> deben confirmar el partido con el menu de arriba.`
    );

    //await interaction.editReply("Pong!");

    // const message = await interaction.fetchReply();

    // const collector = message.createMessageComponentCollector({
    //   componentType: "BUTTON",
    //   time: 15000,
    // });

    // collector.on("collect", (i) => {
    //   if (i.user.id === interaction.user.id) {
    //     i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
    //   } else {
    //     i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
    //   }
    // });

    // collector.on("end", (collected) => {
    //   console.log(`Collected ${collected.size} interactions.`);
    // });

    //funcTeam.getTeam(messages, team, week, interaction);
  },
};
