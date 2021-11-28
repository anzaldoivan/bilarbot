const wait = require("util").promisify(setTimeout);
const decache = require("decache");
const fs = require("fs");
const funcMatches = require("../utils/getMatches.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const member = await interaction.guild.members.fetch({
      user: interaction.user.id,
      force: true,
    });
    decache("../Teams/185191450013597696.json");
    decache("../calendar/matches.json");
    const messages = require(`../Teams/185191450013597696.json`);
    const matches = require(`../calendar/matches.json`);
    let team;
    let otherteam;
    let week;
    let matchDate;
    let horario;
    let torneo;
    let perms;

    if (!interaction.isSelectMenu()) return;
    //XBOX ROLE
    console.log(interaction);
    console.log(interaction.values);
    let captainSplit;
    if (interaction.customId == "confirmar") {
      captainSplit = interaction.values[0].split("/");
      await interaction.deferUpdate();
      if (
        member.roles.cache.has("458075157253062657") ||
        member.roles.cache.has("905584692588314675")
      ) {
        console.log(captainSplit[5]);
        team = captainSplit[0];
        otherteam = captainSplit[1];
        week = captainSplit[2];
        matchDate = captainSplit[4];
        horario = captainSplit[3];
        torneo = captainSplit[5];

        console.log(
          `User ${interaction.user.id} tried to confirm match. Expected users: ${messages[otherteam][week].director} ${messages[otherteam][week].captain} ${messages[otherteam][week].subcaptain}`
        );
        perms = false;
        if (interaction.user.id == messages[otherteam][week].director)
          perms = true;
        if (interaction.user.id == messages[otherteam][week].captain)
          perms = true;
        if (interaction.user.id == messages[otherteam][week].subcaptain)
          perms = true;
        if (perms) {
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

          if (messages[team].torneo == "amateur") {
            week = Number(week) + 1;
          }

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

          fs.writeFileSync(
            `./calendar/matches.json`,
            JSON.stringify(matches),
            (err) => {
              if (err) {
                console.log(err);
                client.channels.cache.get(client.config.mm_channel).send(err);
              }
            }
          );

          let matchesEmbed = funcMatches.getMatches(interaction);
          client.channels.cache
            .get("481214239323979787")
            .send({ embeds: [matchesEmbed] });
          client.channels.cache
            .get("479442064971661312")
            .send({ embeds: [matchesEmbed] });

          return interaction.member.send(
            `Confirmado el partido correctamente.`
          );
        } else {
          return interaction.member.send(
            `No puedes confirmar el partido de otros equipos.`
          );
        }
      } else {
        return interaction.member.send(
          `Solo los capitanes pueden confirmar partidos.`
        );
      }
    }
    if (interaction.customId == "postergar") {
      captainSplit = interaction.values[0].split("/");

      await interaction.deferUpdate();
      if (member.roles.cache.has("458075157253062657")) {
        console.log(captainSplit[5]);
        team = captainSplit[5];
        otherteam = captainSplit[6];
        week = captainSplit[7];
        perms = false;
        if (interaction.user.id == captainSplit[4]) perms = true;
        if (interaction.user.id == captainSplit[0]) perms = true;
        if (interaction.user.id == captainSplit[1]) perms = true;
        if (perms) {
          client.channels.cache
            .get("506620871952171028")
            .send(`${captainSplit[2]} vs ${captainSplit[3]} POSTERGADO`);
          messages[team][week].postponement -= 1;
          messages[otherteam][week].postponement -= 1;
          fs.writeFileSync(
            "./Teams/185191450013597696.json",
            JSON.stringify(messages),
            (err) => {
              if (err) {
                console.log(err);
                interaction.followUp(err);
              }
            }
          );
          return interaction.member.send(
            `Postergado el partido correctamente.`
          );
        } else {
          return interaction.member.send(
            `No puedes postergar el partido de otros equipos.`
          );
        }
      } else {
        return interaction.member.send(
          `Solo los capitanes pueden confirmar partidos.`
        );
      }
    }
  },
};
