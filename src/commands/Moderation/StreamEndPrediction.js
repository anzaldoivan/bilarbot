const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;
const TwitchManager = require(`${appRoot}/utils/TwitchManager.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("streampredictionresult")
    .setDescription("Finalizar prediccion en el canal principal de Twitch.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Escriba la ID de la prediccion de Twitch.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("result")
        .setDescription(
          "Escriba la ID del resultado de la prediccion de Twitch."
        )
        .setRequired(true)
    ),
  permission: ["188714975244582913", "481215985261740033"],
  channel: ["481214239323979787"],
  async execute(interaction, client) {
    const config = client.config;
    const id = interaction.options.getString("id");
    const result = interaction.options.getString("result");
    const title = "";

    let response = await TwitchManager.endPrediction(id, result);
    let ganador, participantes, puntos;
    embed = new Discord.MessageEmbed()
      .setTitle(`${response.data[0].title}`)
      .setColor("#000000")
      .setThumbnail(
        `https://seeklogo.com/images/T/twitch-tv-logo-51C922E0F0-seeklogo.com.png`
      )
      .addField(
        `Resultado`,
        `${response.data[0].outcomes[0].title} vs ${response.data[0].outcomes[1].title}`
      )
      .addField(
        `Usuarios que participaron`,
        `${response.data[0].outcomes[0].users} (${response.data[0].outcomes[0].title}) / ${response.data[0].outcomes[1].users} (${response.data[0].outcomes[1].title})`
      )
      .addField(
        `Puntos a repartir`,
        `${response.data[0].outcomes[0].channel_points} (${response.data[0].outcomes[0].title}) / ${response.data[0].outcomes[1].channel_points} (${response.data[0].outcomes[1].title})`
      );
    interaction.followUp({ embeds: [embed] });
  },
};
