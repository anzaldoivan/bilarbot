const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const package = require("../../utils/fetchJson.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fixture")
    .setDescription("Ver fixture para la Copa D1/D2"),
  async execute(interaction) {
    const json = await package.fetchJson(
      "https://stats.iosoccer-sa.bid/api/positions/d1t7"
    );
    const json2 = await package.fetchJson(
      "https://stats.iosoccer-sa.bid/api/positions/d2t7"
    );
    const teamsEmojis = require(`../../Teams/clubemojis.json`);

    embedD1 = new Discord.MessageEmbed()
      .setTitle(`Fixture Copa D1`)
      .setColor("#Ffc700")
      .setThumbnail(`https://stats.iosoccer-sa.bid/tournaments/ligad1.png`)
      .addField(
        `Cuartos de Final`,
        `${json[2]._id} ${teamsEmojis[json[2]._id]} vs ${
          teamsEmojis[json[5]._id]
        } ${json[5]._id}\n${json[3]._id} ${teamsEmojis[json[3]._id]} vs ${
          teamsEmojis[json[4]._id]
        } ${json[4]._id}`
      )
      .addField(
        `Semifinales`,
        `${json[0]._id} ${teamsEmojis[json[0]._id]} vs ${json[2]._id} ${
          teamsEmojis[json[2]._id]
        }\n${json[1]._id} ${teamsEmojis[json[1]._id]} vs ${
          teamsEmojis[json[4]._id]
        } ${json[4]._id}`
      )
      .addField(
        `Final`,
        `A determinar ${teamsEmojis["A determinar"]} vs ${teamsEmojis["A determinar"]} A determinar`
      );

    embedD2 = new Discord.MessageEmbed()
      .setTitle(`Fixture Copa D2`)
      .setColor("#0068ff")
      .setThumbnail(`https://stats.iosoccer-sa.bid/tournaments/ligad2.png`)
      .addField(
        `Cuartos de Final`,
        `${json2[3]._id} ${teamsEmojis[json2[3]._id]} vs ${
          teamsEmojis[json2[4]._id]
        } ${json2[4]._id}`
      )
      .addField(
        `Semifinales`,
        `${json2[1]._id} ${teamsEmojis[json2[1]._id]} vs ${
          teamsEmojis[json2[3]._id]
        } Galactic Boys\n${json2[0]._id} ${teamsEmojis[json2[0]._id]} vs ${
          json2[2]._id
        } ${teamsEmojis[json2[2]._id]}`
      )
      .addField(
        `Final`,
        `${json2[1]._id} ${teamsEmojis[json2[1]._id]} vs ${
          teamsEmojis["A determinar"]
        } A determinar`
      );

    await interaction.followUp({ embeds: [embedD1, embedD2] });
    return;
  },
};
