const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
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
    ),
  permission: "485322687682445345",
  channel: ["479442064971661312", "457737569954824192"],
  async execute(interaction, client) {
    const config = client.config;
    const serverport = interaction.options.getString("servidor");
    var conn = new Rcon(config.serverip, serverport, config.rcon_password);
    let message;

    conn
      .on("auth", function () {
        // You must wait until this event is fired before sending any commands,
        // otherwise those commands will fail.
        console.log("Authenticated");
        console.log("Sending command: status");
        conn.send("status");
      })
      .on("response", function (str) {
        let response = JSON.stringify(str);
        response = response.split("\\n");
        // response = response
        //   .replace(/[\"]/g, '\\"')
        //   .replace(/[\\]/g, "\\\\")
        //   .replace(/[\/]/g, "\\/")
        //   .replace(/[\b]/g, "\\b")
        //   .replace(/[\f]/g, "\\f")
        //   .replace(/[\n]/g, "\\n")
        //   .replace(/[\r]/g, "\\r")
        //   .replace(/[\t]/g, "\\t");
        console.log(response);
        embed = new Discord.MessageEmbed()
          .setTitle(`Comandos de Arbitraje`)
          .setColor("#000000")
          .setThumbnail(
            `https://ichef.bbci.co.uk/news/640/cpsprodpb/173CF/production/_102538159_gettyimages-999459128.jpg`
          )
          .addField(`Nombre del Servidor`, `${response[0]}`)
          .addField(`IP`, `${response[2]}`)
          .addField(`Mapa`, `${response[3]}`)
          .addField(`Jugadores`, `${response[5]}`);
        let counter = 1;
        for (let i = 8; i < response.length; i++) {
          embed.addField(`Datos de Jugador N° ${counter}`, `${response[i]}`);
          counter++;
        }
        interaction.editReply({ embeds: [embed] });
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
    //await interaction.followUp(message);
  },
};
