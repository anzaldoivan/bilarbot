const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rcon")
    .setDescription("Mostrar el resultado de Status en el canal")
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription("Elija el servidor donde enviar el comando.")
        .setRequired(true)
        .addChoice("Servidor #1", "27015")
        .addChoice("Servidor #2", "27016")
        .addChoice("Servidor #3", "27017")
        .addChoice("Servidor #4", "27018")
        .addChoice("Servidor de Oficiales #1 (27018)", "27018")
        .addChoice("Servidor de Oficiales #2 (27019)", "27019")
    )
    .addStringOption((option) =>
      option
        .setName("comando")
        .setDescription("Escriba el comando a utilizar (sin rcon adelante).")
        .setRequired(true)
    ),
  permission: ["485322687682445345", "188714975244582913"],
  channel: ["479442064971661312", "457737569954824192", "931392747259191317"],
  async execute(interaction, client) {
    const config = client.config;
    const serverport = interaction.options.getString("servidor");
    const comando = interaction.options.getString("comando");
    var conn = new Rcon(config.serverip, serverport, config.rcon_password);
    let message;
    let comandoSplit = comando.split(" ");
    if (comandoSplit[0].toLowerCase() == "rcon") {
      interaction.followUp(
        "No es necesario escribir rcon antes del comando. Intente nuevamente sin usar rcon."
      );
      return;
    }

    conn
      .on("auth", function () {
        // You must wait until this event is fired before sending any commands,
        // otherwise those commands will fail.
        console.log("Authenticated");
        console.log(`Sending command: ${comando}`);
        conn.send(`${comando}`);
      })
      .on("response", function (str) {
        let response = JSON.stringify(str);
        response = response.split("\\n");
        embed = new Discord.MessageEmbed()
          .setTitle(`Respuesta de consola`)
          .setColor("#000000");
        let resString = "";
        for (let i = 0; i < response.length; i++) {
          resString += `${response[i]}\n`;
        }
        embed.addFields({
          name: `Comando: ${comando}`,
          value: `${response}`,
          inline: true,
        });

        interaction.editReply({ embeds: [embed] });
      })
      .on("error", function (err) {
        console.log("Error: " + err);
        interaction.followUp("Error desconocido. Llamen a Baba");
      })
      .on("end", function () {
        console.log("Connection closed");
        process.exit();
      });

    conn.connect();
    //await interaction.followUp(message);
  },
};
