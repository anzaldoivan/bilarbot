const Discord = require("discord.js");
const fs = require("fs");
const { DateTime, Interval } = require("luxon");
let users = require(`${appRoot}/Users/185191450013597696.json`);
let CheckPerms = require(`${appRoot}/utils/Teams/CheckPerms.js`);
let TeamManager = require(`${appRoot}/utils/Teams/TeamManager.js`);
const Database = require(`${appRoot}/Database/GetFromDB.js`);
const BigNumber = require("bignumber.js");

var counter = 0;
var counterCurrentTournament = 0;
var counterPlayingUnregistered = 0;
var counterVeteran = 0;
var counterNew = 0;

function getSteam(steamID64) {
  const id = new BigNumber(steamID64);
  let idFormula = new BigNumber(76561197960265728);
  let test = (id.minus(idFormula) - id.modulo(2)) / 2;
  let steam = `STEAM_0:${id.modulo(2)}:${test + 1}`;
  return steam;
}

function updateUsers(interaction, newFile) {
  fs.writeFileSync(
    `./src/Users/185191450013597696.json`,
    JSON.stringify(newFile),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );
}

async function addRole(client, serverid, roleid, userid) {
  const guild = client.guilds.cache.get(serverid); // copy the id of the server your bot is in and paste it in place of guild-ID.
  const role = guild.roles.cache.get(roleid); // here we are getting the role object using the id of that role.
  const member = await guild.members.fetch(userid); // here we are getting the member object using the id of that member. This is the member we will add the role to.
  await member.roles.add(role); // here we just added the role to the member we got.
}

async function removeRole(client, serverid, roleid, userid) {
  const guild = client.guilds.cache.get(serverid); // copy the id of the server your bot is in and paste it in place of guild-ID.
  const role = guild.roles.cache.get(roleid); // here we are getting the role object using the id of that role.
  const member = await guild.members.fetch(userid); // here we are getting the member object using the id of that member. This is the member we will add the role to.
  await member.roles.remove(role); // here we just added the role to the member we got.
}

async function checkVeteran(client, user, stats) {
  if (stats[0].matches >= 35) {
    counterVeteran++;
    await addRole(
      client,
      "185191450013597696",
      client.config.roles.veterano,
      user
    );
    users[user].veteran = true;
  } else {
    users[user].veteran = false;
  }
  updateUsers(interaction, users);
}

async function checkNewbie(client, user, stats) {
  if (stats[0].matches <= 6) {
    counterNew++;
    await addRole(
      client,
      "185191450013597696",
      client.config.roles.nuevo,
      user
    );
    users[user].newbie = true;
  } else {
    await removeRole(
      client,
      "185191450013597696",
      client.config.roles.nuevo,
      user
    );
    users[user].newbie = false;
  }
  updateUsers(interaction, users);
}

function setPerms(json) {
  console.log(json);
}

async function setRoles(interaction, client) {
  const list = client.guilds.cache.get("185191450013597696");
  const members = list.members.cache;
  const teams = require(`${appRoot}/Teams/${client.config.tournament.name}.json`);

  for (const member of members) {
    let bool = true;
    let user = member[0];
    //console.log(member[0]);
    if (users[user]) {
      counter++;
      bool = CheckPerms.checkOtherTeamsPlayers(
        interaction,
        teams,
        0,
        user,
        false
      );
    }

    // Tag members with no teams
    // if (bool)
    //   await TeamManager.manageNicks(client, interaction, user, "", "liberar");

    if (users[user] && !bool) {
      counterCurrentTournament++;

      if (users[user].steam.length != 17) {
        //console.log(users[user]);
        counterPlayingUnregistered++;
      }
    }

    if (users[user] && users[user].steam.length == 17) {
      let steamID = getSteam(users[user].steam);
      let stats = await Database.getPlayerFromID(steamID, "all");
      //console.log(Object.keys(stats).length);
      if (Object.keys(stats).length != 0) {
        if (user == 188874252882149376) {
          console.log(getSteam(users[user].steam));
          console.log(users[user].steam);
          console.log(users[user].nick);
          console.log(stats);
        }
        await checkVeteran(client, user, stats);
        await checkNewbie(client, user, stats);
      }
    }
  }

  console.log(
    `Registered users (playing in T9): ${counter} (${counterCurrentTournament}) / Not Playing: ${
      counter - counterCurrentTournament
    }`
  );
  console.log(`Veterans: ${counterVeteran} / New players: ${counterNew}`);
  console.log(
    `Unregistered users playing in T9: ${counterPlayingUnregistered}`
  );
}

module.exports = { setRoles, getSteam };
