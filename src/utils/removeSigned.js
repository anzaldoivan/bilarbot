const Discord = require("discord.js");
const unsign = require("./unsign.js");
const fs = require("fs");

function removeSigned(client) {
  //test
  fs.readFile("./src/elo/matchplayers.json", (err, data) => {
    if (err) throw err;
    console.log("Cleaning Signed List");

    let matchplayers = JSON.parse(data);
    matchplayers.forEach((element) => unsign.unsign(`<@${element}>`));
    console.log(matchplayers);
  });
}

exports.removeSigned = removeSigned;
