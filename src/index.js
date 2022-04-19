const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { Settings, DateTime } = require("luxon");
Settings.defaultZone = "America/Argentina/Buenos_Aires";
global.appRoot = path.resolve(__dirname);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  disableEveryone: false,
});

// Global Variables
client.commands = new Collection();
client.config = require("./Config/config.json");

const functions = fs
  .readdirSync(path.join(__dirname, "functions"))
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

// Initializing the project
//require("./handler.js")(client);

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, path.join(__dirname, "events"));
  client.handleCommands(commandFolders, path.join(__dirname, "commands"));
  client.handleMatchmaking(client);
  client.login(client.config.token);
})();

//client.login(client.config.token);
