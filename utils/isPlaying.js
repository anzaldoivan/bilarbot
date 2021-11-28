const Discord = require("discord.js");
const fs = require("fs");
const decache = require("decache");

async function isPlaying(interaction) {
  embed = new Discord.MessageEmbed();
  decache("../elo/matchplayers.json");
  let matchplayers = require(`../elo/matchplayers.json`);

  //console.log("Is playing Check");
  //console.log(matchplayers.includes(interaction.member.user.id));
  if (matchplayers.includes(interaction.member.user.id)) {
    return true;
  } else {
    return false;
  }
}

exports.isPlaying = isPlaying;
