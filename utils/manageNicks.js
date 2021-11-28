const Discord = require("discord.js");
const decache = require("decache");

function manageNicks(client, interaction, user, team, mode) {
  var nickold = interaction.guild.members.cache.get(user.toString()).nickname;
  var nick;
  if (nickold == null) {
    nick = interaction.guild.members.cache.get(user.toString()).user.username;
  } else {
    nick = nickold.split(" ").slice(1).join(" ");
  }
  if (mode == "liberar") {
    interaction.guild.members.cache
      .get(user.toString())
      .setNickname(`[FREE] ${nick}`);
    interaction.guild.members.cache
      .get(user.toString())
      .roles.remove("737114701565263932");
  }
  if (mode == "fichar") {
    interaction.guild.members.cache
      .get(user.toString())
      .setNickname(`[${team}] ${nick}`);
    interaction.guild.members.cache
      .get(user.toString())
      .roles.add("737114701565263932");
  }
  return;
}

exports.manageNicks = manageNicks;
