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
var scss = require('node-sass');
var _ = require('lodash');

var dictionary = {
  "properties": {
    "size": {
      "font": {
        "small": {
          "value": "12rem",
          "original": {
            "value": "12px"
          },
          "name": "size-font-small",
          "attributes": {
            "category": "size",
            "type": "font",
            "item": "small"
          },
          "path": [
            "size",
            "font",
            "small"
          ]
        },
        "large": {
          "value": "18rem",
          "original": {
            "value": "18px"
          },
          "name": "size-font-large",
          "attributes": {
            "category": "size",
            "type": "font",
            "item": "large"
          },
          "path": [
            "size",
            "font",
            "large"
          ]
        }
      }
    },
    "color": {
      "base": {
        "red": {
          "value": "#ff0000",
          "comment": "comment",
          "original": {
            "value": "#FF0000",
            "comment": "comment"
          },
          "name": "color-base-red",
          "attributes": {
            "category": "color",
            "type": "base",
            "item": "red"
          },
          "path": [
            "color",
            "base",
            "red"
          ]
        }
      },
      "white": {
        "value": "#ffffff",
        "original": {
          "value": "#ffffff"
        },
        "name": "color-white",
        "attributes": {
          "category": "color",
          "type": "white"
        },
        "path": [
          "color",
          "white"
        ]
      }
    },
    "asset": {
      "icon": {
        "book": {
          "value": "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+",
          "original": {
            "value": "./test/__assets/icons/book.svg"
          },
          "name": "asset-icon-book",
          "attributes": {
            "category": "asset",
            "type": "icon",
            "item": "book"
          },
          "path": [
            "asset",
            "icon",
            "book"
          ]
        }
      }
    }
  },
  "allProperties": [
    {
      "value": "12rem",
      "original": {
        "value": "12px"
      },
      "name": "size-font-small",
      "attributes": {
        "category": "size",
        "type": "font",
        "item": "small"
      },
      "path": [
        "size",
        "font",
        "small"
      ]
    },
    {
      "value": "18rem",
      "original": {
        "value": "18px"
      },
      "name": "size-font-large",
      "attributes": {
        "category": "size",
        "type": "font",
        "item": "large"
      },
      "path": [
        "size",
        "font",
        "large"
      ]
    },
    {
      "value": "#ff0000",
      "comment": "comment",
      "original": {
        "value": "#FF0000",
        "comment": "comment"
      },
      "name": "color-base-red",
      "attributes": {
        "category": "color",
        "type": "base",
        "item": "red"
      },
      "path": [
        "color",
        "base",
        "red"
      ]
    },
    {
      "value": "#ffffff",
      "original": {
        "value": "#ffffff"
      },
      "name": "color-white",
      "attributes": {
        "category": "color",
        "type": "white"
      },
      "path": [
        "color",
        "white"
      ]
    },
    {
      "value": "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+",
      "original": {
        "value": "./test/__assets/icons/book.svg"
      },
      "name": "asset-icon-book",
      "attributes": {
        "category": "asset",
        "type": "icon",
        "item": "book"
      },
      "path": [
        "asset",
        "icon",
        "book"
      ]
    }
  ]
};

describe('formats', () => {
  _.each(['scss/map-flat', 'scss/map-deep'], function(key) {

    describe(key, () => {

      var file = {
        "destination": "__output/",
        "format": key
      };

      // mock the Date.now() call to a fixed value
      const constantDate = new Date('2000-01-01');
      const globalDate = global.Date;
      global.Date = function() { return constantDate };

      var formatter = formats[key].bind(file);
      var output = formatter(dictionary, file);

      // reset the global Date object (or node-sass will complain!)
      global.Date = globalDate;

      it('should return ' + key + ' as a string', () => {
        expect(typeof output).toBe('string');
      });

      it('should have a valid scss syntax', done => {
        scss.render({
          data: output,
        }, function(err, result) {
          if(err) {
            return done(new Error(err));
          }
          expect(result.css).toBeDefined();
          return done();
        });
      });

      it(key + ' snapshot', () => {
        expect(output).toMatchSnapshot();
      });

    });

  });
});
