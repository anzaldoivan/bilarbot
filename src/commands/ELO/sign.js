const { SlashCommandBuilder } = require("@discordjs/builders");
const package = require("../../utils/signedList.js");
const isSigned = require("../../utils/isSigned.js");
const isPlaying = require("../../utils/isPlaying.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);

const fs = require("fs");
const e = require("express");

async function findRoom(interaction, duoID, duoRooms, client) {
  for (var fieldIndex = 0; fieldIndex < duoRooms.length; fieldIndex++) {
    var field = duoRooms[fieldIndex];
    if (field.duoID === duoID) {
      //console.log("Sala con esta misma ID encontrada!");
      if (field.players.length >= 2) {
        client.users.cache
          .get(interaction.member.user.id)
          .send(
            "No puedes unirte a la sala de DuoQ debido a que hay 2 jugadores con esta ID. Te has unido a la lista de espera de manera individual."
          )
          .catch((error) => {
            console.log(`User ${interaction.member.user.id} has blocked DM`);
          });
        return true;
      } else {
        field.players.push(interaction.member.user.id);
        client.users.cache
          .get(interaction.member.user.id)
          .send("Te has unido a la sala #" + duoID)
          .catch((error) => {
            console.log(`User ${interaction.member.user.id} has blocked DM`);
          });
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Unirse a la lista de espera de Matchmaking ELO.")
    .addStringOption((option) =>
      option
        .setName("pos")
        .setDescription("Elija la posicion en la que desea jugar.")
        .setRequired(true)
        .addChoice("Arquero", "gk")
        .addChoice("Defensor", "defensores")
        .addChoice("Mediocampista", "cm")
        .addChoice("Delantero", "delanteros")
    )
    .addIntegerOption((option) =>
      option
        .setName("duo")
        .setDescription("Escriba la ID de la sala DUO")
        .setRequired(false)
    ),
  channel: ["779460129065009172", "898701693741596692"],
  async execute(interaction, client) {
    const position = interaction.options.getString("pos");
    const duoID = interaction.options.getInteger("duo");
    const messagesDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
    const messages = messagesDB[0];
    let pos = require(`../../elo/${position}.json`);
    let pos_nuevos = require(`../../elo/${position}_nuevos.json`);
    let duoRooms = require(`../../elo/duo.json`);
    //console.log(duoID);
    //console.log(duoRooms);

    if (!messages[interaction.member.user.id]) {
      messages[interaction.member.user.id] = {
        user: interaction.member.user.id,
        nick: interaction.guild.members.cache.get(interaction.member.user.id)
          .displayName,
        ping: `<@${interaction.member.user.id}>`,
        steam: "Sin registrar",
        ELO: 0,
        ELOGK: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        lastMatch: 0,
        country: "Sin definir",
      };
    }

    let bool = await isPlaying.isPlaying(interaction);
    if (bool) {
      client.users.cache
        .get(interaction.member.user.id)
        .send("No puedes unirte a la lista si te encuentras en una partida.")
        .catch((error) => {
          console.log(`User ${interaction.member.user.id} has blocked DM`);
        });
      interaction.deleteReply();
      return;
    }

    if (isSigned.isSigned(`<@${interaction.member.user.id}>`, interaction)) {
      client.users.cache
        .get(interaction.member.user.id)
        .send("Ya te encuentras en la lista de Matchmaking.")
        .catch((error) => {
          console.log(`User ${interaction.member.user.id} has blocked DM`);
        });
      interaction.deleteReply();
      return;
    }

    let found = false;
    if (duoID) {
      var myObj = {
        duoID: duoID,
        players: [interaction.member.user.id],
      };
      if (duoRooms.length != 0) {
        found = await findRoom(interaction, duoID, duoRooms, client);
      }
      //console.log("WAS FOUND? " + found);
      if (!found) {
        duoRooms.push(myObj);
        client.users.cache
          .get(interaction.member.user.id)
          .send(`Sala #${duoID} creada con exito.`)
          .catch((error) => {
            console.log(`User ${interaction.member.user.id} has blocked DM`);
          });
      }
      //console.log("Found is: " + found);
    }

    if (interaction.channelId == "779460129065009172") {
      pos.push(`<@${interaction.member.user.id}>`);
    } else {
      pos_nuevos.push(`<@${interaction.member.user.id}>`);
    }

    client.users.cache
      .get(interaction.member.user.id)
      .send("Te has unido a la lista de espera")
      .catch((error) => {
        console.log(`User ${interaction.member.user.id} has blocked DM`);
      });
    fs.writeFileSync(
      `./src/elo/${position}.json`,
      JSON.stringify(pos),
      (err) => {
        if (err) {
          console.log(err);
          interaction.followUp(err);
        }
      }
    );
    fs.writeFileSync(`./src/elo/duo.json`, JSON.stringify(duoRooms), (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    });
    await GetFromDB.updateDb("bilarbot", "users", messages);
    //console.log(pos);
    embed = await package.signedList(client.config, interaction);
    client.channels.cache
      .get(client.config.mm_channel)
      .send({ embeds: [embed] });
    interaction.deleteReply();
  },
};
