const wait = require("util").promisify(setTimeout);
const decache = require("decache");
const fs = require("fs");
const perms = require("../utils/Teams/CheckPerms.js");
const GetFromDB = require(`${appRoot}/Database/GetFromDB.js`);
const CalendarManager = require("../utils/Teams/CalendarManager.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const member = await interaction.guild.members.fetch({
      user: interaction.user.id,
      force: true,
    });
    decache("../Teams/185191450013597696.json");
    const matchesDB = await GetFromDB.getEverythingFrom("bilarbot", "matches");
    const matches = matchesDB[0];
    const tournament = client.config.tournament.name;

    const teamsDB = await GetFromDB.getEverythingFrom("bilarbot", tournament);
    const messages = teamsDB[0];
    let team;
    let otherteam;
    let week;
    let matchDate;
    let horario;
    let torneo;

    // Verify Interaction Type
    if (!interaction.isSelectMenu() && !interaction.isButton()) return;
    let captainSplit = interaction.customId.split("/");

    // Confirm Logic
    if (captainSplit[0] == "confirmar") {
      await interaction.deferUpdate();
      if (
        member.roles.cache.has("458075157253062657") ||
        member.roles.cache.has("905584692588314675")
      ) {
        team = captainSplit[1];
        otherteam = captainSplit[2];
        week = captainSplit[3];
        horario = captainSplit[4];
        matchDate = captainSplit[5];
        torneo = captainSplit[6];

        if (!perms.isCaptain(interaction, messages[otherteam], week))
          return interaction.member
            .send(`Solo los capitanes pueden confirmar partidos.`)
            .catch((error) => {
              console.log(`User ${newPresence.user.id} has blocked DM`);
            });

        if (
          !perms.checkConfirmedMatches(
            interaction,
            matches[week],
            matchDate,
            horario
          )
        )
          return interaction.deleteReply();

        CalendarManager.confirmMatch(
          interaction,
          client,
          messages,
          team,
          otherteam,
          week,
          matchDate,
          horario,
          torneo
        );
      }
    }

    if (captainSplit[0] == "rechazar") {
      await interaction.deferUpdate();
      if (
        member.roles.cache.has("458075157253062657") ||
        member.roles.cache.has("905584692588314675")
      ) {
        team = captainSplit[1];
        otherteam = captainSplit[2];
        week = captainSplit[3];
        horario = captainSplit[4];
        matchDate = captainSplit[5];
        torneo = captainSplit[6];

        if (!perms.isCaptain(interaction, messages[otherteam], week))
          return interaction.member
            .send(
              `Solo los capitanes de ${otherteam} pueden rechazar este partido.`
            )
            .catch((error) => {
              console.log(`User ${newPresence.user.id} has blocked DM`);
            });

        CalendarManager.rejectMatch(
          interaction,
          client,
          messages,
          team,
          otherteam,
          week,
          matchDate,
          horario,
          torneo
        );
      }
    }

    if (interaction.customId == "postergar") {
      captainSplit = interaction.values[0].split("/");

      await interaction.deferUpdate();
      if (
        member.roles.cache.has("458075157253062657") ||
        member.roles.cache.has("905584692588314675")
      ) {
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
          interaction.deleteReply();
          return interaction.member
            .send(`Postergado el partido correctamente.`)
            .catch((error) => {
              console.log(`User ${newPresence.user.id} has blocked DM`);
            });
        } else {
          return interaction.member
            .send(`No puedes postergar el partido de otros equipos.`)
            .catch((error) => {
              console.log(`User ${newPresence.user.id} has blocked DM`);
            });
        }
      } else {
        return interaction.member
          .send(`Solo los capitanes pueden confirmar partidos.`)
          .catch((error) => {
            console.log(`User ${newPresence.user.id} has blocked DM`);
          });
      }
    }
  },
};
