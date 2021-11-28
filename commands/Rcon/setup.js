const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exec")
    .setDescription("Ejecutar Exec en un servidor de Oficial.")
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription("Elija el servidor donde enviar el comando.")
        .setRequired(true)
        .addChoice("Servidor #4", "27018")
        .addChoice("Servidor #5", "27019")
    )
    .addStringOption((option) =>
      option
        .setName("conf")
        .setDescription("Elija el exec a ejecutar.")
        .setRequired(true)
        .addChoice("Superliga D1", "sd1")
        .addChoice("Copa Valen (Ida)", "ida")
        .addChoice("Copa Valen (Vuelta)", "vuelta")
    ),
  permission: "485322687682445345",
  channel: ["479442064971661312", "457737569954824192"],
  async execute(interaction, client) {
    const config = client.config;
    const serverport = interaction.options.getString("servidor");
    const conf = interaction.options.getString("conf");
    var conn = new Rcon(config.serverip, serverport, config.rcon_password);
    let message;

    conn
      .on("auth", function () {
        // You must wait until this event is fired before sending any commands,
        // otherwise those commands will fail.
        console.log("Authenticated");
        console.log("Sending command: exec");
        conn.send(`exec ${conf}`);
      })
      .on("response", function (str) {
        let response = JSON.stringify(str);
        interaction.followUp(`Exec ${conf} ejecutado con exito.`);
      })
      .on("error", function (err) {
        console.log("Error: " + err);
        interaction.followUp("Error desconocido. Llamen a Baba");
      })
      .on("end", function () {
        console.log("Connection closed");
        interaction.followUp("Error de Timeout. Intente nuevamente.");
        process.exit();
      });

    conn.connect();
    //return;
    //await interaction.followUp(message);
  },
};
