function fileHeaderCSS() {
  return `/**
  * Do not edit directly
  * Generated on ${new Date().toUTCString()}
  */\n\n`;
}

function fileHeaderString() {
  return `Do not edit directly, Generated on ${new Date().toUTCString()}`;
}

module.exports = {
  fileHeaderCSS,
  fileHeaderString
}
