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

var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('buildPlatform', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should throw if passed a platform that doesn\'t exist', function() {
    assert.throws(
      test.buildPlatform.bind(test, 'foobar'),
      Error,
      'Platform foobar doesn\'t exist'
    );

    assert.doesNotThrow(function() {
      test.buildPlatform('web');
    });
  });

  it('should build the proper files', function() {
    test.buildPlatform('web');
    assert(helpers.fileExists('./test/output/web/_icons.scss'));
    assert(helpers.fileExists('./test/output/web/_styles.js'));
    assert(helpers.fileExists('./test/output/web/_variables.scss'));
  });

  it('should do android stuff', function() {
    test.buildPlatform('android');
    assert(helpers.fileExists('./test/output/android/main/res/drawable-hdpi/flag_us.png'));
    assert(helpers.fileExists('./test/output/android/main/res/drawable-xhdpi/flag_us.png'));
    assert(helpers.fileExists('./test/output/android/colors.xml'));
    assert(helpers.fileExists('./test/output/android/dimens.xml'));
    assert(helpers.fileExists('./test/output/android/font_dimen.xml'));
  });

  it('should do ios stuff', function() {
    test.buildPlatform('ios');
    assert(helpers.fileExists('./test/output/ios/style_dictionary.plist'));
    assert(helpers.fileExists('./test/output/ios/style_dictionary.h'));
  });

  it('should handle non-string values in properties', function() {
    var test = StyleDictionary.extend({
      source: ['test/properties/nonString.json'],
      platforms: {
        test: {
          buildPath: "test/output/",
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
    test.buildPlatform('test');
    assert(helpers.fileExists('./test/output/output.json'));
    var input = helpers.fileToJSON('./test/properties/nonString.json');
    var output = helpers.fileToJSON('./test/output/output.json');
    assert.deepEqual(output.color.otherRed.value, input.color.red.value);
    assert.deepEqual(output.color.otherBlue.value, input.color.blue.value);
    assert.equal(output.size.otherLarge.value, input.size.large.value);
  });

  it('should handle non-property nodes', function() {
    var test = StyleDictionary.extend({
      source: ['test/properties/nonPropertyNode.json'],
      platforms: {
        test: {
          buildPath: "test/output/",
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
    test.buildPlatform('test');
    assert(helpers.fileExists('./test/output/output.json'));
    var input = helpers.fileToJSON('./test/properties/nonPropertyNode.json');
    var output = helpers.fileToJSON('./test/output/output.json');
    assert.deepEqual(output.color.comment, input.color.comment);
    assert.deepEqual(output.color.base.comment, input.color.base.comment);
    assert.equal(output.color.base.attributes.comment, input.color.base.attributes.comment);
  });
});
