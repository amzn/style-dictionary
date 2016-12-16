var fs = require('fs'),
    _  = require('lodash');

var androidColors     = fs.readFileSync(__dirname + '/templates/android/colors.template'),
    androidDimens     = fs.readFileSync(__dirname + '/templates/android/dimens.template'),
    androidFontDimens = fs.readFileSync(__dirname + '/templates/android/fontDimens.template'),
    androidIntegers   = fs.readFileSync(__dirname + '/templates/android/integers.template'),
    androidStrings    = fs.readFileSync(__dirname + '/templates/android/strings.template'),
    iosHeaders        = fs.readFileSync(__dirname + '/templates/ios/headers.template'),
    iosPlist          = fs.readFileSync(__dirname + '/templates/ios/plist.template');

module.exports = {
  'android/colors':     _.template(androidColors),
  'android/dimens':     _.template(androidDimens),
  'android/fontDimens': _.template(androidFontDimens),
  'android/integers':   _.template(androidIntegers),
  'android/strings':    _.template(androidStrings),
  'ios/headers':        _.template(iosHeaders),
  'ios/plist':          _.template(iosPlist)
};
