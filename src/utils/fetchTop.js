const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();

function fetchTop(messages, user, mode) {
  var arr = [];
  var counter = 0;
  var totalELO = 0;

  var userDate = messages[user.replace(/[^0-9\.]+/g, "")].lastMatch;
  if (userDate == 0) userDate = "2022-01-01";

  var lastDate = userDate.split("-");
  console.log(`${userDate} / ${lastDate}`);

  if (mode != "leaderboard") {
    if (lastDate[2] != "2022") {
      return 0;
    }

    if (lastDate[1] == month) {
      if (Number(day) - Number(lastDate[0]) >= 13) {
        return 0;
      }
    } else {
      return 0;
    }
  }

  for (var key in messages) {
    if (messages.hasOwnProperty(key)) {
      var val = messages[key];
      //console.log(val.lastMatch);
      if (!val.lastMatch) continue;
      var lastDate = val.lastMatch.split("-");

      if (mode != "GK") {
        totalELO = val.ELO;
      } else {
        totalELO = val.ELOGK;
      }

      // TESTING
      /*console.log(
        `Array month: ${lastDate[1]} / day: ${lastDate[0]} -- Current month: ${month} / current day: ${day}`
      );*/
      if (lastDate[2] != "2022") {
        continue;
      }

      if (lastDate[1] == month) {
        if (Number(day) - Number(lastDate[0]) >= 13) {
          continue;
        }
      } else {
        continue;
      }
      // TESTING

      arr.splice(counter, 0, {
        id: counter,
        ping: val.ping,
        ELO: totalELO,
      });
      counter += 1;
    }
  }

  var aux;
  for (var i = 0; i < counter - 1; i++) {
    for (var j = 0; j < counter - 1; j++) {
      if (arr[j].ELO < arr[j + 1].ELO) {
        aux = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = aux;
      }
    }
  }

  var topindex = 0;
  var centinela = 0;
  var z = 0;

  if (mode == "leaderboard") {
    console.log("leaderboard");
    return arr;
  }

  do {
    if (`<@${user}>` === arr[z].ping) {
      centinela = 1;
    } else {
      z++;
      topindex++;
    }
  } while (centinela == 0);

  return topindex + 1;
}

exports.fetchTop = fetchTop;
