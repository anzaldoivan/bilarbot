const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const funcDate = require("../../utils/getDate.js");
const funcMatches = require("../../utils/getMatches.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asignar")
    .setDescription("Asignar arbitros / streamers")
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
        .setName("partido")
        .setDescription("Escriba el numero del partido")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("rol")
        .setDescription("Selecciona al usuario que deseas asignar.")
        .setRequired(true)
        .addChoice("Arbitro", "arbitro")
        .addChoice("Streamer", "streamer")
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription(
          "Selecciona al usuario que deseas asignar. Seleccione a BilarBOT para desasignar gente."
        )
    ),
  channel: ["479442064971661312", "481214239323979787"],
  async execute(interaction) {
    const role = interaction.options.getString("rol");
    const dia = interaction.options.getString("dia");
    let user = interaction.options.getUser("usuario");
    if (user) user = user.toString().replace(/[^0-9\.]+/g, "");
    const partido = interaction.options.getInteger("partido") - 1;
    decache("../../calendar/matches.json");
    const matches = require(`../../calendar/matches.json`);
    const messageAuthor = interaction.member.user.id;
    let asignatedUser = messageAuthor;

    let currentFechaID = funcDate.getDate("2021-10-26");
    currentFechaID++;
    let matchDate = DateTime.local(2021, 10, 25)
      .plus({ weeks: currentFechaID - 1 })
      .plus({ days: dia });
    matchDate = matchDate.toISODate();

    let date = DateTime.local(2021, 10, 25).plus({ weeks: currentFechaID });
    date = date.toISODate();

    if (!matches[currentFechaID]) {
      interaction.followUp("No hay partidos confirmados para esta fecha.");
      return;
    }

    //console.log("TEST BUG FECHA");
    //console.log(currentFechaID);
    //console.log(matchDate);
    //console.log(partido);
    if (!matches[currentFechaID][matchDate][partido]) {
      interaction.followUp("El partido seleccionado no existe.");
      return;
    }

    if (user) asignatedUser = user;
    if (asignatedUser == "779492937176186881") {
      asignatedUser = "";
      if (role == "arbitro") {
        interaction.followUp(
          `Se ha quitado al usuario <@${matches[currentFechaID][matchDate][partido].arbitro}> de su partido asignado.`
        );
      } else {
        interaction.followUp(
          `Se ha quitado al usuario <@${matches[currentFechaID][matchDate][partido].streamer}> de su partido asignado.`
        );
      }
    }

    if (role == "arbitro") {
      matches[currentFechaID][matchDate][partido].arbitro = asignatedUser;
    } else {
      matches[currentFechaID][matchDate][partido].streamer = asignatedUser;
    }

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

    embed = funcMatches.getMatches(interaction);
    interaction.followUp({ embeds: [embed] });
  },
};
