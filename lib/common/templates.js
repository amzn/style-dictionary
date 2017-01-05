var fs = require('fs'),
    _  = require('lodash');

module.exports = {
  'android/colors': _.template(
    fs.readFileSync(__dirname + '/templates/android/colors.template')),
  'android/dimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/dimens.template')),
  'android/fontDimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/fontDimens.template')),
  'android/integers': _.template(
    fs.readFileSync(__dirname + '/templates/android/integers.template')),
  'android/strings': _.template(
    fs.readFileSync(__dirname + '/templates/android/strings.template')),
  'ios/headers': _.template(
    fs.readFileSync(__dirname + '/templates/ios/headers.template')),
  'ios/plist': _.template(
    fs.readFileSync(__dirname + '/templates/ios/plist.template')),
  'ios/singleton.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.m.template')),
  'ios/singleton.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.h.template'))
};
