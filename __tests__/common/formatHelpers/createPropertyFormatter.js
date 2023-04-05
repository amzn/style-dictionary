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

const createPropertyFormatter = require('../../../lib/common/formatHelpers/createPropertyFormatter');
const createDictionary = require('../../../lib/utils/createDictionary');

const properties = {
  color: {
    red: {
      name: "color-red",
      value: "#FF0000",
      comment: "Foo bar qux",
      attributes: {
        category: "color",
        type: "red",
      },
      path: [
        "color",
        "red",
      ]
    },
    blue: {
      name: "color-blue",
      value: "#0000FF",
      comment: "Foo\nbar\nqux",
      attributes: {
        category: "color",
        type: "blue",
      },
      path: [
        "color",
        "blue",
      ]
    }
  }
};
const dictionary = createDictionary({ properties });

describe('common', () => {
  describe('createPropertyFormatter', () => {
    it(`should default to putting comment next to the output value`, () => {
      // long commentStyle
      const cssFormatter = createPropertyFormatter({ format: 'css', dictionary });
      // short commentStyle
      const sassFormatter = createPropertyFormatter({ format: 'sass', dictionary });

      // red = single-line comment, blue = multi-line comment
      const cssRed = cssFormatter(dictionary.tokens.color.red);
      const cssBlue = cssFormatter(dictionary.tokens.color.blue);
      const sassRed = sassFormatter(dictionary.tokens.color.red);
      const sassBlue = sassFormatter(dictionary.tokens.color.blue);

      // Note that since CSS puts it inside a selector, there is an indentation of 2 spaces as well
      // CSS also has commentStyle long, whereas sass uses short
      expect(cssRed).toEqual('  --color-red: #FF0000; /* Foo bar qux */');
      expect(cssBlue).toEqual(`  /**
   * Foo
   * bar
   * qux
   */
  --color-blue: #0000FF;`);

      expect(sassRed).toEqual('$color-red: #FF0000; // Foo bar qux');
      expect(sassBlue).toEqual(`// Foo
// bar
// qux
$color-blue: #0000FF;`);
    });
  });
});