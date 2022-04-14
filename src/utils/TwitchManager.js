const tmi = require("tmi.js");
const config = require(`${appRoot}/Config/config.json`);

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

module.exports = {
  ping,
  title,
};