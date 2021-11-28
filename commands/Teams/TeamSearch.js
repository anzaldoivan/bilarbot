const { SlashCommandBuilder } = require("@discordjs/builders");
const funcScout = require("../../utils/registerScout.js");
const decache = require("decache");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("postulacion")
    .setDescription("Postulate en el Boletin de Jugadores Buscando Equipo")
    .addStringOption((option) =>
      option
        .setName("posicion")
        .setDescription("Elija su posicion a jugar.")
        .setRequired(true)
        .addChoice("Arquero", "GK")
        .addChoice("Defensor", "CB")
        .addChoice("Mediocampista", "CM")
        .addChoice("Delantero", "FW")
    )
    .addStringOption((option) =>
      option
        .setName("descripcion")
        .setDescription("Escriba una breve descripcion tuya.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("experiencia")
        .setDescription("Escriba sus horas jugadas al IOSoccer.")
        .setRequired(true)
    ),
  async execute(interaction) {
    let position = interaction.options.getString("posicion");
    let descripcion = interaction.options.getString("descripcion");
    let experiencia = interaction.options.getInteger("experiencia");
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
    return;
  },
};

// const Discord = require("discord.js");

// module.exports = {
//   name: "Martin Stats",
//   aliases: ["none"],
//   description: "Player stats using Martin Formula",

//   execute(message, matchJSON) {
//     console.log(matchJSON.players[0]);
//     let playersJSON = matchJSON.players;
//     console.log(playersJSON.length);
//     console.log(playersJSON[0].statistics.goals);
//     const clublist = require(`../Teams/clublistreverse.json`);
//     let pTapadas = 0;
//     var eGeneral = new Array();
// 	let contTotal = 0;
// 	let acuTotal = 0;
//     let auxAtaque = 0;
//     let auxMediocampo = 0;
//     let auxPelotaParada = 0;
//     let auxParticipacion = 0;
//     let auxDefensa = 0;
//     let auxPortero = 0;
//     let auxDisciplina = 0;
//     let mayRojas = 0;
//     let mayAmarillas = 0;
//     let mayFaltas = 0;
//     let mayTiroLibres = 0;
//     let mayPenales = 0;
//     let mayFSufridas = 0;
//     let mayPosecion = 0;
//     let mayFProvocador = 0;
//     let mayCorner = 0;
//     let mayRecorrido = 0;
//     let mayFOfensiva = 0;
//     let maySaqueBanda = 0;
//     let mayFBanda = 0;
//     let maySaqueArco = 0;
//     let MayFPelotaParada = 0;
//     let mayGolesEnContra = 0;
//     let mayFPresenciaEnAnticipacion = 0;
//     let mayFEfectividadBarrida = 0;
//     let mayFAnticipacion = 0;
//     let mayFDefensa = 0;
//     let mayIntercepciones = 0;
//     let mayFTotal = 0;
//     let mayFPromedioIntercepciones = 0;
//     let mayFPresenciaBarrida = 0;
//     let mayAtajadas = 0;
//     let mayFAtrapar = 0;
//     let mayFAlcance = 0;
//     let mayOffside = 0;
//     let mayFPortero = 0;
//     let mayTiros = 0;
//     let mayFPresicionTiro = 0;
//     let mayFConvertido = 0;
//     let mayFBuscador = 0;
//     let mayFControlAtaque = 0;
//     let mayFAtaque = 0;
//     let mayPases = 0;
//     let mayFDestino = 0;
//     let mayFEficacia = 0;
//     let mayFCreador = 0;
//     let mayFCorre = 0;
//     let mayFJugadoTotal = 0;
//     let mayFMedioCampo = 0;
//     let mayFBruto = 0;
//     let mayFControlBalon = 0;
//     let mayFParticipacion = 0;
//     let auxHabilitacion = 0;
//     let auxDisparo;
//     let auxPunteria;
//     let auxEfectividadTiro;
//     let auxFinalizacion;
//     let auxReferencia;
//     let auxPase;
//     let auxSeguridad;
//     let auxEfectividadPase;
//     let auxCreacion;
//     let auxCorredor;
//     let auxCongruencia;
//     let auxRecuperacion;
//     let auxAnticipacion;
//     let auxIntercepcion;
//     let auxPrediccion;
//     let auxBarrida;
//     let auxImbatible;
//     let auxTapadas;
//     let auxAgarre;
//     let auxCobertura;
//     let auxRojas;
//     let auxAmarillas;
//     let auxFaltas;
//     let auxFisico;
//     let auxmayFtotal;
//     let auxMovilidad;
//     let auxPosecionBalon;
//     let auxIncidencia;

//     function getEmoji(number) {
//       if (number == 1) return "1️⃣";
//       if (number == 2) return "2️⃣";
//       if (number == 3) return "3️⃣ ";
//       if (number == 4) return "4️⃣";
//       if (number == 5) return "5️⃣";
//       if (number == 6) return "6️⃣";
//       if (number == 7) return "7️⃣";
//       return;
//     }

//     for (let i = 0; i < playersJSON.length; i++) {
//       /* hay que corregir este for se necesita que recorra el atributo y despues cambie de jugador, actualemente recorre el jugador atributo por atributo esto puede dar mal algunos calculos por que no estan terminado de definir los calculos en las ecuaciones compuestas - Solucion alternativa dejar este for y hacer otro for para que calcule las compuestas una vez determinado los mayores simples*/
//       if (playersJSON[i].statistics.redcards > mayRojas)
//         mayRojas = playersJSON[i].statistics.redcards;
//       if (playersJSON[i].statistics.yellowcards > mayAmarillas)
//         mayAmarillas = playersJSON[i].statistics.yellowcards;
//       if (playersJSON[i].statistics.fouls > mayFaltas)
//         mayFaltas = playersJSON[i].statistics.fouls;
//       if (playersJSON[i].statistics.freekicks > mayTiroLibres)
//         mayTiroLibres = playersJSON[i].statistics.freekicks;
//       if (playersJSON[i].statistics.penalties > mayPenales)
//         mayPenales = playersJSON[i].statistics.penalties;
//       if (playersJSON[i].statistics.foulssuffered > mayFSufridas)
//         mayFSufridas = playersJSON[i].statistics.foulssuffered;
//       if (playersJSON[i].statistics.possession > mayPosecion)
//         mayPosecion = playersJSON[i].statistics.possession;
//       if (playersJSON[i].statistics.corners > mayCorner)
//         mayCorner = playersJSON[i].statistics.corners;
//       if (playersJSON[i].statistics.distancecovered > mayRecorrido)
//         mayRecorrido = playersJSON[i].statistics.distancecovered;
//       if (playersJSON[i].statistics.throwins > maySaqueBanda)
//         maySaqueBanda = playersJSON[i].statistics.throwins;
//       if (playersJSON[i].statistics.goalkicks > maySaqueArco)
//         maySaqueArco = playersJSON[i].statistics.goalkicks;
//       if (playersJSON[i].statistics.interceptions > mayIntercepciones)
//         mayIntercepciones = playersJSON[i].statistics.interceptions;
//       if (playersJSON[i].statistics.owngoals > mayGolesEnContra)
//         mayGolesEnContra = playersJSON[i].statistics.owngoals;
//       if (playersJSON[i].statistics.redcards > mayFEfectividadBarrida)
//         mayFEfectividadBarrida = playersJSON[i].statistics.tacklescompleted;
//       if (
//         playersJSON[i].statistics.interceptions /
//           playersJSON[i].statistics.secondsplayed /
//           60 /
//           90 >
//         mayFPromedioIntercepciones
//       )
//         mayFPromedioIntercepciones =
//           playersJSON[i].statistics.interceptions /
//           playersJSON[i].statistics.secondsplayed /
//           60 /
//           90;
//       if (
//         playersJSON[i].statistics.tacklescompleted /
//           playersJSON[i].statistics.distancecovered >
//         mayFPresenciaBarrida
//       )
//         mayFPresenciaBarrida =
//           playersJSON[i].statistics.tacklescompleted /
//           playersJSON[i].statistics.distancecovered;
//       if (playersJSON[i].statistics.saves > mayAtajadas)
//         mayAtajadas = playersJSON[i].statistics.saves;
//       if (
//         playersJSON[i].statistics.savescaught /
//           playersJSON[i].statistics.saves >
//         mayFAtrapar
//       )
//         mayFAtrapar =
//           playersJSON[i].statistics.savescaught /
//           playersJSON[i].statistics.saves;
//       if (
//         playersJSON[i].statistics.savescaught +
//           playersJSON[i].statistics.interceptions >
//         mayFAlcance
//       )
//         mayFAlcance =
//           playersJSON[i].statistics.savescaught +
//           playersJSON[i].statistics.interceptions;
//       if (playersJSON[i].statistics.offsides > mayOffside)
//         mayOffside = playersJSON[i].statistics.offsides;
//       if (playersJSON[i].statistics.shots > mayTiros)
//         mayTiros = playersJSON[i].statistics.shots;
//       if (
//         playersJSON[i].statistics.shotsontarget /
//           playersJSON[i].statistics.shots >
//         mayFPresicionTiro
//       )
//         mayFPresicionTiro =
//           playersJSON[i].statistics.shotsontarget /
//           playersJSON[i].statistics.shots;
//       if (
//         playersJSON[i].statistics.goals /
//           playersJSON[i].statistics.shotsontarget >
//         mayFConvertido
//       )
//         mayFConvertido =
//           playersJSON[i].statistics.goals /
//           playersJSON[i].statistics.shotsontarget;
//       if (
//         playersJSON[i].statistics.shots /
//           playersJSON[i].statistics.distancecovered >
//         mayFBuscador
//       )
//         mayFBuscador =
//           playersJSON[i].statistics.shots /
//           playersJSON[i].statistics.distancecovered;
//       if (
//         playersJSON[i].statistics.shots / playersJSON[i].statistics.possession >
//         mayFControlAtaque
//       )
//         mayFControlAtaque =
//           playersJSON[i].statistics.shots /
//           playersJSON[i].statistics.possession;
//       if (
//         playersJSON[i].statistics.tacklescompleted /
//           playersJSON[i].statistics.tackles >
//         mayFEfectividadBarrida
//       )
//         mayFEfectividadBarrida =
//           playersJSON[i].statistics.tacklescompleted /
//           playersJSON[i].statistics.tackles;
//       if (
//         playersJSON[i].statistics.interceptions /
//           playersJSON[i].statistics.distancecovered >
//         mayFPresenciaEnAnticipacion
//       )
//         mayFPresenciaEnAnticipacion =
//           playersJSON[i].statistics.interceptions /
//           playersJSON[i].statistics.distancecovered;
//       if (playersJSON[i].statistics.passes > mayPases)
//         mayPases = playersJSON[i].statistics.passes;
//       if (
//         playersJSON[i].statistics.passescompleted /
//           playersJSON[i].statistics.passes >
//         mayFDestino
//       )
//         mayFDestino =
//           playersJSON[i].statistics.passescompleted /
//           playersJSON[i].statistics.passes;
//       if (
//         playersJSON[i].statistics.assists /
//           playersJSON[i].statistics.passescompleted >
//         mayFEficacia
//       )
//         mayFEficacia =
//           playersJSON[i].statistics.assists /
//           playersJSON[i].statistics.passescompleted;
//       if (
//         playersJSON[i].statistics.possession /
//           playersJSON[i].statistics.passes >
//         mayFCreador
//       )
//         mayFCreador =
//           playersJSON[i].statistics.possession /
//           playersJSON[i].statistics.passes;
//       if (
//         playersJSON[i].statistics.distancecovered /
//           playersJSON[i].statistics.passes >
//         mayFCorre
//       )
//         mayFCorre =
//           playersJSON[i].statistics.distancecovered /
//           playersJSON[i].statistics.passes;
//       if (
//         (playersJSON[i].statistics.distancecovered *
//           playersJSON[i].statistics.possession) /
//           100 >
//         mayFControlBalon
//       )
//         mayFControlBalon =
//           (playersJSON[i].statistics.distancecovered *
//             playersJSON[i].statistics.possession) /
//           100;
//       if (playersJSON[i].statistics.secondsplayed / 60 / 90 > mayFJugadoTotal)
//         /* ideal hay que resolver separar lo jugado como jugador a lo jugado como arquero */
//         mayFJugadoTotal = playersJSON[i].statistics.secondsplayed / 60 / 90;
//     }

//     for (let i = 0; i < playersJSON.length; i++) {
//       if (
//         (playersJSON[i].statistics.foulssuffered *
//           playersJSON[i].statistics.possession *
//           100) /
//           (mayFSufridas * mayPosecion) >
//         mayFProvocador
//       )
//         /* compuesta */ /* Si no funciona el condicional guardar el calculo en una variable antes de entrar a la pregunta*/
//         mayFProvocador =
//           (playersJSON[i].statistics.foulssuffered *
//             playersJSON[i].statistics.possession *
//             100) /
//           (mayFSufridas * mayPosecion);

//       if (
//         (playersJSON[i].statistics.corners *
//           playersJSON[i].statistics.distancecovered *
//           100) /
//           (mayCorner * mayRecorrido) >
//         mayFOfensiva
//       )
//         /* compuesta */ /* Si no funciona el condicional guardar el calculo en una variable antes de entrar a la pregunta */
//         mayFOfensiva =
//           (playersJSON[i].statistics.corners *
//             playersJSON[i].statistics.distancecovered *
//             100) /
//           (mayCorner * mayRecorrido);

//       if (
//         (playersJSON[i].statistics.throwins *
//           playersJSON[i].statistics.corners *
//           100) /
//           (maySaqueBanda * mayRecorrido) >
//         mayFBanda
//       )
//         /* compuesta */ /* Si no funciona el condicional guardar el calculo en una variable antes de entrar a la pregunta */
//         mayFBanda =
//           (playersJSON[i].statistics.throwins *
//             playersJSON[i].statistics.corners *
//             100) /
//           (maySaqueBanda * mayRecorrido);

//       cantFPresenciaEnAnticipacion =
//         playersJSON[i].statistics.interceptions /
//         playersJSON[i].statistics.distancecovered; /* compuesta */

//       if (
//         (playersJSON[i].statistics.corners *
//           playersJSON[i].statistics.distancecovered *
//           100) /
//           (mayCorner * mayRecorrido) >
//         mayFOfensiva
//       )
//         /* compuesta */
//         mayFOfensiva =
//           (playersJSON[i].statistics.corners *
//             playersJSON[i].statistics.distancecovered *
//             100) /
//           (mayCorner * mayRecorrido);

//       if (
//         (playersJSON[i].statistics.throwins *
//           playersJSON[i].statistics.distancecovered *
//           100) /
//           (maySaqueBanda * mayRecorrido) >
//         mayFBanda
//       )
//         /* compuesta */
//         mayFBanda =
//           (playersJSON[i].statistics.throwins *
//             playersJSON[i].statistics.distancecovered *
//             100) /
//           (maySaqueBanda * mayRecorrido);

//       if (
//         (cantFPresenciaEnAnticipacion * 100) / mayFPresenciaEnAnticipacion >
//         mayFAnticipacion
//       )
//         /* compuesta */
//         mayFAnticipacion = (cantFPresenciaEnAnticipacion * 100) / mayFPresenciaEnAnticipacion; //ver aca
//     }

//     for (let i = 0; i < playersJSON.length; i++) {
//       cantpGeneradorTLibres =
//         (playersJSON[i].statistics.freekicks * 100) /
//         mayTiroLibres; /* compuesta */
//       if (isNaN(cantpGeneradorTLibres)) cantpGeneradorTLibres = 0;
//       cantpGeneradorPenales =
//         (playersJSON[i].statistics.penalties * 100) /
//         mayPenales; /* compuesta */
//       if (isNaN(cantpGeneradorPenales)) cantpGeneradorPenales = 0;
//       cantfOfensiva =
//         (playersJSON[i].statistics.corners *
//           playersJSON[i].statistics.distancecovered *
//           100) /
//         (mayCorner * mayRecorrido); /* compuesta */
//       if (isNaN(cantfOfensiva)) cantfOfensiva = 0;
//       cantfBanda =
//         (playersJSON[i].statistics.throwins *
//           playersJSON[i].statistics.distancecovered *
//           100) /
//         (maySaqueBanda * mayRecorrido); /* compuesta */
//       if (isNaN(cantfBanda)) cantfBanda = 0;
//       cantfProvocar =
//         (playersJSON[i].statistics.foulssuffered *
//           playersJSON[i].statistics.possession *
//           100) /
//         (mayFSufridas * mayPosecion); /* compuesta */
//       if (isNaN(cantfProvocar)) cantfProvocar = 0;
//       cantpSaqueArco =
//         (playersJSON[i].statistics.goalkicks * 100) /
//         maySaqueArco; /* compuesta */
//       if (isNaN(cantpSaqueArco)) cantpSaqueArco = 0;
//       auxHabilitacion =
//         100 - (playersJSON[i].statistics.offsides * 100) / mayOffside;
//       //console.log(`${playersJSON[i].name} ${cantfProvocar} ${cantpGeneradorPenales} ${cantpGeneradorTLibres} ${cantfOfensiva} ${cantfBanda} ${cantpSaqueArco}`);
//       if (isNaN(auxHabilitacion)) auxHabilitacion = 100;

//       auxDisparo = (playersJSON[i].statistics.shots * 100) / mayTiros;
//       if (isNaN(auxDisparo)) auxDisparo = 0;

//       auxPunteria =
//         ((playersJSON[i].statistics.shotsontarget /
//           playersJSON[i].statistics.shots) *
//           100) /
//         mayFPresicionTiro;
//       if (isNaN(auxPunteria) || isNaN(mayFPresicionTiro)) auxPunteria = 0;

//       auxEfectividadTiro =
//         ((playersJSON[i].statistics.goals /
//           playersJSON[i].statistics.shotsontarget) *
//           100) /
//         mayFConvertido;
//       if (isNaN(auxEfectividadTiro) || isNaN(mayFConvertido))
//         auxEfectividadTiro = 0;

//       auxFinalizacion =
//         ((playersJSON[i].statistics.shots /
//           playersJSON[i].statistics.distancecovered) *
//           100) /
//         mayFBuscador;
//       if (isNaN(auxFinalizacion) || isNaN(mayFBuscador)) auxFinalizacion = 0;

//       auxReferencia =
//         ((playersJSON[i].statistics.shots /
//           playersJSON[i].statistics.possession) *
//           100) /
//         mayFControlAtaque;
//       if (isNaN(auxReferencia) || isNaN(mayFControlAtaque)) auxReferencia = 0;

//       auxAtaque =
//         (auxHabilitacion +
//           auxDisparo +
//           auxPunteria +
//           auxEfectividadTiro +
//           auxFinalizacion +
//           auxReferencia) /
//         6;

//       auxPase = (playersJSON[i].statistics.passes * 100) / mayPases;
//       if (isNaN(auxPase)) auxPase = 0;

//       auxSeguridad =
//         ((playersJSON[i].statistics.passescompleted /
//           playersJSON[i].statistics.passes) *
//           100) /
//         mayFDestino;
//       if (isNaN(auxSeguridad)) auxSeguridad = 0;

//       auxEfectividadPase =
//         ((playersJSON[i].statistics.assists /
//           playersJSON[i].statistics.passescompleted) *
//           100) /
//         mayFEficacia;
//       if (isNaN(auxEfectividadPase)) auxEfectividadPase = 0;

//       auxCreacion =
//         ((playersJSON[i].statistics.possession /
//           playersJSON[i].statistics.passes) *
//           100) /
//         mayFCreador;
//       if (isNaN(auxCreacion)) auxCreacion = 0;

//       auxCorredor =
//         ((playersJSON[i].statistics.distancecovered /
//           playersJSON[i].statistics.passes) *
//           100) /
//         mayFCorre;
//       if (isNaN(auxCorredor)) auxCorredor = 0;

//       auxMediocampo =
//         (auxPase +
//           auxSeguridad +
//           auxEfectividadPase +
//           auxCreacion +
//           auxCorredor) /
//         5;

//       auxPelotaParada =
//         ((cantpGeneradorTLibres + cantpGeneradorPenales + cantfProvocar) / 3 +
//           (cantfBanda + cantfOfensiva + cantpSaqueArco) / 3) /
//         2;
//       if (isNaN(auxPelotaParada)) auxPelotaParada = 0;

//       auxMovilidad =
//         (playersJSON[i].statistics.distancecovered * 100) / mayRecorrido;
//       if (isNaN(auxMovilidad)) auxMovilidad = 0;

//       auxPosecionBalon =
//         (playersJSON[i].statistics.possession * 100) / mayPosecion;
//       if (isNaN(auxPosecionBalon)) auxPosecionBalon = 0;
//       auxIncidencia =
//         (((playersJSON[i].statistics.distancecovered *
//           playersJSON[i].statistics.possession) /
//           100) *
//           100) /
//         mayFControlBalon;
//       auxParticipacion = (auxMovilidad + auxPosecionBalon + auxIncidencia) / 3;
//       // console.log(` may Participacion: ${auxMovilidad} ${auxPosecionBalon} ${auxIncidencia} ${auxParticipacion}`);
//       const cantGolesEnContra = playersJSON[i].statistics.owngoals;
//       const cantBarridas = playersJSON[i].statistics.tackles;

//       const cantBarridasCompletadas =
//         playersJSON[i].statistics.tacklescompleted;
//       let fEfectividadBarrida = cantBarridasCompletadas / cantBarridas;
// 	  if (isNaN(fEfectividadBarrida)) fEfectividadBarrida = 0;
// 	//console.log(`EfectividadBarrida: ${cantBarridasCompletadas} ${cantBarridas} ${fEfectividadBarrida} ${playersJSON[i].statistics.tacklescompleted} ${playersJSON[i].statistics.tackles}`);
//       const cantIntercepciones = playersJSON[i].statistics.interceptions;
//       const cantRecorrido = playersJSON[i].statistics.distancecovered;

//       const cantJugado = playersJSON[i].statistics.secondsplayed / 60 / 90;
//       const cantfPresenciaEnAnticipacion = cantIntercepciones / cantRecorrido;
//       const cantfPresenciaBarrida = cantBarridasCompletadas / cantRecorrido;

//       auxCongruencia = 100 - (cantGolesEnContra * 100) / mayGolesEnContra;
//       if (isNaN(auxCongruencia)) auxCongruencia = 100;

//       auxRecuperacion =
//         ((fEfectividadBarrida * 100) / mayFEfectividadBarrida +
//           (cantfPresenciaEnAnticipacion * 100) / mayFPresenciaEnAnticipacion) /
//         2;
//       if (isNaN(auxRecuperacion)) auxRecuperacion = 0;
// 	//	console.log(`Recuperacion: ${fEfectividadBarrida} ${mayFEfectividadBarrida} ${cantfPresenciaEnAnticipacion} ${mayFPresenciaEnAnticipacion} ${auxRecuperacion}`);
//       auxAnticipacion =
//         (cantfPresenciaEnAnticipacion * 100) / mayFPresenciaEnAnticipacion;
//       if (isNaN(auxAnticipacion)) auxAnticipacion = 0;

//       auxIntercepcion = (cantIntercepciones * 100) / mayIntercepciones;
//       if (isNaN(auxIntercepcion)) auxIntercepcion = 0;

//       auxPrediccion =
//         ((cantIntercepciones / cantJugado) * 100) /
//         mayFPromedioIntercepciones /
//         100000000;
//       if (isNaN(auxPrediccion)) auxPrediccion = 0;

//       auxBarrida = (cantfPresenciaBarrida * 100) / mayFPresenciaBarrida;
//       if (isNaN(auxBarrida)) auxBarrida = 0;
//       /* (pCongruencia +
//           pRecuperacion +
//           pAnticipacion +
//           pIntercepcion +
//           pPrediccion +
//           pBarrida) /
//         6  */
//       auxDefensa =
//         (auxCongruencia +
//           auxRecuperacion +
//           auxAnticipacion +
//           auxIntercepcion +
//           auxPrediccion +
//           auxBarrida) /
//         6;
// 		//console.log(`Defensa: ${auxCongruencia} ${auxRecuperacion} ${auxAnticipacion} ${auxIntercepcion} ${auxPrediccion} ${auxBarrida} ${auxDefensa}`);
//       if (
//         playersJSON[i].statistics.saves > 0 ||
//         playersJSON[i].statistics.goalsconceded > 0 ||
//         playersJSON[i].statistics.goalkicks > 0
//       ) {
//         auxImbatible =
//           (playersJSON[i].statistics.saves * 100) /
//           (playersJSON[i].statistics.saves +
//             playersJSON[i].statistics.goalsconceded);
//         if (isNaN(auxImbatible)) auxImbatible = 0;

//         auxTapadas = (playersJSON[i].statistics.saves * 100) / mayAtajadas;
//         if (isNaN(auxTapadas)) auxTapadas = 0;

//         auxAgarre =
//           ((playersJSON[i].statistics.savescaught /
//             playersJSON[i].statistics.saves) *
//             100) /
//           mayFAtrapar;
//         if (isNaN(auxAgarre)) auxAgarre = 0;

//         auxCobertura =
//           ((playersJSON[i].statistics.savescaught +
//             playersJSON[i].statistics.interceptions) *
//             100) /
//           mayFAlcance;
//         if (isNaN(auxCobertura)) auxCobertura = 0;

//         // (pImbatible + pTapadas + pAgarre + pCobertura) / 4
//         auxPortero = (auxImbatible + auxTapadas + auxAgarre + auxCobertura) / 4;
//         //console.log(`Es Portero: ${auxImbatible} ${auxTapadas} ${auxAgarre} ${auxCobertura} ${auxPortero}`);
//       } else {
//         auxPortero = 0;
//         //console.log(`No es Portero: ${auxPortero}`);
//       }
//       auxRojas = (playersJSON[i].statistics.redcards * 100) / mayRojas;
//       if (isNaN(auxRojas)) auxRojas = 0;

//       auxAmarillas =
//         (playersJSON[i].statistics.yellowcards * 100) / mayAmarillas;
//       if (isNaN(auxAmarillas)) auxAmarillas = 0;

//       auxFaltas = (playersJSON[i].statistics.fouls * 100) / mayFaltas;
//       if (isNaN(auxFaltas)) auxFaltas = 0;

//       auxDisciplina = 100 - (auxRojas + auxAmarillas + auxFaltas) / 3;
//       if (isNaN(auxDisciplina)) auxDisciplina = 100;
//       if (auxAtaque > mayFAtaque) mayFAtaque = auxAtaque;

//       if (auxMediocampo > mayFMedioCampo) mayFMedioCampo = auxMediocampo;
//       /* pPase + pSeguridad + pEfectividadPase + pCreacion + pCorredor) / 5 */

//       //console.log(`${auxPelotaParada}`);
//       if (auxPelotaParada > MayFPelotaParada)
//         /* compuesta */
//         MayFPelotaParada = auxPelotaParada;
//       //console.log(`${MayFPelotaParada}`);

//       if (auxParticipacion > mayFParticipacion)
//         mayFParticipacion = auxParticipacion;

//       if (auxDefensa > mayFDefensa)
//         /* (pCongruencia +
//           pRecuperacion +
//           pAnticipacion +
//           pIntercepcion +
//           pPrediccion +
//           pBarrida) /
//         6  */
//         mayFDefensa = auxDefensa;

//       if (auxPortero > mayFPortero)
//         /*(pImbatible + pTapadas + pAgarre + pCobertura) / 4*/
//         mayFPortero = auxPortero;

//       if (
//         (auxPelotaParada +
//           auxDefensa +
//           auxPortero +
//           auxAtaque +
//           auxMediocampo +
//           auxParticipacion +
//           auxDisciplina) /
//           7 >
//         mayFBruto
//       )
//         /*    const fBruto =
//         (pPelotaParada +
//         pDefensa +
//         pPortero +
//         pAtaque +
//         pMedioCampo +
//         pParticipacion +
//         pDisciplina) / 7; */
//         mayFBruto =
//           (auxPelotaParada +
//             auxDefensa +
//             auxPortero +
//             auxAtaque +
//             auxMediocampo +
//             auxParticipacion +
//             auxDisciplina) /
//           7;
//       /*console.log(
//         `MAY F BRUTO: ${auxPelotaParada} ${auxDefensa} ${auxPortero} ${auxAtaque} ${auxMediocampo} ${auxParticipacion} ${auxDisciplina}`
//       ); */
//       auxFisico =
//         ((playersJSON[i].statistics.secondsplayed / 60 / 90) * 100) /
//         mayFJugadoTotal;
//       auxmayFtotal = ((auxPelotaParada + auxDefensa + auxPortero + auxAtaque + auxMediocampo + auxParticipacion + auxDisciplina) / 7)* auxFisico / 100;

// 	contTotal = contTotal + 1;
// 	acuTotal = acuTotal + auxmayFtotal;
//       if (auxmayFtotal > mayFTotal)
//         mayFTotal = ((auxPelotaParada + auxDefensa + auxPortero + auxAtaque + auxMediocampo + auxParticipacion + auxDisciplina) / 7)* auxFisico / 100;

//       //console.log(`${auxPelotaParada} ${auxDefensa} ${auxPortero} ${auxAtaque} ${auxMediocampo} ${auxParticipacion} ${auxDisciplina} ${auxFisico} ${mayFTotal}`);
//     }
// const promTotal = acuTotal / contTotal;
//     for (let i = 0; i < playersJSON.length; i++) {
//       // disciplina
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar

//       const cantRojas = playersJSON[i].statistics.redcards;

//       let pRojas = (cantRojas * 100) / mayRojas;
//       if (isNaN(pRojas)) pRojas = 0;

//       const cantAmarillas = playersJSON[i].statistics.yellowcards;

//       let pAmarrillas = (cantAmarillas * 100) / mayAmarillas;
//       if (isNaN(pAmarrillas)) pAmarrillas = 0;

//       const cantFaltas = playersJSON[i].statistics.fouls;
//       let pFaltas = (cantFaltas * 100) / mayFaltas;
//       if (isNaN(pFaltas)) pFaltas = 0;

//       const pDisciplina = 100 - (pRojas + pAmarrillas + pFaltas) / 3;

//       // Pelota parada
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const cantTiroLibres = playersJSON[i].statistics.freekicks;
//       let pGeneradorTLibres = (cantTiroLibres * 100) / mayTiroLibres;
//       if (isNaN(pGeneradorTLibres)) pGeneradorTLibres = 0;

//       const cantPenales = playersJSON[i].statistics.penalties;
//       let pGeneradorPenales = (cantPenales * 100) / mayPenales;
//       if (isNaN(pGeneradorPenales)) pGeneradorPenales = 0;
//       const cantFSufridas = playersJSON[i].statistics.foulssuffered;
//       const cantPosecion = playersJSON[i].statistics.possession;
//       let fProvocador =
//         (cantFSufridas * cantPosecion * 100) / (mayFSufridas * mayPosecion);
//       if (isNaN(fProvocador)) fProvocador = 0;
//       let pProvocador = (fProvocador * 100) / mayFProvocador;
//       if (isNaN(pProvocador)) pProvocador = 0;

//       const cantCorner = playersJSON[i].statistics.corners;
//       const cantRecorrido = playersJSON[i].statistics.distancecovered;
//       let fOfensiva =
//         (cantCorner * cantRecorrido * 100) / (mayCorner * mayRecorrido);
//       if (isNaN(fOfensiva)) fOfensiva = 0;
//       let pOfensiva = (fOfensiva * 100) / mayFOfensiva;
//       if (isNaN(pOfensiva)) pOfensiva = 0;
//       const cantSaqueBanda = playersJSON[i].statistics.throwins;
//       let fBanda =
//         (cantSaqueBanda * cantRecorrido * 100) / (maySaqueBanda * mayRecorrido);
//       if (isNaN(fBanda)) fBanda = 0;
//       let pBanda = (fBanda * 100) / mayFBanda;
//       if (isNaN(pBanda)) pBanda = 0;
//       const cantSaqueArco = playersJSON[i].statistics.goalkicks;
//       let pSaqueArco = (cantSaqueArco * 100) / maySaqueArco;
//       if (isNaN(pSaqueArco)) pSaqueArco = 0;

//       const pMalicia =
//         (fProvocador + pGeneradorPenales + pGeneradorTLibres) / 3;

//       const pPresencia = (fOfensiva + fBanda + pSaqueArco) / 3;
//       const fPelotaParada = (pMalicia + pPresencia) / 2;
//       let pPelotaParada = (fPelotaParada * 100) / MayFPelotaParada;
//       if (isNaN(pPelotaParada)) pPelotaParada = 0;

//       // Defensa
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const cantGolesEnContra = playersJSON[i].statistics.owngoals;
//       let pCongruencia = 100 - (cantGolesEnContra * 100) / mayGolesEnContra;
//       if (isNaN(pCongruencia)) pCongruencia = 100;

//       const cantBarridasCompletadas =
//         playersJSON[i].statistics.tacklescompleted;
//       const cantBarridas = playersJSON[i].statistics.tackles;
//       let fEfectividadBarrida = cantBarridasCompletadas / cantBarridas;
//       if (isNaN(fEfectividadBarrida)) fEfectividadBarrida = 0;

//       const cantIntercepciones = playersJSON[i].statistics.interceptions;
//       let fPresenciaEnAnticipacion = cantIntercepciones / cantRecorrido;
//       if (isNaN(fPresenciaEnAnticipacion)) fPresenciaEnAnticipacion = 0;
//       let pAnticipacion =
//         (fPresenciaEnAnticipacion * 100) / mayFPresenciaEnAnticipacion;
//       if (isNaN(pAnticipacion)) pAnticipacion = 0;

//       let pRecuperacion =
//         ((fEfectividadBarrida * 100) / mayFEfectividadBarrida + pAnticipacion) /
//         2;
//       if (isNaN(pRecuperacion)) pRecuperacion = 0;
// 	//	console.log(`IND Recuperacion: ${fEfectividadBarrida} ${mayFEfectividadBarrida} ${fPresenciaEnAnticipacion} ${mayFPresenciaEnAnticipacion} ${pAnticipacion}`);
//       let pIntercepcion = (cantIntercepciones * 100) / mayIntercepciones;
//       if (isNaN(pIntercepcion)) pIntercepcion = 0;

//       const cantPartidos = playersJSON[i].statistics.secondsplayed / 60 / 90; // en caso de poder debes de partidos es el tiempo jugado en cancha reemplazar fJugadoTotal

//       let fPromedioIntercepciones = cantIntercepciones / cantPartidos;
//       if (isNaN(fPromedioIntercepciones)) fPromedioIntercepciones = 0;
//       let pPrediccion =
//         (fPromedioIntercepciones * 100) /
//         mayFPromedioIntercepciones /
//         100000000;
//       if (isNaN(pPrediccion)) pPrediccion = 0;

//       let fPresenciaBarrida = cantBarridasCompletadas / cantRecorrido;
//       if (isNaN(fPresenciaBarrida)) fPresenciaBarrida = 0;

//       let pBarrida = (fPresenciaBarrida * 100) / mayFPresenciaBarrida;
//       if (isNaN(pBarrida)) pBarrida = 0;

//       const fDefensa =
//         (pCongruencia +
//           pRecuperacion +
//           pAnticipacion +
//           pIntercepcion +
//           pPrediccion +
//           pBarrida) /
//         6;
//       let pDefensa = (fDefensa * 100) / mayFDefensa;
//       if (isNaN(pDefensa)) pDefensa = 0;
// 	  //console.log(`IND Defensa: ${pCongruencia} ${pRecuperacion} ${pAnticipacion} ${pIntercepcion} ${pPrediccion} ${pBarrida} ${fDefensa}`);
//       //console.log(`${pCongruencia} ${pRecuperacion} ${pAnticipacion} ${pIntercepcion} ${pPrediccion} ${pBarrida}`);
//       //  console.log(`${fDefensa} ${mayFDefensa}`);
//       // Arquero
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const cantAtajadas = playersJSON[i].statistics.saves;
//       const cantGolesRecibidos = playersJSON[i].statistics.goalsconceded;
//       let pImbatible = 0;
//       pTapadas = 0;
//       let pAgarre = 0;
//       let pCobertura = 0;
//       if (cantAtajadas > 0 || cantGolesRecibidos > 0 || cantSaqueArco > 0) {
//         const fTirosRecibidos = cantAtajadas + cantGolesRecibidos;
//         pImbatible = (cantAtajadas * 100) / fTirosRecibidos;
//         if (isNaN(pImbatible)) pImbatible = 0;

//         pTapadas = (cantAtajadas * 100) / mayAtajadas;
//         if (isNaN(pTapadas)) pTapadas = 0;

//         const cantAtajadasSinRebote = playersJSON[i].statistics.savescaught;
//         fAtrapar = cantAtajadasSinRebote / cantAtajadas;
//         if (isNaN(fAtrapar)) fAtrapar = 0;
//         pAgarre = (fAtrapar * 100) / mayFAtrapar;
//         if (isNaN(pAgarre)) pAgarre = 0;

//         const fAlcance = cantAtajadasSinRebote + cantIntercepciones;
//         pCobertura = (fAlcance * 100) / mayFAlcance;
//         if (isNaN(pCobertura)) pCobertura = 0;
//       }
//       const fPortero = (pImbatible + pTapadas + pAgarre + pCobertura) / 4;

//       let pPortero = (fPortero * 100) / mayFPortero;
//       if (isNaN(pPortero)) pPortero = 0;

//       // console.log(`${fDefensa} ${mayFDefensa}`);
//       // experiencia de portero *solo si se puede sacar el tiempo jugado
//       const cantJugadoJugador =
//         playersJSON[i].statistics.secondsplayed / 60 / 90;
//       const cantJugadoArquero =
//         playersJSON[i].statistics.secondsplayed / 60 / 90;
//       const fJugadoTotal = cantJugadoJugador + cantJugadoArquero;
//       const pExperienciaPortero = (cantJugadoArquero * 100) / fJugadoTotal; // Sirve solo para mostrar si juega regularmente en el arco, no influye en el puntaje
//       // experiencia de portero *solo si se puede sacar el tiempo jugado

//       // Ataque
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const cantOffside = playersJSON[i].statistics.offsides;
//       let pHabilitacion = 100 - (cantOffside * 100) / mayOffside;
//       if (isNaN(pHabilitacion)) pHabilitacion = 100;

//       const cantTiros = playersJSON[i].statistics.shots;
//       let pDisparo = (cantTiros * 100) / mayTiros;
//       if (isNaN(pDisparo)) pDisparo = 0;
//       const cantTirosAlArco = playersJSON[i].statistics.shotsontarget;
//       let fPresicionTiro = cantTirosAlArco / cantTiros;
//       if (isNaN(fPresicionTiro)) fPresicionTiro = 0;
//       let pPunteria = (fPresicionTiro * 100) / mayFPresicionTiro;
//       if (isNaN(pPunteria)) pPunteria = 0;
//       const cantGoles = playersJSON[i].statistics.goals;
//       let fConvertido = cantGoles / cantTirosAlArco;
//       if (isNaN(fConvertido)) fConvertido = 0;
//       let pEfectividadTiro = (fConvertido * 100) / mayFConvertido;
//       if (isNaN(pEfectividadTiro)) pEfectividadTiro = 0;

//       //console.log(`(${fConvertido} * 100) / ${mayFConvertido}; MAXIMO PATEADO: ${cantTirosAlArco}`);

//       let fBuscador = cantTiros / cantRecorrido;
//       if (isNaN(fBuscador)) fBuscador = 0;
//       let pFinalizacion = (fBuscador * 100) / mayFBuscador;
//       if (isNaN(pFinalizacion)) pFinalizacion = 0;

//       let fControlAtaque = cantTiros / cantPosecion;
//       if (isNaN(fControlAtaque)) fControlAtaque = 0;
//       let pReferencia = (fControlAtaque * 100) / mayFControlAtaque;
//       if (isNaN(pReferencia)) pReferencia = 0;

//       const fAtaque =
//         (pHabilitacion +
//           pDisparo +
//           pPunteria +
//           pEfectividadTiro +
//           pFinalizacion +
//           pReferencia) /
//         6;

// 	console.log(`${pHabilitacion} ${pDisparo} ${pPunteria} ${pEfectividadTiro} ${pFinalizacion} ${pReferencia} ${fAtaque}`);
//       let pAtaque = (fAtaque * 100) / mayFAtaque;
//       if (isNaN(pAtaque)) pAtaque = 0;
// //console.log(`Ataque: ${pHabilitacion} ${pDisparo} ${pPunteria} ${pEfectividadTiro} ${pFinalizacion} ${pReferencia} ${fAtaque} ${pAtaque}`);
//       // Mediocampo
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const cantPases = playersJSON[i].statistics.passes;
//       let pPase = (cantPases * 100) / mayPases;
//       if (isNaN(pPase)) pPase = 0;

//       const cantPasesCompletados = playersJSON[i].statistics.passescompleted;
//       let fDestino = cantPasesCompletados / cantPases;
//       if (isNaN(fDestino)) fDestino = 0;
//       let pSeguridad = (fDestino * 100) / mayFDestino;
//       if (isNaN(pSeguridad)) pSeguridad = 0;
//       const cantAsistencia = playersJSON[i].statistics.assists;
//       let fEficacia = cantAsistencia / cantPasesCompletados;
//       if (isNaN(fEficacia)) fEficacia = 0;
//       let pEfectividadPase = (fEficacia * 100) / mayFEficacia;
//       if (isNaN(pEfectividadPase)) pEfectividadPase = 0;

//       let fCreador = cantPosecion / cantPases;
//       if (isNaN(fCreador)) fCreador = 0;
//       let pCreacion = (fCreador * 100) / mayFCreador;
//       if (isNaN(pCreacion)) pCreacion = 0;

//       let fCorre = cantRecorrido / cantPases;
//       if (isNaN(fCorre)) fCorre = 0;
//       let pCorredor = (fCorre * 100) / mayFCorre;
//       if (isNaN(pCorredor)) pCorredor = 0;

//       const fMedioCampo =
//         (pPase + pSeguridad + pEfectividadPase + pCreacion + pCorredor) / 5;
//       let pMedioCampo = (fMedioCampo * 100) / mayFMedioCampo;
//       if (isNaN(pMedioCampo)) pMedioCampo = 0;

//       //console.log(`${pPase} ${pSeguridad} ${pEfectividadPase} ${pCreacion} ${pCorredor}`);
//       //console.log(`${fMedioCampo} ${mayFMedioCampo}`);

//       // Participacion
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const pMovilidad = (cantRecorrido * 100) / mayRecorrido;
//       if (isNaN(pMovilidad)) pMovilidad = 0;

//       const pPosecionBalon = (cantPosecion * 100) / mayPosecion;
//       if (isNaN(pPosecionBalon)) pPosecionBalon = 0;

//       const fControlBalon = (cantRecorrido * cantPosecion) / 100;
//       const pIncidencia = (fControlBalon * 100) / mayFControlBalon;
//       if (isNaN(pIncidencia)) pIncidencia = 0;

//       const fParticipacion = (pMovilidad + pPosecionBalon + pIncidencia) / 3;
//       const pParticipacion = (fParticipacion * 100) / mayFParticipacion;
//       if (isNaN(pParticipacion)) pParticipacion = 0;
//       //console.log(` ind Participacion: ${pMovilidad} ${pPosecionBalon} ${pIncidencia} ${pParticipacion}`);

//       // Fisico
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const pFisico = (cantPartidos * 100) / mayFJugadoTotal;

//       // Valor del jugador Bruto
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100

//       const fBruto =
//         (fPelotaParada +
//           fDefensa +
//           fPortero +
//           fAtaque +
//           fMedioCampo +
//           fParticipacion +
//           pDisciplina) /
//         7;

//       const pBruto = (fBruto * 100) / mayFBruto;
// 	 // console.log(`${fPelotaParada} ${fDefensa} ${fPortero} ${fAtaque} ${fMedioCampo} ${fParticipacion} ${pDisciplina}`);
//      /* console.log(`IND Bruto: ${fPelotaParada} ${fDefensa} ${fPortero} ${fAtaque} ${fMedioCampo} ${fParticipacion} ${pDisciplina} ${pFisico}`);
// console.log(`${fBruto} ${mayFBruto} ${pBruto}`); */
//       // Valor del jugador total
//       // cant = a la cantidad echa por un usuario particular
//       // may = Es la mayor cantidad echa por un usuario entre todos
//       // f = ecuacion aplicada
//       // p = Puntaje -> este valor se puede mostrar y queda valorizados entre el 0 y el 100
//       // const subTotal = pBruto * pFisico / 100
//       const fTotal = ((fPelotaParada + fDefensa + fPortero + fAtaque + fMedioCampo + fParticipacion + pDisciplina) /  7) * pFisico / 100;
//       let pTotal = (fTotal * 100) / mayFTotal;
// 	  // console.log(`${fTotal} ${mayFTotal} ${pTotal}`);

//       // console.log(`${fTotal} ${mayFTotal} ${pTotal}`);
//       // Etiquetas
//       // e = etiqueta
//       var arrayJugador = new Array();
//       let eAtaque = "";
//       let ePelotaParada = "";
//       let eMedioCampo = "";
//       let eParticipacion = "";
//       let eDefensa = "";
//       let eDiciplina = "";
//       let ePortero = "";

//       // Ataque

//       const aboveAverage = 50;

//       switch (true) {
//         case aboveAverage < Math.round(pEfectividadTiro):
//           eAtaque = "Caza Goles";
//           //console.log(playersJSON[i].info.name + " cazagoles");
//           break;
//         case aboveAverage < pReferencia:
//           eAtaque = "Referente";
//           break;
//         case aboveAverage < pFinalizacion:
//           eAtaque = "Hombre de area";
//           //console.log(playersJSON[i].info.name + " hombre de area");
//           break;
//         case aboveAverage < pPunteria:
//           eAtaque = "Francotirador";
//           break;
//         case aboveAverage < pDisparo:
//           eAtaque = "Cañonero";
//           break;
//       }

//       // Pelota Parada

//       switch (50) {
//         case 50 < pProvocador:
//           ePelotaParada = "Incitador";
//           break;
//         case 50 < (pMalicia + pPresencia) / 2:
//           ePelotaParada = "Lanzador";
//           break;
//       }

//       // Medio Campo
//       switch (50) {
//         case 50 < pEfectividadPase:
//           eMedioCampo = "Servidor";
//           break;
//         case 50 < pCreacion:
//           eMedioCampo = "Circulador";
//           break;
//         case 50 < pCorredor:
//           eMedioCampo = "Apoyo";
//           break;
//         case 50 < pSeguridad:
//           eMedioCampo = "Confiable";
//           break;
//         case 50 < pPase:
//           eMedioCampo = "Reboleador";
//           break;
//       }

//       // Participacion
//       switch (50) {
//         case 50 < pIncidencia:
//           eParticipacion = "Omnipresente";
//           break;
//         case 50 < pPosecionBalon:
//           eParticipacion = "Mago del Balon";
//           break;
//         case 50 < pMovilidad:
//           eParticipacion = "Correcaminos";
//           break;
//       }

//       // Defensa
//       switch (50) {
//         case 50 < pRecuperacion:
//           eDefensa = "Baluarte";
//           break;
//         case 50 < pPrediccion:
//           eDefensa = "Augurador";
//           break;
//         case 50 < pAnticipacion:
//           eDefensa = "Cortador";
//           break;
//         case 50 < pBarrida:
//           eDefensa = "Hachador";
//           break;
//         case 50 < pIntercepcion:
//           eDefensa = "Obsructor";
//           break;
//       }
//       // Diciplina
//       switch (50) {
//         case 50 < pRojas:
//           eDiciplina = "Asesino";
//           break;
//         case 50 < pAmarrillas:
//           eDiciplina = "Lesionador";
//           break;
//         case 50 < pFaltas:
//           eDiciplina = "Golpeador";
//           break;
//       }
//       // Portero
//       switch (50) {
//         case 50 < pCobertura:
//           ePortero = "Protector";
//           break;
//         case 50 < pAgarre:
//           ePortero = "Aferracion";
//           break;
//         case 50 < pTapadas:
//           ePortero = "Intuitivo";
//           break;
//       }

// 	// Bonificacion (solo se usa por partido)

// 	const premio = playersJSON[i].statistics.goals + playersJSON[i].statistics.assists;

//     if (premio == 1 && pTotal < 60) pTotal = 60;
//     if (premio == 2 && pTotal < 70) pTotal = 70;
//     if (premio > 2 && pTotal < 80) pTotal =80;
//    if ((cantPartidos * 100 / mayFJugadoTotal < 30) && ( fTotal * 100 / promTotal < 40 ) && (premio == 0)) {
// 		  pTotal = "sin valorizar";
// 	  }

// 	console.log(`${premio} ${playersJSON[i].statistics.goals} ${playersJSON[i].statistics.assists} ${pTotal}`);
//       // Globales

//       let pusharray = {
//         Nombre: playersJSON[i].info.name,
//         Equipo: playersJSON[i].info.team,
//         Etiquetas: [],
//         Ataque: pAtaque,
//         Parada: pPelotaParada,
//         MedioCampo: pMedioCampo,
//         Participacion: pParticipacion,
//         Defensa: pDefensa,
//         Disciplina: pDisciplina,
//         Portero: pPortero,
//         Fisico: pFisico,
//         Puntaje: fBruto,
//         Torneo: fTotal,
//         Total: pTotal,
//       };
//       arrayJugador.push(pusharray);

//       if (pFinalizacion > 50 && pReferencia > 50 && pPase > 50) {
//         arrayJugador[0].Etiquetas.push("Creador de Jugadas");
//       }
//       if ((pFinalizacion + pIntercepcion + pDisparo) / 3 > 50) {
//         arrayJugador[0].Etiquetas.push("Extremo Polifico");
//       }
//       if (pSeguridad > 50 && pMovilidad < 50 && pPortero == 0) {
//         arrayJugador[0].Etiquetas.push("Diez Clasico");
//       }
//       if (pPase > 50 && pFinalizacion > 50) {
//         arrayJugador[0].Etiquetas.push("Jugador de Huecos");
//       }
//       if (pBarrida > 50 && pIntercepcion > 50) {
//         arrayJugador[0].Etiquetas.push("El Destructor");
//       }
//       if (pPrediccion > 50 && pRecuperacion > 50) {
//         arrayJugador[0].Etiquetas.push("Medio Escudo");
//       }
//       if (pIntercepcion > 50 && pPase > 50) {
//         arrayJugador[0].Etiquetas.push("Creacion");
//       }
//       if (pBanda > 50 && pFinalizacion > 50) {
//         arrayJugador[0].Etiquetas.push("Lateral Ofensivo");
//       } else if (pPase > 50 && pPrediccion > 50) {
//         arrayJugador[0].Etiquetas.push("Lateral Defensivo");
//       }

//       if (pRecuperacion > 50 && pFinalizacion > 50) {
//         arrayJugador[0].Etiquetas.push("Atacante Extra");
//       }
//       if (pTapadas > 50 && (pEfectividadPase > 0 || pEfectividadTiro > 0)) {
//         arrayJugador[0].Etiquetas.push("Portero Ofensivo");
//       } else if (pTapadas > 50 && pMovilidad < 25) {
//         arrayJugador[0].Etiquetas.push("Portero defensivo");
//       }
//       // console.log(`Puntaje Debug: ${pBruto} =
//       // const fBruto = (${fBruto} * 100) / ${mayFBruto};
//       // (${fPelotaParada} +
//       //   ${fDefensa} +
//       //   ${fPortero} +
//       //   ${fAtaque} +
//       //   ${fMedioCampo} +
//       //   ${fParticipacion} +
//       //   ${pDisciplina}) /
//       // 7;`);
//       console.log(arrayJugador[0]);
//       eGeneral.push(arrayJugador);
//     }

// let equipo1 = String(eGeneral[0][0].Equipo);

//     embed = new Discord.MessageEmbed()
//       .setTitle(`${eGeneral[0][0].Equipo} Stats`)
//       .setColor("blue")
//       .setThumbnail(`https://stats.iosoccer-sa.bid/clubs/${clublist[
//             equipo1
//           ].toLowerCase()}.png`);

//     embed2 = new Discord.MessageEmbed().setColor("red");

//     let MGcounter = 1;
//     let rivalcounter = 1;
//     for (let i = 0; i < eGeneral.length; i++) {

// 		if (String(eGeneral[i][0].Equipo) == equipo1) {
// 			if (String(eGeneral[i][0].Total) == "sin valorizar"){
// 				embed.addField(`${getEmoji(MGcounter)} ${eGeneral[i][0].Nombre}`, `sin valorizar`);
// 			} else {
// 				embed.addField(`${getEmoji(MGcounter)} ${eGeneral[i][0].Nombre}`, `${Math.round(eGeneral[i][0].Total) / 10}`);
// 			}
//         MGcounter += 1;
//       } else {
//         let teamname = String(eGeneral[i][0].Equipo);
//          if (String(eGeneral[i][0].Total) == "sin valorizar"){
// 			 embed2.addField(`${getEmoji(rivalcounter)} ${eGeneral[i][0].Nombre}`, `sin valorizar`);
// 		 } else {
// 			 embed2.addField(
//           `${getEmoji(rivalcounter)} ${eGeneral[i][0].Nombre}`,
//           `${Math.round(eGeneral[i][0].Total) / 10}`
//         );
// 		 }

//         embed2.setThumbnail(
//           `https://stats.iosoccer-sa.bid/clubs/${clublist[
//             teamname
//           ].toLowerCase()}.png`
//         );
//         embed2.setTitle(`${eGeneral[i][0].Equipo} Stats`);
//         rivalcounter += 1;
//       }
//     }
//    /* embed = new Discord.MessageEmbed()
//       .setTitle(`MG Stats`)
//       .setColor("orange")
//       .setThumbnail(`https://stats.iosoccer-sa.bid/clubs/mg.png`);

//     embed2 = new Discord.MessageEmbed().setColor("red");

//     let MGcounter = 1;
//     let rivalcounter = 1;
//     for (let i = 0; i < eGeneral.length; i++) {
//       if (eGeneral[i][0].Equipo == "Meteors Gaming") {
//         embed.addField(
//           `${getEmoji(MGcounter)} ${eGeneral[i][0].Nombre}`,
//           `${Math.round(eGeneral[i][0].Total) / 10}`
//         );
//         MGcounter += 1;
//       } else {
//         let teamname = String(eGeneral[i][0].Equipo);
//         embed2.addField(
//           `${getEmoji(rivalcounter)} ${eGeneral[i][0].Nombre}`,
//           `${Math.round(eGeneral[i][0].Total) / 10}`
//         );
//         // embed2.setThumbnail(
//         //   `https://stats.iosoccer-sa.bid/clubs/${clublist[
//         //     teamname
//         //   ].toLowerCase()}.png`
//         // );
//         embed2.setTitle(`${eGeneral[i][0].Equipo} Stats`);
//         rivalcounter += 1;
//       }
//     }*/

//     //console.log(matchJSON);
//     message.channel.send(embed).then((embedMessage) => {
//       embedMessage.react("1️⃣");
//       embedMessage.react("2️⃣");
//       embedMessage.react("3️⃣");
//       embedMessage.react("4️⃣");
//       embedMessage.react("5️⃣");
//       embedMessage.react("6️⃣");
//       embedMessage.react("7️⃣");
//     });
//     message.channel.send(embed2).then((embedMessage) => {
//       embedMessage.react("1️⃣");
//       embedMessage.react("2️⃣");
//       embedMessage.react("3️⃣");
//       embedMessage.react("4️⃣");
//       embedMessage.react("5️⃣");
//       embedMessage.react("6️⃣");
//       embedMessage.react("7️⃣");
//     });

//     message.delete({ timeout: 1 });
//   },
// };
