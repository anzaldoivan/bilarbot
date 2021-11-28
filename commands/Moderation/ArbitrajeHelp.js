const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("arbitraje")
    .setDescription("Comandos basicos para poder arbitrar un partido"),
  permission: "485322687682445345",
  channel: ["479442064971661312"],
  async execute(interaction) {
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
      )
      .addField(
        "Cambiar camisetas de los equipos",
        "sm_rcon mp_teamkits (camiseta local) (camiseta visitante)"
      )
      .addField("Cambiar pelota", "sm_rcon mp_ballskin (numero de la pelota)")
      .addField(
        "Ejecutar configuracion del ofi",
        "sm_rcon exec maradei (fijarse mas abajo, depende de la competencia que se juegue)"
      )
      .addField(
        "Arrancar partido",
        "sm_rcon exec arrancar (una vez que los capitanes confirmaron, o pasaron 15 minutos y uno de los capitanes quiere empezar)"
      )
      .addField(
        "Poner amarilla",
        "1- rcon users\n2-sm_rcon sv_toggleplayeryellowcard (segundo numero)"
      )
      .addField(
        "Poner roja",
        "1- rcon users\n2-sm_rcon sv_addplayercardban (segundo numero) 22.5"
      )
      .addField(
        "Activar chat de capitanes",
        "sm_rcon mp_chat_match_captain_only 1"
      )
      .addField("Terminar partido (a diferencia de 10)", "rcon sv_endmatch")
      .addField(
        "Que hacer cuando se cae el servidor",
        "sm_rcon sv_resumematch (golesLocal) (golesVisitante) (minutos)\nDespues de mandarlo de vuelta, poner rcon exec grabar (IMPORTANTE)"
      )
      .addField(
        "Timeout Manual (de arbitraje)",
        "sm_rcon sv_starttimeout (Para empezar el timeout)\nsm_rcon sv_endtimeout (Para terminar el timeout)"
      )
      .addField(
        "Banear personas del servidor",
        "sm_ban <#userid|name> <time|0> [reason]\nTambien se puede escribir en el chat !ban <#userid|name> <time|0> [reason]. Por UserID se entiende el SteamID del usuario, se puede revisar esto con status"
      );
    await interaction.followUp({ embeds: [embed] });
  },
};
