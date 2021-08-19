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

// `.getReferences` is bound to a dictionary object, so to test it we will
// create a dictionary object and then call `.getReferences` on it.
const createDictionary = require('../../../lib/utils/createDictionary');

const properties = {
  color: {
    red: { value: "#f00" },
    danger: { value: "{color.red.value}" }
  },
  size: {
    border: { value: "2px" }
  },
  border: {
    primary: {
      // getReferences should work on objects like this:
      value: {
        color: "{color.red.value}",
        width: "{size.border.value}",
        style: "solid"
      },
    },
    secondary: {
      // and objects that have a non-string
      value: {
        color: "{color.red.value}",
        width: 2,
        style: "solid"
      }
    },
    tertiary: {
      // getReferences should work on interpolated values like this:
      value: "{size.border.value} solid {color.red.value}"
    }
  }
}

const dictionary = createDictionary({ properties });

describe('utils', () => {
  describe('reference', () => {
    describe('getReferences()', () => {
      it(`should return an empty array if the value has no references`, () => {
        expect(dictionary.getReferences(properties.color.red.value)).toEqual([]);
      });

      it(`should work with a single reference`, () => {
        expect(dictionary.getReferences(properties.color.danger.value)).toEqual(
          expect.arrayContaining([
            {value: "#f00"}
          ])
        );
      });

      it(`should work with object values`, () => {
        expect(dictionary.getReferences(properties.border.primary.value)).toEqual(
          expect.arrayContaining([
            {value: "2px"},
            {value: "#f00"}
          ])
        );
      });

      it(`should work with objects that have numbers`, () => {
        expect(dictionary.getReferences(properties.border.secondary.value)).toEqual(
          expect.arrayContaining([
            {value: "#f00"}
          ])
        );
      });

      it(`should work with interpolated values`, () => {
        expect(dictionary.getReferences(properties.border.tertiary.value)).toEqual(
          expect.arrayContaining([
            {value: "2px"},
            {value: "#f00"}
          ])
        );
      });
    });
  });
});
