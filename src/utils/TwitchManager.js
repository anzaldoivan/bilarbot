const tmi = require("tmi.js");
const config = require(`${appRoot}/Config/config.json`);
const clientID = config.twitch.id;
const clientSecret = config.twitch.secret;

const options = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: config.twitch.username,
    password: config.twitch.password,
  },
  channels: ["ios_sa", "ios_sa2"],
};

const client = new tmi.client(options);

client.connect();

client.on("connected", (address, port) => {
  client.action("ios_sa", `BilarBOT se ha conectado a Twitch correctamente.`);
});

client.on("chat", (target, ctx, message, self) => {
  // ignore messages from the bot
  if (self) return;

  const commandName = message.trim();

  console.log("DISPLAYING TARGET");
  console.log(target);
  console.log(ctx);

  if (commandName === "hello") {
    client.say(target, `Welcome ${ctx.username}!`);
  } else if (commandName === "!game") {
    client.action("fazttechtest", "fazt is playing Hacknet.");
  } else if (commandName === "!dice") {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
  }
});

function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function ping(target) {
  client.say(target, `Ping!`);
}

function title(interaction, target, tournament, home, away) {
  client.say(target, `!title [${tournament}] ${home} vs ${away}`);
  interaction.followUp(
    `El titulo del canal ${target} se ha cambiado a [${tournament}] ${home} vs ${away} correctamente.`
  );
}

function getTwitchAuthorization() {
  let url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;

  return fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

async function getData(endpoint) {
  let authorizationObject = await getTwitchAuthorization();
  let { access_token, expires_in, token_type } = authorizationObject;

  //token_type first letter must be uppercase
  token_type =
    token_type.substring(0, 1).toUpperCase() +
    token_type.substring(1, token_type.length);

  let authorization = `${token_type} ${access_token}`;

  let headers = {
    authorization,
    "Client-Id": clientID,
  };

  fetch(endpoint, {
    headers,
  })
    .then((res) => res.json())
    .then((data) => showData(data));
}

function showData(data) {
  console.log(data);
}

async function createPrediction(target, title, home, away) {
  const settings = {
    method: "POST",
    headers: {
      Authorization: "Bearer 2cgpxpkl0dcozpys2m0ssre85gtwyf",
      "Client-Id": "uo6dggojyb8d6soh92zknwmi5ej1q2",
      "Content-Type": "application/json",
    },
    body: {
      broadcaster_id: "141981764",
      title: title,
      outcomes: [
        {
          title: home,
        },
        {
          title: away,
        },
      ],
      prediction_window: 180,
    },
  };
  try {
    await getData("https://api.twitch.tv/helix/streams");
    await getData("https://api.twitch.tv/helix/users");
    const fetchResponse = await fetch(
      `https://api.twitch.tv/helix/predictions`,
      settings
    );
    const data = await fetchResponse.json();
    console.log(data);
    return data;
  } catch (e) {
    return e;
  }
}

module.exports = {
  ping,
  title,
  createPrediction,
};
