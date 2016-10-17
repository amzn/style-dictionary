var fs   = require('fs'),
    glob = require('glob'),
    deepExtend = require('./deepExtend'),
    _    = require('lodash');

function combineJSON(arr, deep) {
  var i, files = [], to_ret = {};

  for (i = 0; i < arr.length; i++) {
    var new_files = glob.sync(arr[i], {});
    files = files.concat(new_files);
  }

  for (i = 0; i < files.length; i++) {
    var file_content = JSON.parse(fs.readFileSync(files[i], 'utf8'));
    if (deep) {
      deepExtend(to_ret, file_content);
    } else {
      _.extend(to_ret, file_content);
    }
  }

  return to_ret;
}

module.exports = combineJSON;
