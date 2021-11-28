const { SlashCommandBuilder } = require("@discordjs/builders");
const fetchTop = require("../../utils/fetchTop.js");
const decache = require("decache");
const Discord = require("discord.js");
const package = require("../../utils/signedList.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Ver leaderboard de jugadores de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    decache("../../Users/185191450013597696.json");
    const messages = require(`../../Users/185191450013597696.json`);
    let arr = fetchTop.fetchTop(
      messages,
      interaction.member.user.id,
      "leaderboard"
    );

    console.log(arr);

    embed = new Discord.MessageEmbed()
      .setTitle("Leaderboard de Matchmaking ELO")
      .setColor("#B9F2FF")
      .addField(`Top 1`, `${arr[0].ping}`)
      .addField(`Top 2`, `${arr[1].ping}`)
      .addField(`Top 3`, `${arr[2].ping}`)
      .addField(`Top 4`, `${arr[3].ping}`)
      .addField(`Top 5`, `${arr[4].ping}`)
      .addField(`Top 6`, `${arr[5].ping}`)
      .addField(`Top 7`, `${arr[6].ping}`)
      .addField(`Top 8`, `${arr[7].ping}`)
      .addField(`Top 9`, `${arr[8].ping}`)
      .addField(`Top 10`, `${arr[9].ping}`);

    await interaction.followUp({ embeds: [embed] });
  },
};
