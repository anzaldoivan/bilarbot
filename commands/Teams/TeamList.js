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
    const messages = require(`../../Teams/185191450013597696.json`);

    let stringAmateur = "";
    let stringProfesional = "";

    embed = new Discord.MessageEmbed()
      .setTitle(`Lista de Equipos T8`)
      .setColor("#000000");

    for (var key in messages) {
      if (messages.hasOwnProperty(key)) {
        var val = messages[key];
        if (val.torneo == "amateur") stringAmateur += `${val.fullname}\n`;
        if (val.torneo == "profesional")
          stringProfesional += `${val.fullname}\n`;
      }
    }

    embed.addField("Torneo Profesional", `${stringProfesional}`);

    embed.addField("Torneo Amateur", `${stringAmateur}`);

    interaction.followUp({ embeds: [embed] });
  },
};
