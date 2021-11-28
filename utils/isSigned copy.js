const Discord = require("discord.js");
const decache = require("decache");

function isSigned(interaction, scouts, position, descripcion, experiencia) {
  decache("../../Teams/scouts.json");
  const scouts = require(`../../Teams/scouts.json`);

  if (scouts[interaction.member.user.id]) {
    interaction.followUp(
      "Ya te encuentras en la lista de jugadores buscando equipo."
    );
    return;
  }
  funcScout.registerScout(
    interaction,
    scouts,
    position,
    descripcion,
    experiencia
  );
}

exports.isSigned = isSigned;
