const Discord = require("discord.js");
const unsign = require("./unsign.js");
//let Rcon = require("srcds-rcon");
var Rcon = require("./Rcon");
const fs = require("fs");

function getPlayers(interaction, config, serverport, matchID) {
  var conn = new Rcon(config.serverip, serverport, config.rcon_password);

  conn
    .on("auth", function () {
      // You must wait until this event is fired before sending any commands,
      // otherwise those commands will fail.
      //console.log("Authenticated");
      //console.log("Sending command: help");
      conn.send("status");
    })
    .on("response", function (str) {
      //console.log("Response: " + str);

      let response = JSON.stringify(str);
      //console.log(response);
      response = response.split("\\n");
      let players = response[5];
      config.players = players;

      fs.writeFileSync(
        `./src/Config/config.json`,
        JSON.stringify(config),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
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

  //   let rcon = Rcon({
  //     address: `${config.serverip}:${serverport}`,
  //     password: config.rcon_password,
  //   });

  //   let bool;

  //   rcon
  //     .connect()
  //     .then(() =>
  //       rcon.command("status", 10000).then((status) => {
  //         console.log(`got status ${status}`);
  //         arrayOfLines = status.match(/[^\r\n]+/g);
  //         playersSplit = arrayOfLines[5].split(" ");
  //         interaction.followUp(`Jugadores: ${playersSplit[2]}`);
  //         config.players = Number(playersSplit[2]);
  //         fs.writeFileSync(
  //           `./Config/config.json`,
  //           JSON.stringify(config),
  //           (err) => {
  //             if (err) {
  //               console.log(err);
  //             }
  //           }
  //         );
  //       })
  //     )
  //     .then(() => {
  //       rcon.disconnect();
  //     })
  //     .catch((err) => {
  //       console.log("caught", err);
  //       console.log(err.stack);
  //       interaction.followUp(err);
  //     });
}

exports.getPlayers = getPlayers;
