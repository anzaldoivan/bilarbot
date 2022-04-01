const Discord = require("discord.js");
const decache = require("decache");

function signedList(config, interaction) {
  embed = new Discord.MessageEmbed();
  //console.log(config.elo.maxplayers);
  const maxDefensores = config.elo.maxplayers - 2;
  const maxCM = config.elo.maxplayers - 4;
  const maxDelanteros = config.elo.maxplayers - 2;
  let gk;
  let delanteros;
  let cm;
  let defensores;

  if (interaction.channelId == "779460129065009172") {
    decache("../elo/gk.json");
    decache("../elo/defensores.json");
    decache("../elo/cm.json");
    decache("../elo/delanteros.json");
    gk = require(`../elo/gk.json`);
    defensores = require(`../elo/defensores.json`);
    cm = require(`../elo/cm.json`);
    delanteros = require(`../elo/delanteros.json`);
  } else {
    decache("../elo/gk_nuevos.json");
    decache("../elo/defensores_nuevos.json");
    decache("../elo/cm_nuevos.json");
    decache("../elo/delanteros_nuevos.json");
    gk = require(`../elo/gk_nuevos.json`);
    defensores = require(`../elo/defensores_nuevos.json`);
    cm = require(`../elo/cm_nuevos.json`);
    delanteros = require(`../elo/delanteros_nuevos.json`);
  }

  if (config.elo.singlekeeper == true) {
    embed.addField(
      `Lista de Jugadores ${config.elo.maxplayers}v${config.elo.maxplayers}`,
      `Arqueros [${gk.length}/1]\nDefensores [${defensores.length}/${maxDefensores}]\nCM [${cm.length}/${maxCM}]\nDelanteros [${delanteros.length}/${maxDelanteros}]\n`
    );
  } else {
    embed.addField(
      `Lista de Jugadores ${config.elo.maxplayers}v${config.elo.maxplayers}`,
      `Arqueros [${gk.length}/2]\nDefensores [${defensores.length}/${maxDefensores}]\nCM [${cm.length}/${maxCM}]\nDelanteros [${delanteros.length}/${maxDelanteros}]\n`
    );
  }
  //console.log(embed);
  return embed;
}

exports.signedList = signedList;
