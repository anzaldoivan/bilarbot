const { SlashCommandBuilder } = require("@discordjs/builders");
var Rcon = require("../../utils/Rcon.js");
const Discord = require("discord.js");
let config = require(`${appRoot}/Config/config.json`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const torneo = config.tournament.name;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("execmanual")
    .setDescription("Configuracion de un servidor de Oficial (IP Custom).")
    .addStringOption((option) =>
      option
        .setName("servidor")
        .setDescription(
          "Escriba el servidor donde enviar el comando (Ej: 200.30.1.3:27018)."
        )
        .setRequired(true)
    )
    .addStringOption(
      (option) =>
        option
          .setName("conf")
          .setDescription("Elija el exec a ejecutar.")
          .setRequired(true)
          .addChoice(`D1 ${torneo.toUpperCase()}`, "d1")
          .addChoice(`D2 ${torneo.toUpperCase()}`, "d2")
          .addChoice(`D3 ${torneo.toUpperCase()}`, "d3")
          //.addChoice("Superliga D1", "sd1")
          .addChoice("Copa Valen (Ida)", "ida")
          .addChoice("Copa Valen (Vuelta)", "vuelta")
      //.addChoice("Verano Grupo A", "grupoa_verano")
      //.addChoice("Verano Grupo B", "grupob_verano")
      //.addChoice("Verano Grupo C", "grupoc_verano")
    )
    .addStringOption((option) => {
      option
        .setName("local")
        .setDescription("Elija el Equipo Local.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("visitante")
        .setDescription("Elija el Equipo Visitante.")
        .setRequired(true);
      const teamsOptions = require(`../../Teams/${torneo}.json`);
      for (var key in teamsOptions) {
        if (teamsOptions.hasOwnProperty(key)) {
          var val = teamsOptions[key];
          option.addChoice(val.fullname, key);
        }
      }
      return option;
    }),
  permission: ["485322687682445345"],
  channel: ["931392747259191317", "457737569954824192"],
  async execute(interaction, client) {
    const config = client.config;
    let serverport = interaction.options.getString("servidor");
    const server = serverport.split(":");
    const conf = interaction.options.getString("conf");
    const team = interaction.options.getString("local");
    const otherteam = interaction.options.getString("visitante");
    var conn = new Rcon(server[0], server[1], config.rcon_password);
    let message;
    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", torneo);
    const teams = teamsDB[0];

    conn
      .on("auth", function () {
        // You must wait until this event is fired before sending any commands,
        // otherwise those commands will fail.
        console.log("Authenticated");
        console.log("Sending command: exec");
        conn.send(`exec ${conf}`);
        conn.send(
          `mp_teamnames "${team}:${teams[team].fullname},${otherteam}:${teams[otherteam].fullname}"`
        );
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
