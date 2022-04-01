const { SlashCommandBuilder } = require("@discordjs/builders");
const { DateTime, Interval } = require("luxon");
const funcRCON = require("../../utils/eloSetup.js");
const funcPlaying = require("../../utils/isPlaying.js");

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
    const before = DateTime.fromISO(client.config.elo.here);
    const now = DateTime.now();
    const diff = Interval.fromDateTimes(before, now);
    const diffMinutes = Math.abs(diff.length("minutes"));
    //console.log(before);
    //console.log(`Minutes difference: ${Number(diffMinutes)}`);
    if (diffMinutes >= 10) {
      //console.log(client.config.elo.here);
      client.config.elo.here = DateTime.now();
      fs.writeFileSync(
        `./Config/config.json`,
        JSON.stringify(client.config),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      client.channels.cache.get(client.config.mm_channel).send("@here");
      interaction.deleteReply();
      return;
    }
    interaction.followUp(
      "El comando /here solo se puede usar en intervalos de 10 minutos"
    );
    return;
  },
};
