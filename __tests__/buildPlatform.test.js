/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var assert = require('chai').assert;
var helpers = require('./__helpers');
var StyleDictionary = require('../index');

var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
var StyleDictionaryExtended = StyleDictionary.extend(config);

describe('buildPlatform', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  it('should throw if passed a platform that doesn\'t exist', () => {
    assert.throws(
      StyleDictionaryExtended.buildPlatform.bind(test, 'foobar'),
      Error,
      'Platform foobar doesn\'t exist'
    );

    assert.doesNotThrow(function() {
      StyleDictionaryExtended.buildPlatform('web');
    });
  });

  it('should build web platform files', () => {
    StyleDictionaryExtended.buildPlatform('web');
    assert(helpers.fileExists('./__tests__/output/web/_icons.css'));
    assert(helpers.fileExists('./__tests__/output/web/_styles.js'));
    assert(helpers.fileExists('./__tests__/output/web/_variables.css'));
  });

  it('should build scss platform files', () => {
    StyleDictionaryExtended.buildPlatform('scss');
    assert(helpers.fileExists('./__tests__/output/scss/_icons.scss'));
    assert(helpers.fileExists('./__tests__/output/scss/_variables.scss'));
  });

  it('should build less platform files', () => {
    StyleDictionaryExtended.buildPlatform('less');
    assert(helpers.fileExists('./__tests__/output/less/_icons.less'));
    assert(helpers.fileExists('./__tests__/output/less/_variables.less'));
  });

  it('should do android stuff', () => {
    StyleDictionaryExtended.buildPlatform('android');
    assert(helpers.fileExists('./__tests__/output/android/main/res/drawable-hdpi/flag_us.png'));
    assert(helpers.fileExists('./__tests__/output/android/main/res/drawable-xhdpi/flag_us.png'));
    assert(helpers.fileExists('./__tests__/output/android/colors.xml'));
    assert(helpers.fileExists('./__tests__/output/android/dimens.xml'));
    assert(helpers.fileExists('./__tests__/output/android/font_dimen.xml'));
  });

  it('should do ios stuff', () => {
    StyleDictionaryExtended.buildPlatform('ios');
    assert(helpers.fileExists('./__tests__/output/ios/style_dictionary.plist'));
    assert(helpers.fileExists('./__tests__/output/ios/style_dictionary.h'));
  });

  it('should handle non-string values in properties', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/nonString.json'],
      platforms: {
        test: {
          buildPath: "__tests__/output/",
          transforms: ["attribute/cti","size/px","color/hex"],
          files: [
            {
              "destination": "output.json",
              "format": "json"
            }
          ]
        }
      }
    });
    StyleDictionaryExtended.buildPlatform('test');
    assert(helpers.fileExists('./__tests__/output/output.json'));
    // var input = helpers.fileToJSON('./__tests__/__properties/nonString.json');
    var output = helpers.fileToJSON('./__tests__/output/output.json');

    // Make sure transforms run on non-string values as they normally would
    assert.equal(output.color.red.value, output.color.otherRed.value);
    assert.equal(output.color.red.value, "#ff0000");
    assert.equal(output.size.large.value, output.size.otherLarge.value);
    assert.equal(output.size.large.value, "20px");

    // Make sure
    assert.equal(output.number.test.value, output.number.otherTest.value);
    assert.isNumber(output.number.otherTest.value);
    assert.deepEqual(output.array.test.value, output.array.otherTest.value);
    assert.isArray(output.array.otherTest.value);
    assert.deepEqual(output.object.test.value, output.object.otherTest.value);
    assert.isObject(output.object.otherTest.value);
  });

  it('should handle non-property nodes', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/nonPropertyNode.json'],
      platforms: {
        test: {
          buildPath: "__tests__/output/",
          transformGroup: "scss",
          files: [
            {
              "destination": "output.json",
              "format": "json"
            }
          ]
        }
      }
    });
    StyleDictionaryExtended.buildPlatform('test');
    assert(helpers.fileExists('./__tests__/output/output.json'));
    var input = helpers.fileToJSON('./__tests__/__properties/nonPropertyNode.json');
    var output = helpers.fileToJSON('./__tests__/output/output.json');
    assert.deepEqual(output.color.key1, input.color.key1);
    assert.deepEqual(output.color.base.red.key2, input.color.base.red.key2);
    assert.equal(output.color.base.attributes.key3, input.color.base.attributes.key3);
  });

  it('should handle comments', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/comment.json'],
      platforms: {
        test: {
          buildPath: "__tests__/output/",
          transformGroup: "scss",
          files: [
            {
              "destination": "output.json",
              "format": "json"
            }
          ]
        }
      }
    });
    StyleDictionaryExtended.buildPlatform('test');
    assert(helpers.fileExists('./__tests__/output/output.json'));
    var input = helpers.fileToJSON('./__tests__/__properties/comment.json');
    var output = helpers.fileToJSON('./__tests__/output/output.json');
    assert.deepEqual(output.size.large.comment, input.size.large.comment);
  });

  test(
    'should throw an error if given a transformGroup that doesn\'t exist',
    () => {
      var StyleDictionaryExtended = StyleDictionary.extend({
        source: ['__properties/**/*.json'],
        platforms: {
          test: {
            transformGroup: 'test',
            files: [{
              destination: '__tests__/output/test.css',
              format: 'css/variables'
            }]
          }
        }
      });
      assert.throws(
        StyleDictionaryExtended.buildPlatform.bind(test, 'test'),
        Error,
        'transformGroup test doesn\'t exist'
      );
    }
  );
});
