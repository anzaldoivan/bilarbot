const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const package = require("../../utils/fetchJson.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teamstats")
    .setDescription("Ver fixture para la Copa D1/D2")
    .addStringOption((option) =>
      option
        .setName("equipo")
        .setDescription("Escriba las iniciales del equipo")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("temporada")
        .setDescription("Escriba la temporada a buscar")
    ),
  async execute(interaction) {
    const team = interaction.options.getString("equipo");
    const clublist = require(`../../Teams/clublist.json`);
    templist = {
      all: "Todas las temporadas",
      t1: "Temporada 1",
      t2: "Temporada 2",
      t3: "Temporada 3",
      t4: "Temporada 4",
      t5: "Temporada 5",
      t6: "Temporada 6",
      d1: "Liga D1",
      d2: "Liga D2",
      sd1: "Superliga D1",
      master: "Copa Master",
      maradei: "Copa Maradei",
      lm: "Liga Master",
    };

    const season = interaction.options.getString("temporada");
    if (!season) season = "all";
    // console.log(
    //   `https://stats.iosoccer-sa.bid/api/teams/${
    //     clublist[team.toUpperCase()]
    //   }/${season.toLowerCase()}`
    // );
    /*const json = await package.fetchJson(
      `https://stats.iosoccer-sa.bid/api/teams/${
        clublist[team.toUpperCase()]
      }/${season.toLowerCase()}`
    );
    
    const teamsEmojis = require(`../../Teams/clubemojis.json`);

    if (json) {
      embed = new Discord.MessageEmbed()
        .setTitle("Perfil de Equipo")
        .setColor("red")
        .setThumbnail(
          `https://stats.iosoccer-sa.bid/clubs/${team.toLowerCase()}.png`
        )
        .addField(`Nombre del Equipo`, `${json.name}`)
        .addField(`Historial de Partidos`, `${json.matches}`)
        .addField(`Temporada`, `${templist[tID]}`)
        .addField(
          "Estadisticas",
          `Goles: ${json.goals}\nAsistencias: ${json.assists}\nDisparos: ${json.shots} (${json.shotsontarget})\nPases: ${json.passes} (${json.passescompleted})\nIntercepciones: ${json.interceptions}\nAtajadas: ${json.saves} (${json.savescaught})`
        );
      await interaction.reply({ embeds: [embed] });
      return;
    } else {
      await interaction.reply("Equipo no encontrado durante esta temporada.");
      return;
    }
    */
    await interaction.followUp("Equipo no encontrado durante esta temporada.");
    return;
  },
};

/*

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const Discord = require("discord.js");

module.exports = {
  name: "Team Stats",
  aliases: ["none"],
  description: "Check teams stats from JSON",

  execute(message) {
    const fs = require("fs");
    const messages = require(`../Teams/${message.guild.id}.json`);
    const clublist = require(`../Teams/clublist.json`);

    let arr = message.content.split(/[ ,]+/);
    let tID;
    if (arr[2]) {
      tID = arr[2];
    } else {
      tID = "all";
    }
    console.log("The team ID sent on $stats is: " + arr[1]);

    templist = {
      all: "Todas las temporadas",
      t1: "Temporada 1",
      t2: "Temporada 2",
      t3: "Temporada 3",
      t4: "Temporada 4",
      t5: "Temporada 5",
      t6: "Temporada 6",
      d1: "Liga D1",
      d2: "Liga D2",
      sd1: "Superliga D1",
      master: "Copa Master",
      maradei: "Copa Maradei",
      lm: "Liga Master",
    };

    console.log(clublist);
    console.log(clublist[1]);

    console.log(clublist);
    if (clublist[arr[1].toUpperCase()]) {
      console.log(clublist[arr[1].toUpperCase()]);
      fetch(
        `https://stats.iosoccer-sa.bid/api/teams/${
          clublist[arr[1].toUpperCase()]
        }/${tID.toLowerCase()}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(json);
          if (data[0]) {
            embed = new Discord.MessageEmbed()
              .setTitle("Perfil de Equipo")
              .setColor("red")
              .setThumbnail(
                `https://stats.iosoccer-sa.bid/clubs/${arr[1].toLowerCase()}.png`
              )
              .addField(`Nombre del Equipo`, `${data[0].name}`)
              .addField(`Historial de Partidos`, `${data[0].matches}`)
              .addField(`Temporada`, `${templist[tID]}`)
              .addField(
                "Estadisticas",
                `Goles: ${data[0].goals}\nAsistencias: ${data[0].assists}\nDisparos: ${data[0].shots} (${data[0].shotsontarget})\nPases: ${data[0].passes} (${data[0].passescompleted})\nIntercepciones: ${data[0].interceptions}\nAtajadas: ${data[0].saves} (${data[0].savescaught})`
              );
            message.channel.send(embed);
          } else {
            message.channel.send(
              "Equipo no encontrado durante esta temporada."
            );
          }
        });
    } else {
      message.channel.send("Equipo no encontrado");
    }
  },
};

*/
