const fs = require("fs");

async function eloCalculatorSK(result, playerlist, bonus, totalPlayers) {
  const messagesDB = await GetFromDB.getEverythingFrom("bilarbot", "users");
  const messages = messagesDB[0];
  homeelo = playerlist.Team1.elo;
  awayelo = playerlist.Team2.elo;
  //totalPlayers -= 1;

  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }

    var myChanceToWin =
      1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(32 * (myGameResult - myChanceToWin));
  }

  function getNewRating(myRating, opponentRating, myGameResult) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
  }

  // ACORDARSE POR FAVOR DE REEMPLAZAR EN LIST[I], EL VALOR DE I PARA QUE SEA IGUAL AL LENGHT
  // console.log(playerlist.Team1.list[i].lenght);

  if (result == 0.5) {
    // Home Calculation
    for (var i = 1; i < totalPlayers; i++) {
      console.log(
        "Current ELO value of" +
          playerlist.Team1.list[i].Name +
          "is: " +
          messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO
      );
      console.log(
        "New ELO value of" +
          playerlist.Team1.list[i].Name +
          "is: " +
          getNewRating(
            messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            awayelo,
            0.5
          )
      );
      messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
        getNewRating(
          messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO,
          awayelo,
          0.5
        );
      messages[
        playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
      ].draws += 1;
      messages[
        playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
      ].lastMatch = `${day}-${month}-${year}`;
    }
    // Away Calculation
    for (var i = 1; i < totalPlayers; i++) {
      console.log(
        "Current ELO value of" +
          playerlist.Team2.list[i].Name +
          "is: " +
          messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO
      );
      console.log(
        "New ELO value of" +
          playerlist.Team2.list[i].Name +
          "is: " +
          getNewRating(
            messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            awayelo,
            0.5
          )
      );
      messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
        getNewRating(
          messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO,
          homeelo,
          0.5
        );
      messages[
        playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
      ].draws += 1;
      messages[
        playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
      ].lastMatch = `${day}-${month}-${year}`;
    }
  } else {
    if (result == 1) {
      // Home Calculation
      for (var i = 1; i < totalPlayers; i++) {
        console.log(
          "Current ELO value of" +
            playerlist.Team1.list[i].Name +
            "is: " +
            messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO
        );
        console.log(
          "New ELO value of" +
            playerlist.Team1.list[i].Name +
            "is: " +
            getNewRating(
              messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO,
              awayelo,
              1
            )
        );
        messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
          getNewRating(
            messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            awayelo,
            1
          );
        if (bonus) {
          console.log(
            "ELO Boost detected. Before Boost: " +
              messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO
          );
          messages[
            playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
          ].ELO += 10;
        }
        messages[
          playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].wins += 1;
        messages[
          playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].lastMatch = `${day}-${month}-${year}`;
      }
      // Away Calculation
      for (var i = 1; i < totalPlayers; i++) {
        console.log(
          "Current ELO value of" +
            playerlist.Team2.list[i].Name +
            "is: " +
            messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO
        );
        console.log(
          "New ELO value of" +
            playerlist.Team2.list[i].Name +
            "is: " +
            getNewRating(
              messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO,
              awayelo,
              0
            )
        );
        messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
          getNewRating(
            messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            homeelo,
            0
          );
        messages[
          playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].losses += 1;
        messages[
          playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].lastMatch = `${day}-${month}-${year}`;
      }
    } else {
      // Home Calculation
      for (var i = 1; i < totalPlayers; i++) {
        console.log(
          "Current ELO value of" +
            playerlist.Team1.list[i].Name +
            "is: " +
            messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO
        );
        console.log(
          "New ELO value of" +
            playerlist.Team1.list[i].Name +
            "is: " +
            getNewRating(
              messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO,
              awayelo,
              0
            )
        );
        messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
          getNewRating(
            messages[playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            awayelo,
            0
          );
        messages[
          playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].losses += 1;
        messages[
          playerlist.Team1.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].lastMatch = `${day}-${month}-${year}`;
      }
      // Away Calculation
      for (var i = 1; i < totalPlayers; i++) {
        console.log(
          "Current ELO value of" +
            playerlist.Team2.list[i].Name +
            "is: " +
            messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO
        );
        console.log(
          "New ELO value of" +
            playerlist.Team2.list[i].Name +
            "is: " +
            getNewRating(
              messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO,
              awayelo,
              1
            )
        );
        messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")].ELO =
          getNewRating(
            messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
              .ELO,
            homeelo,
            1
          );
        if (bonus) {
          console.log(
            "ELO Boost detected. Before Boost: " +
              messages[playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")]
                .ELO
          );
          messages[
            playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
          ].ELO += 10;
        }
        messages[
          playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].wins += 1;
        messages[
          playerlist.Team2.list[i].Name.replace(/[^0-9\.]+/g, "")
        ].lastMatch = `${day}-${month}-${year}`;
      }
    }
  }

  messages[
    playerlist.Team1.list[0].Name.replace(/[^0-9\.]+/g, "")
  ].ELOGK *= 1.02;
  messages[
    playerlist.Team1.list[0].Name.replace(/[^0-9\.]+/g, "")
  ].lastMatch = `${day}-${month}-${year}`;

  fs.writeFileSync(
    "./src/Users/185191450013597696.json",
    JSON.stringify(messages),
    (err) => {
      if (err) {
        console.log(err);
        message.channel.send(err);
      }
    }
  );

  console.log("ELO Calculation finished correctly");
}

exports.eloCalculatorSK = eloCalculatorSK;
