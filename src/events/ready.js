const CalendarManager = require(`${appRoot}/utils/Teams/CalendarManager.js`);

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await CalendarManager.syncMatches();
    console.log("Ready event on!");
    console.log(client.user);
  },
};
