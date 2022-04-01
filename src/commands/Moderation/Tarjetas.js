const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const funcTeam = require("../../utils/getTeam.js");
const { DateTime } = require("luxon");
const decache = require("decache");
const fs = require("fs");
const manageNicks = require("../../utils/manageNicks.js");
const funcCreate = require("../../utils/createTeam.js");
const GetFromDB = require("../../Database/GetFromDB.js");
const funcDate = require("../../utils/getFecha.js");
const BigNumber = require("bignumber.js");

function steamid_to_64bit(steamid) {
  let id_split = steamid.split(":");
  let sum = Number(id_split[2]) * 2;
  let bool = 0;
  if (id_split[1] == "1") bool += 1;
  let steam64id = new BigNumber(76561197960265728)
    .plus(Number(sum))
    .plus(Number(bool))
    .minus(2);
  //console.log(`Bool ${bool} Sum ${sum}`);
  //console.log(steam64id.toString());
  return steam64id;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tarjetas")
    .setDescription("Verificar estado de suspensiones por tarjetas.")
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Escriba el torneo a revisar.")
        .setRequired(true)
        .addChoice("Superliga D1 T8", "Superliga D1 T8")
        .addChoice("Copa valencARc T8", "Copa valencARc T8")
        .addChoice("Liga Zero T8 - Grupo A", "Liga Zero T8 - Grupo A")
        .addChoice("Liga Zero T8 - Grupo B", "Liga Zero T8 - Grupo B")
        .addChoice("Liga Zero T8 - Playoff", "Superliga D1 T8")
        .addChoice(
          "Torneo Verano 2022 - Grupo A",
          "Torneo Verano 2022 - Grupo A"
        )
        .addChoice(
          "Torneo Verano 2022 - Grupo B",
          "Torneo Verano 2022 - Grupo B"
        )
        .addChoice(
          "Torneo Verano 2022 - Grupo C",
          "Torneo Verano 2022 - Grupo C"
        )
    ),
  permission: ["686350086422396983", "485322687682445345"],
  channel: ["479442064971661312", "931392747259191317"],
  async execute(interaction, client) {
    const torneo = interaction.options.getString("torneo");
    let tarjetas = await GetFromDB.getRusticos("iossa", "matches2", torneo);
    if (
      torneo == "Torneo Verano 2022 - Grupo A" ||
      torneo == "Torneo Verano 2022 - Grupo B" ||
      torneo == "Torneo Verano 2022 - Grupo C"
    )
      tarjetas = await GetFromDB.getRusticos("iossa", "matchestdv", torneo);
    let stringSuspensiones = "";
    embed = new Discord.MessageEmbed()
      .setTitle(`Jugadores Amonestados ${torneo}`)
      .setColor("#000000")
      .setThumbnail(
        `https://www.bennionkearny.com/wp-content/uploads/2020/01/Soccer-yellow-Card-640x843.jpg`
      );
    console.log(tarjetas);
    for (var key in tarjetas) {
      if (tarjetas.hasOwnProperty(key)) {
        let val = tarjetas[key];
        let steamID64 = steamid_to_64bit(val.steamID);
        let count = 0;
        let maxYellowCards = client.config.tournament.maxYellowCards;
        let maxRedCards = client.config.tournament.maxRedCards;
        const limitRedCards = Math.trunc(val.redcards / maxRedCards);
        const limitYellowCards = Math.trunc(val.yellowcards / maxYellowCards);
        if (limitRedCards > 0) count += limitRedCards;
        if (limitYellowCards > 0) count += limitYellowCards;
        // console.log(count);
        // console.log(limitYellowCards);
        // console.log(`${val.yellowcards} / ${maxYellowCards}`);
        // console.log(maxYellowCards);
        if (count > 0) {
          let partido = "partido";
          if (count > 1) partido += "s";
          stringSuspensiones += `${val.name} (${count} ${partido})\n`;
        }
        embed.addField(
          `${val.name}`,
          `Tarjetas Rojas: ${val.redcards} \nTarjetas Amarillas: ${
            val.yellowcards
          } \n[${
            val.steamID
          }](http://steamcommunity.com/profiles/${steamID64})\n[Ultimo partido](https://stats.iosoccer-sa.bid/partido/${val.lastMatch.toString()})`
        );
      }
    }
    //interaction.deleteReply();
    interaction.followUp({ embeds: [embed] });
    if (stringSuspensiones)
      interaction.followUp(
        `Los siguientes jugadores fueron suspendidos por acumulacion de tarjetas: \n${stringSuspensiones}`
      );
    // client.channels.cache
    //   .get("902547421962334219")
    //   .send(
    //     `El representante del Tribunal de Disciplina <@${messageAuthor}> ha disminuido las postergaciones de ${
    //       messages[team.toUpperCase()].fullname
    //     }`
    //   );
  },
};
