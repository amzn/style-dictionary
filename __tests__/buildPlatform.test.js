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

var helpers = require('./__helpers');
var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
var StyleDictionary = require('../index');
var StyleDictionaryExtended = StyleDictionary.extend(config);

describe('buildPlatform', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  it('should throw if passed a platform that doesn\'t exist', () => {
    expect(
      StyleDictionaryExtended.buildPlatform.bind(test, 'foobar')
    ).toThrow('Platform "foobar" does not exist');

    expect(
      function() {
        StyleDictionaryExtended.buildPlatform('web');
      }
    ).not.toThrow();
  });

  it('should build web platform files', () => {
    StyleDictionaryExtended.buildPlatform('web');
    expect(helpers.fileExists('./__tests__/__output/web/_icons.css')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/web/_styles.js')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/web/_variables.css')).toBeTruthy();
  });

  it('should build scss platform files', () => {
    StyleDictionaryExtended.buildPlatform('scss');
    expect(helpers.fileExists('./__tests__/__output/scss/_icons.scss')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/scss/_variables.scss')).toBeTruthy();
  });

  it('should build less platform files', () => {
    StyleDictionaryExtended.buildPlatform('less');
    expect(helpers.fileExists('./__tests__/__output/less/_icons.less')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/less/_variables.less')).toBeTruthy();
  });

  it('should do android stuff', () => {
    StyleDictionaryExtended.buildPlatform('android');
    expect(helpers.fileExists('./__tests__/__output/android/main/res/drawable-hdpi/flag_us.png')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/android/main/res/drawable-xhdpi/flag_us.png')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/android/colors.xml')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/android/dimens.xml')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/android/font_dimen.xml')).toBeTruthy();
  });

  it('should do ios stuff', () => {
    StyleDictionaryExtended.buildPlatform('ios');
    expect(helpers.fileExists('./__tests__/__output/ios/style_dictionary.plist')).toBeTruthy();
    expect(helpers.fileExists('./__tests__/__output/ios/style_dictionary.h')).toBeTruthy();
  });

  it('should handle non-string values in properties', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/nonString.json'],
      platforms: {
        test: {
          buildPath: "__tests__/__output/",
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
    expect(helpers.fileExists('./__tests__/__output/output.json')).toBeTruthy();
    // var input = helpers.fileToJSON('./__tests__/__properties/nonString.json');
    var output = helpers.fileToJSON('./__tests__/__output/output.json');

    // Make sure transforms run on non-string values as they normally would
    expect(output).toHaveProperty('color.red.value', output.color.otherRed.value);
    expect(output).toHaveProperty('color.red.value', "#ff0000");
    expect(output).toHaveProperty('size.large.value', output.size.otherLarge.value);
    expect(output).toHaveProperty('size.large.value', "20px");

    expect(output.number.test.value).toEqual(output.number.otherTest.value);
    expect(typeof output.number.otherTest.value).toBe('number');
    expect(output.array.test.value).toEqual(output.array.otherTest.value);
    expect(Array.isArray(output.array.otherTest.value)).toBeTruthy();
    expect(output.object.test.value).toMatchObject(output.object.otherTest.value);
    expect(typeof output.object.otherTest.value).toBe('object');
  });

  it('should handle non-property nodes', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/nonPropertyNode.json'],
      platforms: {
        test: {
          buildPath: "__tests__/__output/",
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
    expect(helpers.fileExists('./__tests__/__output/output.json')).toBeTruthy();
    var input = helpers.fileToJSON('./__tests__/__properties/nonPropertyNode.json');
    var output = helpers.fileToJSON('./__tests__/__output/output.json');
    expect(output.color.key1).toEqual(input.color.key1);
    expect(output.color.base.red.key2).toEqual(input.color.base.red.key2);
    expect(output.color.base.attributes.key3).toEqual(input.color.base.attributes.key3);
  });

  it('should handle comments', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__tests__/__properties/comment.json'],
      platforms: {
        test: {
          buildPath: "__tests__/__output/",
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
    expect(helpers.fileExists('./__tests__/__output/output.json')).toBeTruthy();
    var input = helpers.fileToJSON('./__tests__/__properties/comment.json');
    var output = helpers.fileToJSON('./__tests__/__output/output.json');
    expect(output.size.large.comment).toEqual(input.size.large.comment);
  });

  it('should throw an error if given a transformGroup that doesn\'t exist', () => {
    var StyleDictionaryExtended = StyleDictionary.extend({
      source: ['__properties/**/*.json'],
      platforms: {
        foo: {
          transformGroup: 'bar',
          files: [{
            destination: '__tests__/__output/test.css',
            format: 'css/variables'
          }]
        }
      }
    });

    let err = `
Unknown transformGroup "bar" found in platform "foo":
"bar" does not match the name of a registered transformGroup.
`;

    expect(
      StyleDictionaryExtended.buildPlatform.bind(StyleDictionaryExtended, 'foo')
    ).toThrow(err);
  });

});
