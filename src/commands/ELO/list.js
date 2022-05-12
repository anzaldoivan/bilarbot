const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const package = require("../../utils/signedList.js");
const perms = require(`${appRoot}/utils/Teams/CheckPerms.js`);
const eloManager = require(`${appRoot}/utils/eloManager.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Ver lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    await eloManager.list(interaction, client);
    interaction.deleteReply();
    return;
  },
};
