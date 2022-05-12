const { SlashCommandBuilder } = require("@discordjs/builders");
const { DateTime, Interval } = require("luxon");
const funcRCON = require("../../utils/eloSetup.js");
const funcPlaying = require("../../utils/isPlaying.js");
const eloManager = require(`${appRoot}/utils/eloManager.js`);

const fs = require("fs");
const e = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("here")
    .setDescription(
      "Tagee a otras personas para completar la lista de matchmaking."
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    //console.log(before);
    //console.log(`Minutes difference: ${Number(diffMinutes)}`);
    await eloManager.here(interaction, client);
    interaction.deleteReply();
    return;
  },
};
