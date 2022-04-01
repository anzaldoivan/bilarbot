const Discord = require("discord.js");
const decache = require("decache");

function privateMessage(client, serverport, matchID) {
  embed = new Discord.MessageEmbed();
  let privmessage = `:soccer: Ha comenzado el Matchmaking #${matchID}! Debes conectarte al servidor utilizando el siguiente enlace: steam://connect/${client.config.serverip}:${serverport}/elomatch`;
  decache("../elo/matchplayers.json");
  const matchplayers = require(`../elo/matchplayers.json`);
  matchplayers.forEach((element) => {
    client.users.cache
      .get(element)
      .send(privmessage)
      .catch((error) => {
        console.log(`User ${element} has blocked DM`);
      });
  });
}

exports.privateMessage = privateMessage;
