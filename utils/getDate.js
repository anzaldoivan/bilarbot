const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");

function getDate(week) {
  const startDate = DateTime.fromISO(week);
  const currentDate = DateTime.fromISO(DateTime.now());
  const interval = Interval.fromDateTimes(startDate, currentDate);
  const dateDifference = Math.trunc(interval.length("weeks"));
  return dateDifference;
}

exports.getDate = getDate;
