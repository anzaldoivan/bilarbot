const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Ver lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    embed = await package.signedList(client.config, interaction);
    interaction.followUp({ embeds: [embed] });
  },
};
