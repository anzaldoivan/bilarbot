const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nicolai")
    .setDescription("¿Quien es Nicolai?"),
  async execute(interaction) {
    console.log(interaction);
    await interaction.followUp("Nicolai? El mejor del ios 😎");
  },
};
