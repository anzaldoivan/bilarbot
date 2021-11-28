const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crearcalendario")
    .setDescription("Comandos basicos para poder arbitrar un partido")
    .addStringOption((option) =>
      option
        .setName("competencia")
        .setDescription("Elija la competencia.")
        .setRequired(true)
        .addChoice("Superliga", "sd1")
        .addChoice("Copa Valen", "valen")
        .addChoice("Copa Amateur", "amateur")
    ),
  permission: "188714975244582913",
  channel: ["460972681076932613", "904808330076254238"],
  async execute(interaction) {
    const format = interaction.options.getString("competencia");
    let calendar = require(`../../calendar/185191450013597696.json`);
    let calendarsd1 = require(`../../calendar/t8sd1.json`);
    const messages = require(`../../Teams/185191450013597696.json`);

    let teams = [
      "BV",
      "CAS",
      "CCFC",
      "GB",
      "LCB",
      "MG",
      "PEAKY",
      "PH",
      "UDE",
      "XSN",
    ];

    let teamsd1 = [
      "Viral Team",
      "Mago",
      "Grove Street",
      "Union Deporivo Empate",
      "Club Atletico Pepsicoleros",
      "Los Caballeros de la Birra",
    ];

    let teamsd2 = [
      "Meteors Gaming",
      "Dream Seven",
      "Soccerjam",
      "Union Pacifico",
      "Atletico Fenix",
      "Galactic Boys",
    ];

    let nationalteams = [
      "Argentina",
      "Argentina B",
      "Brasil",
      "Uruguay",
      "USA",
    ];

    let posA = [0, 1, 2, 3];
    let posB = [4, 5, 6, 7];
    let posC = [8, 9, 10, 11];
    let aux;
    let groupA = [];
    let groupB = [];
    let groupC = [];
    let groupD = [];

    function shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    const roundRobin = (teams, matches) => {
      let schedule = [];
      let league = teams.slice();

      if (league.length % 2) {
        league.push("None");
      }

      let rounds = league.length;

      // para ida y vuelta utilizar for (let j = 0; j < (rounds - 1) * 2; j++) {
      for (let j = 0; j < (rounds - 1) * matches; j++) {
        schedule[j] = [];
        for (let i = 0; i < rounds / 2; i++) {
          if (league[i] !== "None" && league[rounds - 1 - i] !== "None") {
            if (j % 2 == 1) {
              schedule[j].push([league[i], league[rounds - 1 - i]]);
            } else {
              schedule[j].push([league[rounds - 1 - i], league[i]]);
            }
          }
        }
        league.splice(1, 0, league.pop());
      }
      return schedule;
    };

    const roundRobinCup = (teams, matches) => {
      let schedule = [];
      let league = teams.slice();

      if (league.length % 2) {
        league.push("None");
      }

      let rounds = league.length;

      // para ida y vuelta utilizar for (let j = 0; j < (rounds - 1) * 2; j++) {
      for (let j = 0; j < (rounds - 1) * matches; j++) {
        for (let i = 0; i < rounds / 2; i++) {
          if (league[i] !== "None" && league[rounds - 1 - i] !== "None") {
            if (j % 2 == 1) {
              schedule.push([league[i], league[rounds - 1 - i]]);
            } else {
              schedule.push([league[rounds - 1 - i], league[i]]);
            }
          }
        }
        league.splice(1, 0, league.pop());
      }
      let aux = [];
      //   for(let i=0; i<teams.length;i++){
      //       aux.push(schedule[0])
      //   }
      aux = [
        [schedule[0], schedule[1], schedule[2]],
        [schedule[3], schedule[4], schedule[5]],
      ];
      schedule = aux;
      console.log("Showing schedule");
      console.log(schedule);
      console.log("Showing schedule");
      return schedule;
    };

    console.log(
      "Calendar lenght is: " + calendar.length + " / format:" + format
    );

    if (format === "maradei") {
      shuffle(posA);
      shuffle(posB);
      shuffle(posC);
      for (let z = 0; z < 4; z++) {
        console.log("Iteracion " + z);
        aux = [];
        aux.push(posA[0]);
        aux.push(posB[0]);
        aux.push(posC[0]);
        posA.shift();
        posB.shift();
        posC.shift();
        console.log(aux);
        if (z == 0) groupA = aux;
        if (z == 1) groupB = aux;
        if (z == 2) groupC = aux;
        if (z == 3) groupD = aux;
      }
      console.log("Mostrando grupos");
      aux = [];
      aux = [json[groupA[0]]._id, json[groupA[1]]._id, json[groupA[2]]._id];
      groupA = aux;
      aux = [];
      aux = [json[groupB[0]]._id, json[groupB[1]]._id, json[groupB[2]]._id];
      groupB = aux;
      aux = [];
      aux = [json[groupC[0]]._id, json[groupC[1]]._id, json[groupC[2]]._id];
      groupC = aux;
      aux = [];
      aux = [json[groupD[0]]._id, json[groupD[1]]._id, json[groupD[2]]._id];
      groupD = aux;
      console.log(groupA);
      console.log(groupB);
      console.log(groupC);
      console.log(groupD);
      let embedA = new Discord.MessageEmbed()
        .setTitle("Grupo A")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupA}`);
      let embedB = new Discord.MessageEmbed()
        .setTitle("Grupo B")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupB}`);
      let embedC = new Discord.MessageEmbed()
        .setTitle("Grupo C")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupC}`);
      let embedD = new Discord.MessageEmbed()
        .setTitle("Grupo D")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupD}`);
      message.channel.send(embedA);
      message.channel.send(embedB);
      message.channel.send(embedC);
      message.channel.send(embedD);

      let cupScheduleA = roundRobinCup(groupA, 2);
      let cupScheduleB = roundRobinCup(groupB, 2);
      let cupScheduleC = roundRobinCup(groupC, 2);
      let cupScheduleD = roundRobinCup(groupD, 2);

      console.log(cupScheduleA[0][0]);
      console.log(cupScheduleB[0]);
      console.log(cupScheduleC[0]);
      console.log(cupScheduleD[0]);

      let cupSchedule = [
        [
          cupScheduleA[0][0],
          cupScheduleA[0][1],
          cupScheduleA[0][2],
          cupScheduleB[0][0],
          cupScheduleB[0][1],
          cupScheduleB[0][2],
          cupScheduleC[0][0],
          cupScheduleC[0][1],
          cupScheduleC[0][2],
          cupScheduleD[0][0],
          cupScheduleD[0][1],
          cupScheduleD[0][2],
        ],
        [
          cupScheduleA[1][0],
          cupScheduleA[1][1],
          cupScheduleA[1][2],
          cupScheduleB[1][0],
          cupScheduleB[1][1],
          cupScheduleB[1][2],
          cupScheduleC[1][0],
          cupScheduleC[1][1],
          cupScheduleC[1][2],
          cupScheduleD[1][0],
          cupScheduleD[1][1],
          cupScheduleD[1][2],
        ],
      ];

      for (let p = 0; p < 2; p++) {
        for (let z = 0; z < 12; z++) {
          console.log(cupSchedule[p][z]);
        }
      }

      console.log(cupSchedule);

      await interaction.followUp(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/amateur.json",
        JSON.stringify(cupSchedule),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format === "amateur") {
      let arr = [];
      for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
          var val = messages[key];
          if (val.torneo == "amateur") arr.push(key);
        }
      }
      shuffle(arr);

      groupA = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]];
      groupB = [arr[6], arr[7], arr[8], arr[9], arr[10], arr[11]];

      console.log("Mostrando arr");
      console.log(arr);

      console.log("Mostrando grupos");

      console.log(groupA);
      console.log(groupB);
      let embedA = new Discord.MessageEmbed()
        .setTitle("Grupo A")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupA}`);
      let embedB = new Discord.MessageEmbed()
        .setTitle("Grupo B")
        .setColor("#ff0000")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/tournaments/copamaradei.png`
        )
        .addField(`Participantes`, `${groupB}`);
      interaction.followUp({ embeds: [embedA] });
      interaction.followUp({ embeds: [embedB] });

      let cupScheduleA = roundRobin(groupA, 1);
      let cupScheduleB = roundRobin(groupB, 1);

      let cupSchedule = [
        [
          cupScheduleA[0][0],
          cupScheduleA[0][1],
          cupScheduleA[0][2],
          cupScheduleB[0][0],
          cupScheduleB[0][1],
          cupScheduleB[0][2],
        ],
        [
          cupScheduleA[1][0],
          cupScheduleA[1][1],
          cupScheduleA[1][2],
          cupScheduleB[1][0],
          cupScheduleB[1][1],
          cupScheduleB[1][2],
        ],
        [
          cupScheduleA[2][0],
          cupScheduleA[2][1],
          cupScheduleA[2][2],
          cupScheduleB[2][0],
          cupScheduleB[2][1],
          cupScheduleB[2][2],
        ],
        [
          cupScheduleA[3][0],
          cupScheduleA[3][1],
          cupScheduleA[3][2],
          cupScheduleB[3][0],
          cupScheduleB[3][1],
          cupScheduleB[3][2],
        ],
        [
          cupScheduleA[4][0],
          cupScheduleA[4][1],
          cupScheduleA[4][2],
          cupScheduleB[4][0],
          cupScheduleB[4][1],
          cupScheduleB[4][2],
        ],
      ];

      //   for (let p = 0; p < 5; p++) {
      //     for (let z = 0; z < 3; z++) {
      //       console.log(cupSchedule[p][z]);
      //     }
      //   }

      console.log("Cup Schedule");
      console.log(cupSchedule);
      console.log(cupScheduleA);
      console.log(cupScheduleB);

      calendarmaradei = cupSchedule;

      await interaction.followUp(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/amateur.json",
        JSON.stringify(calendarmaradei),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format === "valen") {
      let arr = [];
      for (var key in messages) {
        if (messages.hasOwnProperty(key)) {
          var val = messages[key];
          if (val.torneo == "profesional") arr.push(key);
        }
      }
      shuffle(arr);

      let cupSchedule = [
        [
          [arr[0], arr[1]],
          [arr[6], arr[9]],
        ],
        [
          [arr[1], arr[0]],
          [arr[9], arr[6]],
        ],
        [
          [arr[2], "Repechaje"],
          [arr[3], arr[4]],
          [arr[5], "Repechaje"],
          [arr[7], arr[8]],
        ],
        [
          ["Repechaje", arr[2]],
          [arr[4], arr[3]],
          ["Repechaje", arr[5]],
          [arr[8], arr[7]],
        ],
        [
          ["Semis A", "Semis B"],
          ["Semis C", "Semis D"],
        ],
        [
          ["Semis B", "Semis A"],
          ["Semis D", "Semis C"],
        ],
        [["Final A", "Final B"]],
      ];

      //   for (let p = 0; p < 5; p++) {
      //     for (let z = 0; z < 3; z++) {
      //       console.log(cupSchedule[p][z]);
      //     }
      //   }

      console.log("Cup Schedule");
      console.log(cupSchedule);

      await interaction.followUp(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/valen.json",
        JSON.stringify(cupSchedule),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format == "sd1") {
      let leagueSchedule = roundRobin(teams, 1);

      for (let p = 0; p < leagueSchedule.length; p++) {
        console.log(leagueSchedule[p]);
      }

      calendar = leagueSchedule;

      await interaction.followUp(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/t8sd1.json",
        JSON.stringify(calendar),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format == "america") {
      let leagueSchedule = roundRobin(nationalteams, 2);

      for (let p = 0; p < leagueSchedule.length; p++) {
        console.log(leagueSchedule[p]);
      }

      calendaramerica = leagueSchedule;

      message.channel.send(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/calendaramerica.json",
        JSON.stringify(calendaramerica),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format == "d1") {
      let leagueSchedule = roundRobin(teamsd1, 2);

      for (let p = 0; p < leagueSchedule.length; p++) {
        console.log(leagueSchedule[p]);
      }

      calendard1 = leagueSchedule;

      message.channel.send(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/calendard1.json",
        JSON.stringify(calendard1),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    if (format == "d2") {
      let leagueSchedule = roundRobin(teamsd2, 2);

      for (let p = 0; p < leagueSchedule.length; p++) {
        console.log(leagueSchedule[p]);
      }

      calendard2 = leagueSchedule;

      message.channel.send(
        "Sorteo realizado con Exito! Recuerda utilizar el comando de $fecha n para visualizar los partidos de la fecha."
      );

      fs.writeFileSync(
        "./calendar/calendard2.json",
        JSON.stringify(calendard2),
        (err) => {
          if (err) {
            console.log(err);
            message.channel.send(err);
          }
        }
      );
    }

    embed = new Discord.MessageEmbed()
      .setTitle("COMANDOS UTILES PARA ARBITRAR UN PARTIDO")
      .setColor("GREEN")
      .addField("Reiniciar el servidor para que no crashee", "sm_rcon quit")
      .addField(
        "Cambiar mapa",
        "sm_rcon changelevel 6v6_academy (cambiar nombre por el mapa deseado)"
      )
      .addField(
        "Ver ID de las camisetas de los equipos",
        "sm_rcon mp_teamkits_csv (pueden ver las camisetas y los numeros que necesiten) O pueden usar sm_rcon mp_teamkits MG o sm_rcon mp_teamkits meteors para buscar el ID de Meteors Gaming (lo pueden usar para cualquier equipo)"
      );
  },
};
