const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const decache = require("decache");
const funcTeam = require("../../utils/getTeam.js");
const manageNicks = require("../../utils/manageNicks.js");
const { DateTime } = require("luxon");
const funcDate = require("../../utils/getDate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inscribir")
    .setDescription("Inscribir equipo.")
    .addStringOption((option) =>
      option
        .setName("torneo")
        .setDescription("Elija el torneo donde se quiere inscribir.")
        .setRequired(true)
        .addChoice("Torneo Verano 2022", "verano2022")
    )
    .addStringOption((option) =>
      option
        .setName("nombre")
        .setDescription("Elija el nombre completo del equipo.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("iniciales")
        .setDescription("Elija las iniciales del equipo. Maximo 5 caracteres.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("director")
        .setDescription(
          "Mencione al Director Tecnico. El Director Tecnico no es necesario que forme parte del plantel."
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("capitan")
        .setDescription(
          "Mencione al Capitan. El Capitan forma parte del plantel."
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("subcapitan")
        .setDescription(
          "Mencione al Sub-Capitan. El Sub-Capitan forma parte del plantel."
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador3")
        .setDescription("Mencione al tercer jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador4")
        .setDescription("Mencione al cuarto jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador5")
        .setDescription("Mencione al quinto jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador6")
        .setDescription("Mencione al sexto jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador7")
        .setDescription("Mencione al septimo jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador8")
        .setDescription("Mencione al octavo jugador de su equipo.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("jugador9")
        .setDescription("Mencione al noveno jugador de su equipo.")
        .setRequired(true)
    ),
  permission: ["458075157253062657"],
  channel: ["866700554293346314"],
  async execute(interaction, client) {
    const torneo = interaction.options.getString("torneo");
    const messages = require(`../../Teams/${torneo}.json`);
    const fullname = interaction.options.getString("nombre");
    const teamname = interaction.options.getString("iniciales").toUpperCase();
    const director = interaction.options
      .getUser("director")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador3 = interaction.options
      .getUser("jugador3")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador4 = interaction.options
      .getUser("jugador4")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador5 = interaction.options
      .getUser("jugador5")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador6 = interaction.options
      .getUser("jugador6")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador7 = interaction.options
      .getUser("jugador7")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador8 = interaction.options
      .getUser("jugador8")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    const jugador9 = interaction.options
      .getUser("jugador9")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    let capitan = interaction.options
      .getUser("capitan")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    let subcapitan = interaction.options
      .getUser("subcapitan")
      .toString()
      .replace(/[^0-9\.]+/g, "");
    let currentFechaID = 0;

    if (currentFechaID < 0) currentFechaID = 0;

    if (messages[teamname]) {
      interaction.followUp("El equipo mencionado ya existe.");
      return;
    }

    for (var key in messages) {
      if (messages.hasOwnProperty(key)) {
        if (messages[key][currentFechaID].players.includes(capitan)) {
          interaction.followUp(
            `El jugador <@${captain}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(subcapitan)) {
          interaction.followUp(
            `El jugador <@${subcapitan}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador3)) {
          interaction.followUp(
            `El jugador <@${jugador3}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador4)) {
          interaction.followUp(
            `El jugador <@${jugador4}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador5)) {
          interaction.followUp(
            `El jugador <@${jugador5}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador6)) {
          interaction.followUp(
            `El jugador <@${jugador6}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador7)) {
          interaction.followUp(
            `El jugador <@${jugador7}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador8)) {
          interaction.followUp(
            `El jugador <@${jugador8}> ya pertenece a otro equipo.`
          );
          return;
        }
        if (messages[key][currentFechaID].players.includes(jugador9)) {
          interaction.followUp(
            `El jugador <@${jugador9}> ya pertenece a otro equipo.`
          );
          return;
        }
      }
    }

    messages[teamname] = {
      0: {
        blacklist: 0,
        director: director,
        captain: capitan.toString(),
        emergency: 3,
        lastpostponement: "",
        newplayerscount: 0,
        players: [
          capitan.toString(),
          subcapitan.toString(),
          jugador3.toString(),
          jugador4.toString(),
          jugador5.toString(),
          jugador6.toString(),
          jugador7.toString(),
          jugador8.toString(),
          jugador9.toString(),
        ],
        playerscount: 2,
        postponement: 3,
        releases: 100,
        subcaptain: subcapitan.toString(),
        transfers: 100,
      },
      emoji: "⚽",
      fullname: fullname,
      reserva: 0,
      torneo: torneo,
    };

    interaction.followUp(
      `Se ha creado el equipo correctamente! Recuerde que debe esperar a que se agregue en la base de datos para utilizar los comandos de fichajes.`
    );

    manageNicks.manageNicks(client, interaction, capitan, teamname, "fichar");
    manageNicks.manageNicks(
      client,
      interaction,
      subcapitan,
      teamname,
      "fichar"
    );
    manageNicks.manageNicks(client, interaction, jugador3, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador4, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador5, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador6, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador7, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador8, teamname, "fichar");
    manageNicks.manageNicks(client, interaction, jugador9, teamname, "fichar");

    fs.writeFileSync(
      `./Teams/${torneo}.json`,
      JSON.stringify(messages),
      (err) => {
        if (err) {
          console.log(err);
          client.channels.cache.get(client.config.mm_channel).send(err);
        }
      }
    );

    funcTeam.getTeam(messages, teamname, "0", interaction);
    client.channels.cache
      .get("902547421962334219")
      .send(
        `El equipo ${fullname} se ha inscrito correctamente al Torneo ${torneo}.`
      );

    //await interaction.followUp(message);
  },
};
