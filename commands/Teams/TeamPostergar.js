const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageActionRow,
  MessageSelectMenu,
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("postergar")
    .setDescription("Postergar un partido con el equipo seleccionado.")
    .addStringOption((option) =>
      option
        .setName("myteam")
        .setDescription("Elija su Equipo.")
        .setRequired(true)
        .addChoice("Academia Shelby", "PEAKY")
        .addChoice("Bravona", "BV")
        .addChoice("Bravona Reserva", "BVR")
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
    ),
  // .addIntegerOption((option) =>
  //   option
  //     .setName("horario")
  //     .setDescription(
  //       "Escriba el horario a jugar. Ejemplo: 2200 o 2230 (22:30hs)"
  //     )
  //     .setRequired(true)
  // )
  channel: ["460972681076932613", "904808330076254238"],
  async execute(interaction) {
    const team = interaction.options.getString("myteam");
    const otherteam = interaction.options.getString("team");
    decache("../../Users/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    const messageAuthor = interaction.member.user.id;
    let week = funcDate.getFecha(messages, team);

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

    const embed = new MessageEmbed()
      .setTitle(`${messages[team].fullname} vs ${messages[otherteam].fullname}`)
      .setDescription("Postergar el partido.");

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("postergar")
        .setPlaceholder("Selecciona el menu para postergar el partido.")
        .addOptions([
          {
            //label: `Postergar partido con ${messages[team].fullname}`,
            label: `Postergar partido`,
            description:
              "Postergar el partido. Ignorar el mensaje para no confirmarlo.",
            value: `${messages[otherteam][week].captain}/${messages[otherteam][week].subcaptain}/${team}/${otherteam}/${messages[otherteam][week].director}/${team}/${otherteam}/${week}`,
          },
        ])
    );
    await interaction.editReply({ embeds: [embed], components: [row] });
    //console.log(`${otherteam} ${messages[otherteam][week].captain}`);
    await interaction.followUp(
      `<@${messages[otherteam][week].captain}> <@${messages[otherteam][week].subcaptain}> deben confirmar la postergacion del partido con el menu de arriba.`
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
