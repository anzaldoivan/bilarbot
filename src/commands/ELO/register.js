const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/addUser.js");
const unsign = require("../../utils/unsign.js");
const isSigned = require("../../utils/isSigned.js");
const fs = require("fs");
const e = require("express");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchUser(id) {
  try {
    const response = await fetch(
      `https://iosoccer.com:44380/api/player/${id}`,
      {
        method: "GET",
        credentials: "same-origin",
      }
    );
    const userDB = await response.json();
    return userDB;
  } catch (error) {
    console.error(error);
  }
}

async function fetchMatches(id) {
  try {
    const response = await fetch(
      `https://iosoccer.com:44380/api/player-statistics/performance/continuous/${id}`,
      {
        method: "GET",
        credentials: "same-origin",
      }
    );
    const matchesjson = await response.json();
    return matchesjson;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registrarse en Matchmaking ELO.")
    .addIntegerOption((option) =>
      option.setName("id").setDescription("Escriba su ID").setRequired(true)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const messages = require(`../../Users/185191450013597696.json`);
    const id = interaction.options.getInteger("id");
    //console.log(interaction.member);
    if (messages[interaction.member.user.id]) {
      client.users.cache
        .get(interaction.member.user.id)
        .send("Ya tienes una cuenta registrada en Matchmaking ELO");
      interaction.deleteReply();
      return;
    }

    const userDB = await fetchUser(id);
    const matchesjson = await fetchMatches(id);
    //console.log("RENDER USER CONSOLE LOG");
    //console.log(userDB);
    //console.log(matchesjson);
    await package.addUser(interaction, userDB, matchesjson);
  },
};
