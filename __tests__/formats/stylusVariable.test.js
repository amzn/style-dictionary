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

var formats = require('../../lib/common/formats');
var stylus = require('stylus');
const createDictionary = require('../../lib/utils/createDictionary');
const createFormatArgs = require('../../lib/utils/createFormatArgs');

var file = {
  "destination": "__output/",
  "format": "stylus/variables",
  "name": "foo"
};

const propertyName = "color-base-red-400";
const propertyValue = "#EF5350";

const properties = {
  color: {
    base: {
      red: {
        400: {
          "name": propertyName,
          "value": propertyValue,
          "original": {
            "value": propertyValue
          },
          "attributes": {
            "category": "color",
            "type": "base",
            "item": "red",
            "subitem": "400"
          },
          "path": [
            "color",
            "base",
            "red",
            "400"
          ]
        }
      }
    }
  }
};

const formatter = formats['stylus/variables'].bind(file);
const dictionary = createDictionary({ properties });

describe('formats', () => {
  describe('stylus/variables', () => {

    it('should have a valid stylus syntax', () => {
      const stylusArguments = createFormatArgs({
        dictionary,
        file,
        platform: {}
      });
      stylus.render(formatter(stylusArguments, {}, file),
        function (err, css) {
          if (err) {
            throw new Error(err);
          }
          expect(css).toBeDefined();
        });
    });

  });
});
