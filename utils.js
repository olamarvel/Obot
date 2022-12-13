const { onwer } = require("./const.js");
function sendHelpSuport(message) {
  message.reply("Error occured while validating user");
  message.reply(
    "pls try again if problem persist /n try speaking to a human"
  );
  message.reply(constants.onwer);
}

function sendCommandNotSupported(message) {
  message.reply("your messgage or command is not support ");
  message.reply("check below to see a short list ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("type {_blank_} to  .| ");
  message.reply("visit www.olamarvel.com/bot/command .| ");
  message.reply("Or just type help me pls .| ");
}

/**
 *
 * @param {String} string
 * @returns {Array} commands
 */
function sanitizeMessage(string = "") {
  let D = string.trim().toLowerCase();
  if (!D.startsWith("!")) return false;
  D = D.substring(1);
  return D.split("_");
}

module.exports = {
  sendCommandNotSupported,
  sendHelpSuport,
  sanitizeMessage,
};
