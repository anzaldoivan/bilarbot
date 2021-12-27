const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const funcDate = require("../../utils/getFecha.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fichar")
    .setDescription("Fichar jugador para un equipo.")
    .addStringOption((option) =>
      option
        .setName("team")
        .setDescription("Elija el Equipo.")
        .setRequired(true)
        .addChoice("Club Atletico Soccerjam", "CAS")
        .addChoice("Lobos FC", "LFC")
        .addChoice("Meteors Gaming", "MG")
        .addChoice("Puro Humo", "PH")
        .addChoice("Union Deportivo Empate", "UDE")
        .addChoice("Union Deportivo Empate Reserva", "UDER")
        .addChoice("TEST", "TEST")
    )
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario que deseas liberar.")
        .setRequired(true)
    ),
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const team = interaction.options.getString("team");
    let user = interaction.options
      .getUser("usuario")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    decache("../../Users/185191450013597696.json");
    const messages = require(`../../Teams/185191450013597696.json`);
    let week = funcDate.getFecha(messages, team);
    const messageAuthor = interaction.member.user.id;
    const member = await interaction.guild.members.fetch({
      user: user,
      force: true,
    });
    //console.log(member);

    let maxPlayersAmount = 9;

    if (
      messages[team.toUpperCase()].reserva != 0 &&
      messages[team.toUpperCase()].torneo == "profesional"
    )
      messages[team.toUpperCase()][week].newplayerscount = 0;
    if (messages[team.toUpperCase()][week].newplayerscount != 0)
      maxPlayersAmount = 10;

    var directorID = Number(messages[team.toUpperCase()][week].director);
    var captainID = Number(messages[team.toUpperCase()][week].captain);
    var subcaptainID = Number(messages[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == directorID) perms = true;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;

    if (!perms) {
      interaction.followUp(
        `Usted no posee permisos para fichar jugadores en ${
          messages[team.toUpperCase()].fullname
        }.`
      );
      return;
    }

    if (messages[team.toUpperCase()][week].playerscount >= maxPlayersAmount) {
      interaction.followUp(
        "Usted no puede fichar mas jugadores para este equipo."
      );
      return;
    }

    if (messages[team.toUpperCase()].torneo == "amateur") {
      if (!member.roles.cache.has("604102329524027392")) {
        interaction.followUp(
          "Solamente puedes fichar jugadores con el rol de Nuevo para el Torneo Amateur."
        );
        return;
      }
    }

    // if (messages[team.toUpperCase()][week].transfers <= 0) {
    //   interaction.followUp("No tienes fichajes disponibles esta semana.");
    //   return;
    // }

    let tempWeek;
    for (var key in messages) {
      if (messages.hasOwnProperty(key)) {
        tempWeek = week;
        //if (messages[team.toUpperCase()].torneo == "amateur") tempWeek++;
        if (
          messages[key].torneo == "amateur" &&
          messages[team.toUpperCase()].torneo == "profesional"
        )
          tempWeek--;
        //console.log(key);
        if (messages[key][tempWeek].players.includes(user)) {
          interaction.followUp(
            `El jugador <@${user}> ya pertenece a otro equipo.`
          );
          return;
        }
      }
    }

    //console.log(user);

    if (member.roles.cache.has("604102329524027392")) {
      //console.log(`Yay, the author of the message has the role!`);

      if (
        messages[team.toUpperCase()][week].playerscount == 9 &&
        messages[team.toUpperCase()].reserva != 0
      ) {
        interaction.followUp(
          `No puedes fichar un jugador como cupo de nuevo si tienes un equipo de reserva.`
        );
        return;
      }

      if (messages[team.toUpperCase()][week].newplayerscount == 0) {
        messages[team.toUpperCase()][week].newplayer = user;
        messages[team.toUpperCase()][week].newplayerscount = 1;
      }
    }
    // messages[team.toUpperCase()][week].transfers -= 1;
    messages[team.toUpperCase()][week].playerscount += 1;
    messages[team.toUpperCase()][week].players.push(user);

    manageNicks.manageNicks(client, interaction, user, team, "fichar");

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

    funcTeam.getTeam(messages, team, week, interaction);
    client.channels.cache
      .get("902547421962334219")
      .send(
        `El jugador <@${user}> ha sido fichado por ${
          messages[team.toUpperCase()].fullname
        }`
      );
  },
};

/*

const Discord = require("discord.js");
const { Console } = require("console");
const { DateTime } = require("luxon");

module.exports = {
  name: "Team Transfer",
  aliases: ["none"],
  description: "Transfer players to Team from JSON",

  execute(message) {
    const fs = require("fs");
    const messages = require(`../Teams/${message.guild.id}.json`);
    const currentFechaID = Math.round(
      DateTime.now().diff(DateTime.local(2021, 7, 5), "weeks").weeks
    );
    let maxPlayersAmount;

    var messageAuthor = Number(message.author.id);

    let arr = message.content.split(/[ ,]+/);
    let week = "week1";
    let user;
    if (!messages[team.toUpperCase()]) {
      interaction.followUp("Equipo no encontrado.");
      return;
    }
    var captainID = Number(messages[team.toUpperCase()][week].captain);
    var subcaptainID = Number(messages[team.toUpperCase()][week].subcaptain);
    let perms = false;
    if (messageAuthor == captainID) perms = true;
    if (messageAuthor == subcaptainID) perms = true;
    if (!perms) {
      interaction.followUp(
        "Usted no posee permisos para fichar jugadores en este equipo."
      );
      return;
    }
    if (arr[2]) {
      user = arr[2].replace(/[^0-9\.]+/g, "");
    } else {
      interaction.followUp("Mencione al jugador que desea fichar.");
      return;
    }
    if (messages[team.toUpperCase()][week].transfers <= 0) {
      interaction.followUp("No tienes fichajes disponibles esta semana.");
      return;
    }
    console.log("The player ID sent on $fichar is: " + arr[2]);

    const user = message.mentions.members.first();
    const role = message.guild.roles.cache.find((r) => r.name === "Nuevo");
    if (!user) {
      interaction.followUp(
        "Debes mencionar correctamente al jugador que deseas fichar."
      );
      return;
    }

    for (var key in messages) {
      if (messages.hasOwnProperty(key)) {
        if (messages[key][week].players.includes(user)) {
          interaction.followUp("El jugador ya pertenece a otro equipo.");
          return;
        }
      }
    }

    messages[team.toUpperCase()][week].players.push(user);
    console.log(user);

    console.log(user._roles);
    if (user.roles.cache.has("604102329524027392")) {
      console.log(`Yay, the author of the message has the role!`);
      if (messages[team.toUpperCase()][week].newplayerscount == 0) {
        messages[team.toUpperCase()][week].newplayer = user;
        messages[team.toUpperCase()][week].newplayerscount = 1;
      }
    }
    messages[team.toUpperCase()][week].transfers -= 1;

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

    let playerstring = "";
    if (!messages[team.toUpperCase()][week]) {
      interaction.followUp("Semana de equipo encontrada.");
      return;
    }
    console.log(messages[team.toUpperCase()][week].players);
    console.log(week);
    for (var key in messages[team.toUpperCase()][week].players) {
      if (messages[team.toUpperCase()][week].players.hasOwnProperty(key)) {
        playerstring += `<@${
          messages[team.toUpperCase()][week].players[key]
        }>\n`;
      }
    }
    const playersAmount = Object.keys(
      messages[team.toUpperCase()][week].players
    ).length;
    if (messages[team.toUpperCase()][week].newplayerscount) {
      maxPlayersAmount = 10;
    } else {
      maxPlayersAmount = 9;
    }
    embed = new Discord.MessageEmbed()
      .setTitle(`Perfil de Equipo`)
      .setColor("red")
      .setThumbnail(
        `https://stats.iosoccer-sa.bid/clubs/${team.toLowerCase()}.png`
      )
      .addField(
        `Nombre del Equipo`,
        `${messages[team.toUpperCase()].fullname}`
      )
      .addField(`Fecha`, `Fecha ${currentFechaID + 1}`)
      .addField(
        `Capitan / Subcapitan`,
        `<@${messages[team.toUpperCase()][week].captain}> / <@${
          messages[team.toUpperCase()][week].subcaptain
        }>`
      )
      .addField(
        `Fichajes disponibles (Emergencia)`,
        `${messages[team.toUpperCase()][week].transfers} (${
          messages[team.toUpperCase()][week].emergency
        })`
      )
      .addField(
        `Liberaciones disponibles`,
        `${messages[team.toUpperCase()][week].releases}`
      )
      .addField(
        `Postergaciones disponibles`,
        `${messages[team.toUpperCase()][week].postponement}`
      )
      .addField(
        `Plantel (${playersAmount}/${maxPlayersAmount})`,
        `${playerstring}`
      );
    if (messages[team.toUpperCase()][week].newplayerscount)
      embed.addField(
        `Cupo de nuevo`,
        `<@${messages[team.toUpperCase()][week].newplayer}>`
      );
    interaction.followUp(embed);
  },
};

*/
