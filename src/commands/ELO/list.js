const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const package = require("../../utils/signedList.js");
const perms = require(`${appRoot}/utils/Teams/CheckPerms.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Ver lista de espera de Matchmaking ELO."),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const embed = new MessageEmbed().setImage(
      "https://media.discordapp.net/attachments/455510792469479446/754851516971745362/brr.jpg"
    );
    const signedList = await package.signedList(client.config, interaction);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`unsign`)
        .setLabel("UNSIGN")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId(`here`)
        .setLabel("🔔")
        .setStyle("SECONDARY"),
      new MessageButton()
        .setCustomId(`ready`)
        .setLabel("READY")
        .setStyle("SUCCESS")
    );
    const row2 = new MessageActionRow().addComponents(
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
        .setStyle("DANGER")
    );

    await interaction.editReply({ embeds: [embed], components: [row2] });
    await interaction.followUp({ embeds: [signedList], components: [row] });
  },
};
