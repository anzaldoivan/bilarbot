const Discord = require("discord.js");
const fs = require("fs");
const { DateTime, Interval } = require("luxon");
let users = require(`${appRoot}/Users/185191450013597696.json`);
let CheckPerms = require(`${appRoot}/utils/Teams/CheckPerms.js`);
const Database = require(`${appRoot}/Database/GetFromDB.js`);
const BigNumber = require("bignumber.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

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

async function updateUsers(interaction, newFile) {
  try {
    await GetFromDB.updateDb("bilarbot", "users", newFile);
  } catch (err) {
    console.log(err);
    interaction.followUp(err);
  }
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

async function checkVeteran(interaction, client, user, users, stats) {
  console.log(users[user]);
  console.log(users);
  console.log(user);
  if (stats.matches >= 35) {
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
  await updateUsers(interaction, users);
}

async function checkNewbie(interaction, client, user, users, stats) {
  if (stats.matches <= 6) {
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
  await updateUsers(interaction, users);
}

async function setDivision(interaction, client, user, users, division) {
  if (!users[user].division) {
    users[user].division = division;
  }
  if (users[user].division == "D3") {
    users[user].division = division;
  }
  await updateUsers(interaction, users);
}

function setPerms(json) {
  console.log(json);
}

async function updateUser(interaction, client, user, division) {
  if (!interaction.guild.members.cache.get(user.toString())) return;
  const usersDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
  const users = await usersDB[0];
  let steamID = getSteam(users[user].steam);
  let statsDB = await Database.getPlayerFromID(steamID, "all");
  let stats = statsDB[0];
  console.log(stats);
  if (Object.keys(statsDB).length != 0) {
    if (user == 188874252882149376) {
      console.log(getSteam(users[user].steam));
      console.log(users[user].steam);
      console.log(users[user].nick);
      console.log(stats);
    }
    await checkVeteran(interaction, client, user, users, stats);
    await checkNewbie(interaction, client, user, users, stats);
  }
  await setDivision(interaction, client, user, users, division);
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
        await checkVeteran(interaction, client, user, users, stats);
        await checkNewbie(interaction, client, user, users, stats);
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

module.exports = { setRoles, getSteam, updateUser };
