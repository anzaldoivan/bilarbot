const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");
const fs = require("fs");
const decache = require("decache");
const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const GetFromDB = require("../../Database/GetFromDB.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("equipos")
    .setDescription("Ver lista de Equipos para la T8"),
  async execute(interaction, client) {
    const torneo = client.config.tournament.name;

    let stringTeams = "";

    teams = await GetFromDB.getEverythingFrom(
      "bilarbot",
      client.config.tournament.name
    );

    let teamArr = await GetFromDB.getTeamStatsFromID("Musashi FC", "t0");

    if (!teamArr) console.log("No existe");

    embed = new Discord.MessageEmbed()
      .setTitle(`Lista de Equipos T9`)
      .setColor("#000000");

    teams = teams[0];
    console.log(teams);
    let testArray;
    for (var key in teams) {
      if (teams.hasOwnProperty(key)) {
        var val = teams[key];
        console.log(val);
        console.log(key);
        if (val[0]) console.log(val[0].fullname);
        if (key != "_id" && val.fullname != "TEST")
          stringTeams += `${val.fullname}\n`;
      }
    }
    //GetFromDB.updateDb("bilarbot", "verano2022", testArray);
    //console.log(await GetFromDB.getTeam("bilarbot", "verano2022", "UDE"));

    if (stringTeams == "") stringTeams = "No hay equipos anotados aun.";

    embed.addField(`Torneo ${torneo.toUpperCase()}`, `${stringTeams}`);

    interaction.followUp({ embeds: [embed] });
  },
};
