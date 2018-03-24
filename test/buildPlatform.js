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

  it('should build web platform files', function() {
    test.buildPlatform('web');
    assert(helpers.fileExists('./test/output/web/_icons.css'));
    assert(helpers.fileExists('./test/output/web/_styles.js'));
    assert(helpers.fileExists('./test/output/web/_variables.css'));
  });

  it('should build scss platform files', function() {
    test.buildPlatform('scss');
    assert(helpers.fileExists('./test/output/scss/_icons.scss'));
    assert(helpers.fileExists('./test/output/scss/_variables.scss'));
  });

  it('should build less platform files', function() {
    test.buildPlatform('less');
    assert(helpers.fileExists('./test/output/less/_icons.less'));
    assert(helpers.fileExists('./test/output/less/_variables.less'));
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
    test.buildPlatform('test');
    assert(helpers.fileExists('./test/output/output.json'));
    // var input = helpers.fileToJSON('./test/properties/nonString.json');
    var output = helpers.fileToJSON('./test/output/output.json');

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
