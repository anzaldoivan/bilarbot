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
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true)
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Puro Humo", "PH")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("TEST", "TEST")
    )
    .addIntegerOption((option) =>
      option
        .setName("semana")
        .setDescription("Elija la semana del plantel.")
        .setRequired(false)
    ),
  channel: ["866700554293346314"],
  async execute(interaction) {
    const team = interaction.options.getString("team");
    let week = interaction.options.getInteger("semana");
    decache("../../Teams/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    let currentFechaID = funcDate.getFecha(messages, team);

    if (week == null) week = funcDate.getFecha(messages, team);

    if (week > currentFechaID) {
      interaction.followUp("No puedes ver planteles de fechas futuras");
      return;
    }

    funcTeam.getTeam(messages, team, week, interaction);
  },
};
