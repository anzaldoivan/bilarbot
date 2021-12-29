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
  async execute(interaction) {
    decache("../../Teams/185191450013597696.json");
    decache("../../Teams/verano2022.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    const teamsverano = require(`../../Teams/verano2022.json`);

    let stringAmateur = "";
    let stringProfesional = "";
    let stringVerano = "";

    embed = new Discord.MessageEmbed()
      .setTitle(`Lista de Equipos T8`)
      .setColor("#000000");

    for (var key in messages) {
      if (messages.hasOwnProperty(key)) {
        var val = messages[key];
        if (val.torneo == "amateur" && val.fullname != "TEST")
          stringAmateur += `${val.fullname}\n`;
        if (val.torneo == "profesional" && val.fullname != "TEST")
          stringProfesional += `${val.fullname}\n`;
      }
    }

    for (var key in teamsverano) {
      if (teamsverano.hasOwnProperty(key)) {
        var val = teamsverano[key];
        if (val.fullname != "TEST") stringVerano += `${val.fullname}\n`;
      }
    }

    embed.addField("Torneo Profesional", `${stringProfesional}`);

    embed.addField("Torneo Amateur", `${stringAmateur}`);

    embed.addField("Torneo Verano 2022", `${stringVerano}`);

    interaction.followUp({ embeds: [embed] });
  },
};
