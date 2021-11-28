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
