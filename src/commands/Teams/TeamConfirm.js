const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
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
const perms = require("../../utils/Teams/CheckPerms.js");
const TeamManager = require("../../utils/Teams/TeamManager.js");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("confirmar")
    .setDescription("Confirmar un partido con el equipo seleccionado.")
    .addStringOption((option) => {
      option
        .setName("myteam")
        .setDescription("Elija su Equipo.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("team")
        .setDescription("Elija el Equipo rival.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    })
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Escriba el torneo a jugar.")
        .setRequired(true)
        .addChoice("D1", "t9d1")
        .addChoice("D2", "t9d2")
        .addChoice("D3", "t9d3")
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
  async execute(interaction, client) {
    const team = interaction.options.getString("myteam");
    const otherteam = interaction.options.getString("team");
    const competencia = interaction.options.getString("torneo");
    const horario = interaction.options.getInteger("horario");
    const dia = interaction.options.getString("dia");
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
    const teams = teamsDB[0];
    const torneoEmoji = "<:verano20:651632603295907843>";
    const matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
    const matches = matchesDB[0];
    const startDate = client.config.tournament.startDate;
    const startDateSplit = startDate.split("-");
    let week = await funcDate.getFecha(
      teams,
      team,
      interaction,
      client.config.tournament.startDate
    );
    let weekDate = week - 1;
    console.log("weekdate: " + weekDate + " / week: " + week);
    let matchDate = DateTime.local(
      Number(startDateSplit[0]),
      Number(startDateSplit[1]),
      Number(startDateSplit[2])
    )
      .plus({ weeks: weekDate })
      .plus({ days: dia - 1 });
    matchDate = matchDate.toISODate();

    // Verifications
    if (!perms.isCaptain(interaction, teams[team], week)) return;

    if (horario.toString().length != 4) {
      interaction.followUp(
        `Formato de horario incorrecto. Utilice un formato de horario militar.`
      );
      return;
    }

    if (
      !perms.checkConfirmedMatches(
        interaction,
        matches[week],
        matchDate,
        horario
      )
    )
      return;
    // End of Verifications

    let stringDia = "";
    switch (Number(dia)) {
      case 1:
        stringDia = "Martes";
        break;
      case 2:
        stringDia = "Miercoles";
        break;
      case 3:
        stringDia = "Jueves";
        break;
      case 4:
        stringDia = "Viernes";
        break;
      case 5:
        stringDia = "Sabado";
        break;
      case 6:
        stringDia = "domingo";
        break;
      case 7:
        stringDia = "Lunes";
        break;
    }

    console.log(
      `Description: Fecha: ${matchDate}\nDia: ${stringDia}\nHora: ${horario}\nTorneo: ${competencia}`
    );

    const embed = new MessageEmbed()
      .setTitle(
        `${teams[team].fullname} vs ${teams[otherteam].fullname} ${torneoEmoji}`
      )
      .setDescription(
        `Fecha: ${matchDate}\nDia: ${stringDia}\nHora: ${horario}\nTorneo: ${competencia}`
      );

    let string = `${team}/${otherteam}/${week}/${horario}/${matchDate}/${torneoEmoji}`;
    console.log(`${string} (${string.length})`);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`confirmar/${string}`)
        .setLabel("Confirmar")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId(`rechazar/${string}`)
        .setLabel("Rechazar")
        .setStyle("DANGER")
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
    console.log(`${otherteam} ${teams[otherteam][week].captain}`);
    await interaction.followUp(
      `<@${teams[otherteam][week].captain}> <@${teams[otherteam][week].subcaptain}> deben confirmar el partido con el menu de arriba.`
    );
  },
};
