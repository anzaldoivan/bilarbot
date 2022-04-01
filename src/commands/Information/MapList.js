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
    .setName("mapas")
    .setDescription("Ver lista de Mapas oficiales"),
  async execute(interaction, client) {
    decache(`../../jsons/maps.json`);
    const Maps = require(`../../jsons/maps.json`);

    let stringMaps = "";

    embed = new Discord.MessageEmbed()
      .setTitle(`Lista de Mapas`)
      .setColor("#000000");

    for (var key in Maps) {
      if (Maps.hasOwnProperty(key)) {
        var val = Maps[key];
        if (val.fullname != "TEST") stringMaps += `[${key}](${val}) \n`;
      }
    }

    if (stringMaps == "") stringMaps = "No hay equipos anotados aun.";

    embed.addField("Mapas Oficiales de la comunidad", `${stringMaps}`);

    interaction.followUp({ embeds: [embed] });
  },
};
