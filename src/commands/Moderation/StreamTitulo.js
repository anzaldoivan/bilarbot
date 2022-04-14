const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;
const TwitchManager = require(`${appRoot}/utils/TwitchManager.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("streamtitulo")
    .setDescription("Configuracion del titulo de los canales de Twitch.")
    .addStringOption((option) =>
      option
        .setName("canal")
        .setDescription("Elija el canal donde enviar el comando.")
        .setRequired(true)
        .addChoice("IOS_SA", "#ios_sa")
        .addChoice("IOS_SA2", "#ios_sa2")
    )
    .addStringOption(
      (option) =>
        option
          .setName("competencia")
          .setDescription("Elija la competencia a jugar.")
          .setRequired(true)
          .addChoice(`D1 ${torneo.toUpperCase()}`, "D1")
          .addChoice(`D2 ${torneo.toUpperCase()}`, "D2")
          .addChoice(`D3 ${torneo.toUpperCase()}`, "D3")
          //.addChoice("Superliga D1", "sd1")
          .addChoice("Copa Valen", "VALEN")
          .addChoice("Copa Maradei", "MARADEI")
      //.addChoice("Verano Grupo A", "grupoa_verano")
      //.addChoice("Verano Grupo B", "grupob_verano")
      //.addChoice("Verano Grupo C", "grupoc_verano")
    )
    .addStringOption((option) => {
      option
        .setName("local")
        .setDescription("Elija el Equipo Local.")
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
        .setName("visitante")
        .setDescription("Elija el Equipo Visitante.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    }),
  permission: ["188714975244582913", "481215985261740033"],
  channel: ["481214239323979787"],
  async execute(interaction, client) {
    const config = client.config;
    const canal = interaction.options.getString("canal");
    const competencia = interaction.options.getString("competencia");
    const home = interaction.options.getString("local");
    const away = interaction.options.getString("visitante");

    TwitchManager.title(interaction, canal, competencia, home, away);
  },
};
