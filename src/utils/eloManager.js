const package = require(`${appRoot}/utils/signedList.js`);
const isSigned = require(`${appRoot}/utils/isSigned.js`);
const isPlaying = require(`${appRoot}/utils/isPlaying.js`);
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const fs = require("fs");
const unsignFunc = require(`${appRoot}/utils/unsign.js`);
const { DateTime, Interval } = require("luxon");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

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

async function sign(interaction, client, position, duoID) {
  let pos = require(`../elo/${position}.json`);
  let duoRooms = require(`../elo/duo.json`);
  const messagesDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
  const messages = messagesDB[0];
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
    try {
      interaction.deleteReply();
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  if (isSigned.isSigned(`<@${interaction.member.user.id}>`, interaction)) {
    client.users.cache
      .get(interaction.member.user.id)
      .send("Ya te encuentras en la lista de Matchmaking.")
      .catch((error) => {
        console.log(`User ${interaction.member.user.id} has blocked DM`);
      });
    return false;
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
  }

  client.users.cache
    .get(interaction.member.user.id)
    .send("Te has unido a la lista de espera")
    .catch((error) => {
      console.log(`User ${interaction.member.user.id} has blocked DM`);
    });
  fs.writeFileSync(`./src/elo/${position}.json`, JSON.stringify(pos), (err) => {
    if (err) {
      console.log(err);
      interaction.followUp(err);
    }
  });
  fs.writeFileSync(`./src/elo/duo.json`, JSON.stringify(duoRooms), (err) => {
    if (err) {
      console.log(err);
      interaction.followUp(err);
    }
  });
  await GetFromDB.updateDb("bilarbot", "users", messages);
  //console.log(pos);
  await this.list(interaction, client);
  return true;
}

async function unsign(interaction, client) {
  if (isSigned.isSigned(`<@${interaction.member.user.id}>`, interaction)) {
    unsignFunc.unsign(`<@${interaction.member.user.id}>`, client, "MANUAL");
    await this.list(interaction, client);
    return true;
  } else {
    client.users.cache
      .get(interaction.member.user.id)
      .send("No te encuentras en la lista de Matchmaking.")
      .catch((error) => {
        console.log(`User ${interaction.member.user.id} has blocked DM`);
      });
    return false;
  }
}

async function here(interaction, client) {
  const before = DateTime.fromISO(client.config.elo.here);
  const now = DateTime.now();
  const diff = Interval.fromDateTimes(before, now);
  const diffMinutes = Math.abs(diff.length("minutes"));
  if (diffMinutes >= 10) {
    //console.log(client.config.elo.here);
    client.config.elo.here = DateTime.now();
    fs.writeFileSync(
      `./src/Config/config.json`,
      JSON.stringify(client.config),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    client.channels.cache.get(client.config.mm_channel).send("@here");
    return;
  }
  client.users.cache
    .get(interaction.member.user.id)
    .send("El comando /here solo se puede usar en intervalos de 10 minutos")
    .catch((error) => {
      console.log(`User ${interaction.member.user.id} has blocked DM`);
    });
}

async function list(interaction, client) {
  const embed = new MessageEmbed().setImage(
    "https://media.discordapp.net/attachments/455510792469479446/754851516971745362/brr.jpg"
  );
  const signedList = await package.signedList(client.config, interaction);
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`unsign`)
      .setLabel("UNSIGN")
      .setStyle("DANGER"),
    new MessageButton()
      .setCustomId(`here`)
      .setLabel("🔔")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(`ready`)
      .setLabel("READY")
      .setStyle("SUCCESS")
  );
  const row2 = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`sign/gk`)
      .setLabel("GK")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`sign/defensores`)
      .setLabel("DEFENSOR")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`sign/cm`)
      .setLabel("MEDIOCAMPO")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`sign/delanteros`)
      .setLabel("DELANTERO")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(`unsign`)
      .setLabel("UNSIGN")
      .setStyle("DANGER")
  );

  //await interaction.editReply({ embeds: [embed], components: [row2] });
  //await interaction.followUp({ embeds: [signedList], components: [row] });

  client.channels.cache
    .get(client.config.mm_channel)
    .send({ embeds: [embed], components: [row2] });
  client.channels.cache
    .get(client.config.mm_channel)
    .send({ embeds: [signedList], components: [row] });
}

module.exports = {
  sign,
  unsign,
  here,
  list,
};
