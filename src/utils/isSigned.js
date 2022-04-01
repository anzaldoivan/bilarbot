const Discord = require("discord.js");
const decache = require("decache");

function isSigned(user, interaction) {
  embed = new Discord.MessageEmbed();
  decache("../elo/gk.json");
  decache("../elo/defensores.json");
  decache("../elo/cm.json");
  decache("../elo/delanteros.json");
  decache("../elo/gk_nuevos.json");
  decache("../elo/defensores_nuevos.json");
  decache("../elo/cm_nuevos.json");
  decache("../elo/delanteros_nuevos.json");
  const gk = require(`../elo/gk.json`);
  const defensores = require(`../elo/defensores.json`);
  const cm = require(`../elo/cm.json`);
  const delanteros = require(`../elo/delanteros.json`);
  const gk_nuevos = require(`../elo/gk_nuevos.json`);
  const defensores_nuevos = require(`../elo/defensores_nuevos.json`);
  const cm_nuevos = require(`../elo/cm_nuevos.json`);
  const delanteros_nuevos = require(`../elo/delanteros_nuevos.json`);

  //console.log(user);
  //console.log(gk);

  if (gk.includes(user)) {
    return true;
  }
  if (defensores.includes(user)) {
    return true;
  }
  if (cm.includes(user)) {
    return true;
  }
  if (delanteros.includes(user)) {
    return true;
  }

  if (gk_nuevos.includes(user)) {
    return true;
  }
  if (defensores_nuevos.includes(user)) {
    return true;
  }
  if (cm_nuevos.includes(user)) {
    return true;
  }
  if (delanteros_nuevos.includes(user)) {
    return true;
  }

  return false;
}

exports.isSigned = isSigned;
