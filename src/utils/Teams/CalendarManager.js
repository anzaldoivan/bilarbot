const Discord = require("discord.js");
const fs = require("fs");
const decache = require("decache");
const funcTeam = require("../getTeam.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const funcMatches = require("../getMatches.js");

function updateFile(interaction, file, newFile) {
  fs.writeFileSync(
    `./src/calendar/${file}.json`,
    JSON.stringify(newFile),
    (err) => {
      if (err) {
        console.log(err);
        interaction.followUp(err);
      }
    }
  );
}

async function syncMatches() {
  let matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
  let matches = matchesDB[0];

  fs.writeFileSync(
    `./src/calendar/matches.json`,
    JSON.stringify(matches),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

async function rejectMatch(
  interaction,
  client,
  messages,
  team,
  otherteam,
  week,
  matchDate,
  horario,
  torneo
) {
  let string = `El partido entre ${messages[team].emoji} ${messages[team].fullname} vs ${messages[otherteam].fullname} ${messages[otherteam].emoji} el dia ${matchDate} a las ${horario}hs por la ${torneo} ha sido rechazado`;
  client.users.cache
    .get(messages[team][week].captain)
    .send(`${string}`)
    .catch((error) => {
      console.log(`User  has blocked DM`);
    });
  client.users.cache
    .get(messages[otherteam][week].captain)
    .send(`${string}`)
    .catch((error) => {
      console.log(`User  has blocked DM`);
    });
  interaction.followUp(`${string}`);
  return interaction.deleteReply();
}

async function confirmMatch(
  interaction,
  client,
  messages,
  team,
  otherteam,
  week,
  matchDate,
  horario,
  torneo
) {
  let matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
  let matches = matchesDB[0];

  client.channels.cache
    .get("506620871952171028")
    .send(
      `${messages[team].emoji} ${messages[team].fullname} vs ${messages[otherteam].fullname} ${messages[otherteam].emoji} confirmado el dia ${matchDate} a las ${horario}hs por la ${torneo}`
    );
  client.users.cache
    .get(messages[team][week].captain)
    .send(
      `${messages[team].emoji} ${messages[team].fullname} vs ${messages[otherteam].fullname} ${messages[otherteam].emoji} confirmado el dia ${matchDate} a las ${horario}hs por la ${torneo}`
    )
    .catch((error) => {
      console.log(`User  has blocked DM`);
    });
  client.users.cache
    .get(messages[otherteam][week].captain)
    .send(
      `${messages[team].emoji} ${messages[team].fullname} vs ${messages[otherteam].fullname} ${messages[otherteam].emoji} confirmado el dia ${matchDate} a las ${horario}hs por la ${torneo}`
    )
    .catch((error) => {
      console.log(`User  has blocked DM`);
    });

  interaction.deleteReply();

  if (!matches[week]) {
    console.log("creando fecha que no existe");
    matches[week] = {};
  }

  if (!matches[week][matchDate]) {
    console.log("creando fecha que no existe");
    matches[week][matchDate] = {};
  }

  if (matches[week][matchDate]) {
    for (let i = 0; i < 100; i++) {
      if (!matches[week][matchDate][i]) {
        matches[week][matchDate][i] = {
          home: team,
          away: otherteam,
          day: matchDate,
          hour: horario,
          tournament: torneo,
          arbitro: "",
          streamer: "",
        };
        break;
      }
    }
  } else {
    matches[week][matchDate][0] = {
      home: team,
      away: otherteam,
      day: matchDate,
      hour: horario,
      tournament: torneo,
      arbitro: "",
      streamer: "",
    };
  }

  await GetFromDB.updateDb("bilarbot", "matches", matches);
  updateFile(interaction, "matches", matches);

  let matchesEmbed = await funcMatches.getMatches(
    interaction,
    client.config.tournament.startDate
  );
  client.channels.cache
    .get("481214239323979787")
    .send({ embeds: [matchesEmbed] });
  client.channels.cache
    .get("931392747259191317")
    .send({ embeds: [matchesEmbed] });

  return interaction.member
    .send(`Confirmado el partido correctamente.`)
    .catch((error) => {
      console.log(`User has blocked DM`);
    });
}

module.exports = { confirmMatch, syncMatches, rejectMatch };
