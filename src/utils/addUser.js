const Discord = require("discord.js");
const fs = require("fs");

async function addUser(interaction, userjson, matchesjson) {
  const fs = require("fs");
  const messages = require(`../Users/185191450013597696.json`);

  //console.log("The lenght of the matches json is: " + matchesjson.length);
  var wins = 0;
  var draws = 0;
  var losses = 0;
  var newELO = 0;
  var countryKey = "Unknown";
  var totalMatches = 0;

  //   if (matchesjson.length === 0) {
  //     interaction.followUp(
  //       "Necesitas jugar por lo menos 10 partidos en #matchmaking-6v6 o #teams-6v6"
  //     );
  //     return;
  //   }

  for (let i = 0; i < matchesjson.length; i++) {
    totalMatches += matchesjson[0].appearances;
  }

  //   if (totalMatches < 10) {
  //     interaction.followUp(
  //       "Necesitas jugar por lo menos 10 partidos en #matchmaking-6v6 o #teams-6v6"
  //     );
  //     console.log(
  //       "USER TRIED TO REGISTER WITH THE FOLLOWING AMOUNT OF APPEARANCES:"
  //     );
  //     console.log(totalMatches);
  //     return;
  //   }

  for (var i = 0; i < matchesjson.length; i++) {
    // console.log("ITERATION NUMBER #" + i);
    // console.log(matchesjson[i]);
    wins += matchesjson[i].wins;
    losses += matchesjson[i].losses;
    draws += matchesjson[i].draws;
  }

  console.log(
    "TOTAL WINS: " + wins + "TOTAL DRAWS: " + draws + "TOTAL LOSSES: " + losses
  );

  newELO = ((wins * 100) / (wins + draws + losses - draws)) * 10;
  //console.log("Total ELO: " + newELO);
  //console.log("Total ELO V2: " + Math.round(newELO));

  if (!userjson) {
    interaction.followUp(
      "Usuario no encontrado.\nRecordar configurarlo utilizando /register ID. La ID se encuentra en http://iosoccer.com/player-list"
    );
  } else {
    if (userjson.discordUserId === interaction.member.user.id) {
      //console.log(userjson.countryId);
      if (userjson.countryId === "59") {
        countryKey = "Argentina";
      }
      if (userjson.countryId === "75") {
        countryKey = "Uruguay";
      }
      if (userjson.countryId === "118") {
        countryKey = "Brasil";
      }

      if (!messages[interaction.member.user.id]) {
        messages[interaction.member.user.id] = {
          user: userjson.id,
          ping: `<@${interaction.member.user.id}>`,
          steam: userjson.steamID,
          ELO: 100,
          ELOGK: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          lastMatch: 0,
          country: countryKey,
        };
        interaction.followUp(
          "Usuario nuevo detectado. Creando base de datos.\nPara verificar la creacion del usuario, utilizar el comando /perfil .\nUsuario creado con exito."
        );
      }

      messages[interaction.member.user.id] = {
        user: userjson.id,
        ping: `<@${interaction.member.user.id}>`,
        steam: userjson.steamID,
        ELO: 100,
        ELOGK: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        lastMatch: 0,
      };

      interaction.followUp(
        `Usuario Configurado. ID de <@${interaction.member.user.id}>: \nPerfil de Steam vinculado al ID: http://steamcommunity.com/profiles/${interaction.member.user.id}`
      );

      fs.writeFileSync(
        `./Users/185191450013597696.json`,
        JSON.stringify(messages),
        (err) => {
          if (err) {
            console.log(err);
            client.channels.cache.get(client.config.mm_channel).send(err);
          }
        }
      );
    } else {
      interaction.followUp(
        "La ID mencionada no coincide con tu usuario de Discord.\nPor favor, enviar una ID que coincida con tu usuario de discord.\nRecorda que tenes que vincular tu cuenta de Discord en https://www.iosoccer.com/edit-profile"
      );
    }
  }
}

exports.addUser = addUser;
