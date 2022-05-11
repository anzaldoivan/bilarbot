const { match } = require("assert");
const Discord = require("discord.js");
//let Rcon = require("srcds-rcon");
var Rcon = require("./Rcon");

async function eloSetup(config, serverport, matchID, interaction) {
  // This minimal example connects and runs the "help" command.

  var conn = new Rcon(config.serverip, serverport, config.rcon_password);

  conn
    .on("auth", function () {
      // You must wait until this event is fired before sending any commands,
      // otherwise those commands will fail.
      console.log("Authenticated");
      console.log("Sending command: help");
      conn.send("sv_webserver_matchdata_enabled 1");
      conn.send(
        "sv_webserver_matchdata_url " + `${config.botip}:5000/api/postuploadios`
      );
      conn.send(
        "sv_webserver_matchdata_accesstoken " + `${config.elo.token}:${matchID}`
      );
      conn.send("mp_teamnames " + "HOME:Equipo 1,AWAY:Equipo 2");
      conn.send("sv_password elomatch");
      conn.send(
        "say " + `El Matchmaking acaba de ser configurado con la ID ${matchID}.`
      );
    })
    .on("response", function (str) {
      console.log("Response: " + str);
    })
    .on("error", function (err) {
      console.log("Error: " + err);
      interaction.followUp("Error de Timeout. Intente nuevamente.");
    })
    .on("end", function () {
      console.log("Connection closed");
      process.exit();
    });

  conn.connect();
}

exports.eloSetup = eloSetup;

// connect() will return immediately.
//
// If you try to send a command here, it will fail since the connection isn't
// authenticated yet. Wait for the 'auth' event.
// let rcon = Rcon({
//   address: `${config.serverip}:${serverport}`,
//   password: config.rcon_password,
// });

// let singleKeeper = 0;
// if (config.elo.singlekeeper) {
//   singleKeeper = 1;
// }

// rcon
//   .connect()
//   .then(() => {
//     return rcon
//       .command("sv_webserver_matchdata_enabled 1", 20000)
//       .then(() => {
//         console.log("Webserver turned on");
//       });
//   })
//   .then(() => {
//     return rcon
//       .command(
//         "sv_webserver_matchdata_url " +
//           `${config.botip}:5000/api/postuploadios`,
//         20000
//       )
//       .then(() => {
//         console.log("Webserver URL set");
//       });
//   })
//   .then(() => {
//     return rcon
//       .command(
//         "sv_webserver_matchdata_accesstoken " +
//           `${config.elo.token}:${matchID}`,
//         20000
//       )
//       .then(() => {
//         console.log("ELO Token SET");
//       });
//   })
//   .then(() => {
//     return rcon
//       .command("mp_teamnames " + "HOME:Equipo 1,AWAY:Equipo 2", 20000)
//       .then(() => {
//         console.log("Team Names set");
//       });
//   })
//   .then(() => {
//     return rcon.command(`mp_maxplayers 6`, 20000).then(() => {
//       console.log("Team Maxplayers set");
//     });
//   })
//   .then(() => {
//     return rcon.command(`sv_singlekeeper ${singleKeeper}`, 20000).then(() => {
//       console.log(`Singlekeeper set ${singleKeeper}`);
//     });
//   })
//   .then(() => {
//     return rcon.command("sv_password elomatch", 20000).then(() => {
//       console.log("Password set");
//     });
//   })
//   .then(() => {
//     return rcon
//       .command(
//         "say " +
//           `El Matchmaking acaba de ser configurado con la ID ${matchID}.`,
//         20000
//       )
//       .then(() => {
//         console.log("Server setup correctly");
//       });
//   })
//   .then(() => rcon.disconnect())
//   .catch((err) => {
//     console.log("caught", err);
//     console.log(err.stack);
//     interaction.followUp("Error de Timeout. Intente nuevamente.");
//   });
