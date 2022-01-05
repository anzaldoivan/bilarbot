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
const funcDate = require("../../utils/getDate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("equipos")
    .setDescription("Ver lista de Equipos para la T8"),
  async execute(interaction, client) {
    const torneo = client.config.tournament.name;
    decache(`../../Teams/${torneo}.json`);
    const teams = require(`../../Teams/${torneo}.json`);

    let stringTeams = "";

    embed = new Discord.MessageEmbed()
      .setTitle(`Lista de Equipos T8`)
      .setColor("#000000");

    for (var key in teams) {
      if (teams.hasOwnProperty(key)) {
        var val = teams[key];
        if (val.fullname != "TEST") stringTeams += `${val.fullname}\n`;
      }
    }

    if (stringTeams == "") stringTeams = "No hay equipos anotados aun.";

    embed.addField("Torneo Verano 2022", `${stringTeams}`);

    interaction.followUp({ embeds: [embed] });
  },
};
