const { SlashCommandBuilder } = require("@discordjs/builders");
const funcRCON = require("../../utils/eloSetup.js");
const funcPlaying = require("../../utils/isPlaying.js");
const funcDisable = require("../../utils/eloDisable.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cancel")
    .setDescription("Cancelar la partida de Matchmaking ELO.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("Escriba el codigo de partido.")
        .setRequired(true)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const matchID = interaction.options.getInteger("id");
    let playerlist;
    try {
      // a path we KNOW is totally bogus and not a module
      playerlist = require(`../../elo/${matchID}.json`);
    } catch (e) {
      console.log("oh no big error");
      console.log(e);
    }
    let bool = await funcPlaying.isPlaying(interaction);
    console.log(bool);
    if (!bool) {
      interaction.followUp(
        "Solamente los jugadores de la partida pueden cancelarla."
      );
      return;
    }
    if (!playerlist) {
      interaction.followUp("La ID introducida no existe.");
      return;
    }
    interaction.followUp(
      `@here El anterior Matchmaking acaba de ser cancelado por <@${interaction.member.user.id}>`
    );
    funcDisable.eloDisable(
      client.config.serverip,
      playerlist.port,
      client.config
    );
    let matchinfo = [];
    let isPlaying = [];
    fs.writeFileSync(
      `./src/elo/matchinfo.json`,
      JSON.stringify(matchinfo),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );
    fs.writeFileSync(
      `./src/elo/matchplayers.json`,
      JSON.stringify(isPlaying),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );
    return;
  },
};
