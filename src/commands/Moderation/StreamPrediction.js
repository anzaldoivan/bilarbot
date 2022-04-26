const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;
const TwitchManager = require(`${appRoot}/utils/TwitchManager.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("streamprediction")
    .setDescription("Crear prediccion en el canal principal de Twitch.")
    .addStringOption((option) =>
      option
        .setName("canal")
        .setDescription("Elija el canal donde enviar el comando.")
        .setRequired(true)
        .addChoice("IOS_SA", "#ios_sa")
        .addChoice("IOS_SA2", "#ios_sa2")
    )
    .addStringOption((option) => {
      option
        .setName("local")
        .setDescription("Elija el Equipo Local.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("visitante")
        .setDescription("Elija el Equipo Visitante.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    }),
  permission: ["188714975244582913", "481215985261740033"],
  channel: ["481214239323979787"],
  async execute(interaction, client) {
    const config = client.config;
    const canal = interaction.options.getString("canal");
    const home = interaction.options.getString("local");
    const away = interaction.options.getString("visitante");
    const title = "";

    let response = await TwitchManager.createPrediction(
      canal,
      title,
      home,
      away
    );
    console.log(response[0]);
    embed = new Discord.MessageEmbed()
      .setTitle(`${response[0].title}`)
      .setColor("#000000")
      .setThumbnail(
        `https://seeklogo.com/images/T/twitch-tv-logo-51C922E0F0-seeklogo.com.png`
      )
      .addField(
        `Resultado 1`,
        `${response[0].outcomes[0].title} (${response[0].outcomes[0].id})`
      )
      .addField(
        `Resultado 1`,
        `${response[0].outcomes[1].title} (${response[0].outcomes[1].id})`
      );
    interaction.followUp({ embeds: [embed] });
  },
};
