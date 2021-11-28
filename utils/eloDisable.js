const Discord = require("discord.js");
var Rcon = require("./Rcon");

function eloDisable(ip, port, config) {
  var conn = new Rcon(config.serverip, port, config.rcon_password);

  conn
    .on("auth", function () {
      // You must wait until this event is fired before sending any commands,
      // otherwise those commands will fail.
      console.log("Authenticated");
      console.log("Sending command: help");
      conn.send("sv_webserver_matchdata_enabled 0");
      conn.send("sv_webserver_matchdata_url " + `http`);
      conn.send("sv_webserver_matchdata_accesstoken " + ``);
      conn.send("mp_teamnames " + "HOME:IOSSA,AWAY:IOSSA");
      conn.send("sv_password orangutan");
      conn.send("say " + `El Matchmaking ha terminado.`);
    })
    .on("response", function (str) {
      console.log("Response: " + str);
    })
    .on("error", function (err) {
      console.log("Error: " + err);
    })
    .on("end", function () {
      console.log("Connection closed");
      interaction.followUp("Error de Timeout. Intente nuevamente.");
      process.exit();
    });

  conn.connect();
  //   let rcon = Rcon({
  //     address: `${ip}:${port}`,
  //     password: config.rcon_password,
  //   });

  //   rcon
  //     .connect()
  //     .then(() => {
  //       return rcon
  //         .command("sv_webserver_matchdata_enabled 0", 10000)
  //         .then(() => {
  //           console.log("Webserver turned off");
  //         });
  //     })
  //     .then(() => {
  //       return rcon.command("sv_webserver_matchdata_url http", 10000).then(() => {
  //         console.log("Webserver URL deleted");
  //       });
  //     })
  //     .then(() => {
  //       return rcon
  //         .command("say " + "El Matchmaking ha terminado.", 10000)
  //         .then(() => {
  //           console.log("Matchmaking cancelled");
  //         });
  //     })
  //     .then(() => {
  //       return rcon
  //         .command("mp_teamnames " + "HOME:IOSSA,AWAY:IOSSA", 10000)
  //         .then(() => {
  //           console.log("Team Names set");
  //         });
  //     })
  //     /*.then(() => {
  //       return rcon.command("sv_password ''").then(() => {
  //         console.log("Password unset");
  //       });
  //     })*/
  //     .then(() => rcon.disconnect())
  //     .catch((err) => {
  //       console.log("caught", err);
  //       console.log(err.stack);
  //     });
}

exports.eloDisable = eloDisable;
