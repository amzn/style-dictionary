var fs   = require('fs-extra'),
    glob = require('glob');

module.exports = {
  clearOutput: function() {
    fs.emptyDirSync('test/output');
  },

  fileToJSON: function(path) {
    return fs.readJsonSync(path);
  },

  fileExists: function(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (err) {
      return false;
    }
  }
};
