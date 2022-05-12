const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Ver lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    embed = await package.signedList(client.config, interaction);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`sign/gk`)
        .setLabel("GK")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId(`sign/defensores`)
        .setLabel("DEFENSOR")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId(`sign/cm`)
        .setLabel("MEDIOCAMPO")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId(`sign/delanteros`)
        .setLabel("DELANTERO")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId(`unsign`)
        .setLabel("UNSIGN")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId(`here`)
        .setLabel("UNSIGN")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId(`ready`)
        .setLabel("READY")
        .setStyle("SUCCESS")
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};
