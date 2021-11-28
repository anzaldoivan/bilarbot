const Discord = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await interaction.deferReply({ ephemeral: false }).catch(() => {});

    try {
      if (command.permission) {
        const authorPerms = interaction.channel.permissionsFor(
          interaction.member
        );
        const userRoles = interaction.member._roles;
        if (!authorPerms || !userRoles.includes(command.permission)) {
          console.log(`Permissions not found`);
          const Error1 = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `Te faltan los siguientes permisos para ejecutar este comando: ${
                client.config.roles[command.permission]
              }`
            );
          return interaction.editReply({ embeds: [Error1] }) /*.then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 6000);
          })*/;
        }
      }
      if (command.channel) {
        console.log(interaction.channelId);
        const interactionChannel = interaction.channelId;
        if (!command.channel.includes(interactionChannel)) {
          console.log(`Channel is incorrect`);
          const Error2 = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`Canal incorrecto para ejecutar este comando.`);
          return interaction.editReply({ embeds: [Error2] });
        }
      }
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "Se rompio todo, llamen a Baba",
        ephemeral: true,
      });
    }
  },
};
