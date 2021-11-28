const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const funcPlayers = require("../../utils/getPlayers.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("servers")
    .setDescription("Ver cantidad de jugadores en un servidor especifico")
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription("Elija el servidor donde enviar el comando.")
        .setRequired(true)
        .addChoice("Servidor #3", "27017")
        .addChoice("Servidor #4", "27018")
        .addChoice("Servidor #5", "27019")
    ),
  async execute(interaction, client) {
    const serverport = interaction.options.getString("servidor");
    let players;
    let bool = await funcPlayers.getPlayers(
      interaction,
      client.config,
      serverport
    );
    players = client.config.players;
    players = players.split(" ");
    console.log(players);
    console.log(players[2]);
    await interaction.followUp(`Jugadores en el servidor: ${players[2]}`);
  },
};
