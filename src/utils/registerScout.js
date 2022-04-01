const Discord = require("discord.js");
const fs = require("fs");
const { DateTime } = require("luxon");
const decache = require("decache");

function registerScout(
  interaction,
  scouts,
  position,
  descripcion,
  experiencia
) {
  decache("../../Teams/scouts.json");
  const scoutsfile = require(`../Teams/scouts.json`);
  const messages = require(`../Teams/185191450013597696.json`);
  let currentFechaID = Math.round(
    DateTime.now().diff(DateTime.local(2021, 10, 25), "weeks").weeks
  );
  if (currentFechaID < 0) currentFechaID = 0;
  let pos;

  if (position == "GK") pos = "Arquero";
  if (position == "CB") pos = "Defensor";
  if (position == "CM") pos = "Mediocampista";
  if (position == "FW") pos = "Delantero";

  if (scouts[interaction.member.user.id]) {
    interaction.followUp(
      "Ya te encuentras en la lista de jugadores buscando equipo."
    );
    return;
  }

  for (var key in messages) {
    if (messages.hasOwnProperty(key)) {
      if (
        messages[key][currentFechaID].players.includes(
          interaction.member.user.id
        )
      ) {
        interaction.followUp(`Ya perteneces a un equipo.`);
        return;
      }
    }
  }

  scoutsfile[interaction.member.user.id] = {
    user: interaction.member.user.id,
    ping: `<@${interaction.member.user.id}>`,
    pos: position,
    descripcion: descripcion,
    experiencia: experiencia,
  };

  fs.writeFileSync(`./Teams/scouts.json`, JSON.stringify(scoutsfile), (err) => {
    if (err) {
      console.log(err);
      client.channels.cache.get(client.config.mm_channel).send(err);
    }
  });
  interaction.followUp(
    `Agregado a la base de datos con exito con la posicion ${pos}.`
  );

  return;
}

exports.registerScout = registerScout;
