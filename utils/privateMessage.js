const Discord = require("discord.js");
const decache = require("decache");

function privateMessage(client) {
  embed = new Discord.MessageEmbed();
  let privmessage = `:soccer: Ha comenzado el Matchmaking! Debes conectarte al servidor utilizando ' connect ${client.config.serverip}:${client.config.eloPort};password orangutan ' en consola durante los proximos 10 minutos!`;
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
