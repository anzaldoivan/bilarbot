const Discord = require("discord.js");
const { DateTime, Interval } = require("luxon");

function getDate(week) {
  const startDate = DateTime.fromISO(week);
  const currentDate = DateTime.fromISO(DateTime.now());
  const interval = Interval.fromDateTimes(startDate, currentDate);
  let dateDifference = Math.trunc(interval.length("weeks"));
  if (Number.isNaN(dateDifference)) {
    dateDifference = 0;
  } else {
    dateDifference++;
  }
  return dateDifference;
}

exports.getDate = getDate;
