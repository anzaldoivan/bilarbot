const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  teamselectMenu,
  MessageEmbed,
} = require("discord.js");
const { DateTime } = require("luxon");
const fs = require("fs");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const funcDate = require("../../utils/getFecha.js");
const funcTeam = require("../../utils/getTeam.js");
const perms = require("../../utils/Teams/CheckPerms.js");
let config = require(`${appRoot}/Config/config.json`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("postergar")
    .setDescription("Postergar un partido con el equipo seleccionado.")
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
        .setDescription("Elija el Equipo Rival.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/verano2022.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }

      return option;
    }),
  // .addIntegerOption((option) =>
  //   option
  //     .setName("horario")
  //     .setDescription(
  //       "Escriba el horario a jugar. Ejemplo: 2200 o 2230 (22:30hs)"
  //     )
  //     .setRequired(true)
  // )
  channel: ["460972681076932613", "904808330076254238"],
  async execute(interaction, client) {
    const team = interaction.options.getString("myteam");
    const otherteam = interaction.options.getString("team");
    const torneo = client.config.tournament.name;
    decache(`../../Teams/${torneo}.json`);
    const teams = require(`../../Teams/${torneo}.json`);
    const messageAuthor = interaction.member.user.id;
    let week = funcDate.getFecha(
      teams,
      team,
      interaction,
      client.config.tournament.startDate
    );

    // Validation
    if (!isCaptain(interaction, team)) return;

    const embed = new MessageEmbed()
      .setTitle(`${teams[team].fullname} vs ${teams[otherteam].fullname}`)
      .setDescription("Postergar el partido.");

    const row = new MessageActionRow().addComponents(
      new teamselectMenu()
        .setCustomId("postergar")
        .setPlaceholder("Selecciona el menu para postergar el partido.")
        .addOptions([
          {
            //label: `Postergar partido con ${teams[team].fullname}`,
            label: `Postergar partido`,
            description:
              "Postergar el partido. Ignorar el mensaje para no confirmarlo.",
            value: `${teams[otherteam][week].captain}/${teams[otherteam][week].subcaptain}/${team}/${otherteam}/${teams[otherteam][week].director}/${team}/${otherteam}/${week}`,
          },
        ])
    );
    await interaction.editReply({ embeds: [embed], components: [row] });
    //console.log(`${otherteam} ${teams[otherteam][week].captain}`);
    await interaction.followUp(
      `<@${teams[otherteam][week].captain}> <@${teams[otherteam][week].subcaptain}> deben confirmar la postergacion del partido con el menu de arriba.`
    );
  },
};
