const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("nashe").setDescription("NASHE"),
  async execute(interaction) {
    const event = await interaction.guild.scheduledEvents.fetch(
      933447712282673192
    );
    console.log(event);
    await interaction.followUp("https://tenor.com/view/nashe-gif-22431258");
  },
};
