const Discord = require("discord.js");
const fs = require("fs");
const decache = require("decache");

function unsign(user, client, mode) {
  embed = new Discord.MessageEmbed();

  const gk = require(`../elo/gk.json`);
  const defensores = require(`../elo/defensores.json`);
  const cm = require(`../elo/cm.json`);
  const delanteros = require(`../elo/delanteros.json`);
  decache(`../elo/duo.json`);
  const duoRooms = require(`../elo/duo.json`);

  let arr;
  let pos;

  if (gk.includes(user)) {
    arr = gk;
    pos = "gk";
  }
  if (defensores.includes(user)) {
    arr = defensores;
    pos = "defensores";
  }
  if (cm.includes(user)) {
    arr = cm;
    pos = "cm";
  }
  if (delanteros.includes(user)) {
    arr = delanteros;
    pos = "delanteros";
  }

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === user) {
      if (mode == "MANUAL")
        client.users.cache
          .get(user.replace(/[^0-9\.]+/g, ""))
          .send("Has abandonado la lista de espera")
          .catch((error) => {
            console.log(`User ${user} has blocked DM`);
          });
      arr.splice(i, 1);
    }
  }

  console.log(user.replace(/[^0-9\.]+/g, ""));
  duoRooms.forEach((element) => {
    console.log(element.players);
    if (element.players.includes(user.replace(/[^0-9\.]+/g, ""))) {
      console.log("Encontrado en otra sala!");
      if (mode == "MANUAL")
        client.users.cache
          .get(element.players[0])
          .send("La sala en la que estabas ha sido destruida.")
          .catch((error) => {
            console.log(`User ${element.players[0]} has blocked DM`);
          });
      try {
        if (mode == "MANUAL")
          client.users.cache
            .get(element.players[1])
            .send("La sala en la que estabas ha sido destruida.")
            .catch((error) => {
              console.log(`User ${element.players[1]} has blocked DM`);
            });
        duoRooms.splice(duoRooms.indexOf(element), 1);
      } catch {
        console.log("Second user did not exist");
      }
    }
  });

  fs.writeFileSync(`./elo/${pos}.json`, JSON.stringify(arr), (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFileSync(`./elo/duo.json`, JSON.stringify(duoRooms), (err) => {
    if (err) {
      console.log(err);
    }
  });

  return;
}

exports.unsign = unsign;
