const { SlashCommandBuilder } = require("@discordjs/builders");
let RoleManager = require(`${appRoot}/utils/Teams/RoleManager.js`);
const TwitchManager = require(`${appRoot}/utils/TwitchManager.js`);

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  permission: ["188714975244582913"],
  async execute(interaction, client) {
    // const event = await interaction.guild.scheduledEvents.fetch(
    //   933447712282673192
    // );
    // console.log(event);
    //await RoleManager.setRoles(interaction, client);
    TwitchManager.ping("#ios_sa");
    TwitchManager.ping("#ios_sa2");
    await interaction.followUp("Pong!");
  },
};
