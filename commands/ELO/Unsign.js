const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const unsign = require("../../utils/unsign.js");
const isSigned = require("../../utils/isSigned.js");
const fs = require("fs");
const e = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unsign")
    .setDescription("Abandonar la lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    if (isSigned.isSigned(`<@${interaction.member.user.id}>`, interaction)) {
      unsign.unsign(`<@${interaction.member.user.id}>`, client, "MANUAL");
      embed = await package.signedList(client.config, interaction);
      client.channels.cache
        .get(client.config.mm_channel)
        .send({ embeds: [embed] });
      interaction.deleteReply();
    } else {
      client.users.cache
        .get(interaction.member.user.id)
        .send("No te encuentras en la lista de Matchmaking.")
        .catch((error) => {
          console.log(`User ${interaction.member.user.id} has blocked DM`);
        });
      interaction.deleteReply();
      return;
    }
  },
};
