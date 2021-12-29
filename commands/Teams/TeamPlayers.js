const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");
const fs = require("fs");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const funcTeam = require("../../utils/getTeam.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plantel")
    .setDescription("Plantel del equipo seleccionado")
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Elija el torneo.")
        .setRequired(true)
        .addChoice("Temporada 8", "T8")
        .addChoice("Copa de Verano", "verano2022")
    )
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true)
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("TEST", "TEST")
        .addChoice("Alien Express", "AX")
        .addChoice("Club Atlético Cualidachi Fútbol Clube", "CACFC")
        .addChoice("Deportivo Campesinos Club", "DCC")
        .addChoice("FENIX FUTBOL CLUB", "FFC")
        .addChoice("Soccer Street FC", "SSFC")
        .addChoice("The Leopardos Club", "TLC")
        .addChoice("Tormalina FC", "TOR")
        .addChoice("We Make Magic", "WMM")
        .addChoice("ZeuzzFC", "ZEUS")
    )
    .addIntegerOption((option) =>
      option
        .setName("semana")
        .setDescription("Elija la semana del plantel.")
        .setRequired(false)
    ),
  channel: ["866700554293346314"],
  async execute(interaction) {
    const torneo = interaction.options.getString("torneo");
    const team = interaction.options.getString("team");
    let week = interaction.options.getInteger("semana");
    decache("../../Teams/185191450013597696.json");
    decache("../../Teams/verano2022.json");
    const equiposT8 = require(`../../Teams/185191450013597696.json`);
    const equiposVerano = require(`../../Teams/verano2022.json`);
    let messages;
    if (torneo == "T8") {
      messages = equiposT8;
      let currentFechaID = funcDate.getFecha(messages, team, interaction);
      if (week == null) week = funcDate.getFecha(messages, team, interaction);
      if (week > currentFechaID) {
        interaction.followUp("No puedes ver planteles de fechas futuras");
        return;
      }
    }
    if (torneo == "verano2022") {
      messages = equiposVerano;
      week = 0;
    }

    funcTeam.getTeam(messages, team, week, interaction);
  },
};
