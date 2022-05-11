const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("singlekeeper")
    .setDescription("Activar SingleKeeper.")
    .addBooleanOption((option) =>
      option
        .setName("estado")
        .setDescription("Activar / Desactivar")
        .setRequired(true)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const boolean = interaction.options.getBoolean("estado");
    let estado;
    if (boolean) {
      estado = "Activado";
    } else {
      estado = "Desactivado";
    }

    if (interaction.channelId == "779460129065009172") {
      client.config.elo.singlekeeper = boolean;
    } else {
      client.config.elo.singlekeeper_nuevos = boolean;
    }

    console.log(client.config.elo.singlekeeper);

    console.log(client.config.elo.singlekeeper);

    fs.writeFileSync(
      `./src/Config/config.json`,
      JSON.stringify(client.config),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    embed = await package.signedList(client.config, interaction);
    interaction.followUp({ embeds: [embed] });
    interaction.followUp(
      `El modo Singlekeeper ha sido ${estado} por <@${interaction.member.user.id}>`
    );
  },
};
