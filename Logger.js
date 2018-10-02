const colors = require('colors/safe');

function Log(tag, message, colorWrap = colors.white) {
  console.log(colorWrap("[" + tag + "] ") + message)
}

module.exports = Log