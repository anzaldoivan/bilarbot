const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aumentarliberaciones")
    .setDescription(
      "Aumentar liberaciones de un equipo. Comando solo disponible para presidentes del Tribunal."
    )
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
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
    ),
  permission: "686350086422396983",
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    decache("../../Teams/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    let week = funcDate.getFecha(messages, team);
    const messageAuthor = interaction.member.user.id;

    messages[team.toUpperCase()][week].releases += 1;

    fs.writeFileSync(
      "./Teams/185191450013597696.json",
      JSON.stringify(messages),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );

    client.channels.cache
      .get("902547421962334219")
      .send(
        `El representante del Tribunal de Disciplina <@${messageAuthor}> ha aumentado las liberaciones de ${
          messages[team.toUpperCase()].fullname
        }`
      );
  },
};
