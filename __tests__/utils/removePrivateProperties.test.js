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

var removePrivateProperties = require('../../lib/utils/removePrivateProperties');

describe('utils', () => {
  describe('removePrivateProperties', () => {

    it('should return an empty object', () => {
      var ret = removePrivateProperties({});
      expect(ret).toEqual({});
    });

    it('should return the same object', () => {
      var to_ret = {};
      var ret = removePrivateProperties({}, to_ret);
      expect(ret).toBe(ret);
    });

    it('should return leaf node values as an object', () => {
      var properties = {
        'black': {
          'value': '#000000'
        },
        'aqua': {
          'value': '#00FFFF'
        },
        'white': {
          'value': '#FFFFFF'
        }
      };

      var expected_ret = {
        'black': {
          'value': '#000000'
        },
        'aqua': {
          'value': '#00FFFF'
        },
        'white': {
          'value': '#FFFFFF'
        }
      };

      var ret = removePrivateProperties(properties);
      expect(ret).toEqual(expected_ret);
    });

    it('should return leaf not private node values as an object', () => {
      var properties = {
        'black': {
          'value': '#000000',
          'private': true
        },
        'aqua': {
          'value': '#00FFFF'
        },
        'white': {
          'value': '#FFFFFF',
          'private': false
        }
      };

      var expected_ret = {
        'aqua': {
          'value': '#00FFFF'
        },
        'white': {
          'value': '#FFFFFF'
        }
      };

      var ret = removePrivateProperties(properties);
      expect(ret).toEqual(expected_ret);
    });

    it('should return nested leaf node values as an object', () => {
      var properties = {
        'color': {
          'black': {
            'value': '#000000'
          },
          'white': {
            'value': '#FFFFFF'
          }
        }
      };

      var expected_ret = {
        'color': {
          'black': {
            'value': '#000000'
          },
          'white': {
            'value': '#FFFFFF'
          }
        }
      };

      var ret = removePrivateProperties(properties);
      expect(ret).toEqual(expected_ret);
    });

    it('should return nested leaf not private node values as an object', () => {
      var properties = {
        'color': {
          'black': {
            'value': '#000000',
            'private': true
          },
          'aqua': {
            'value': '#00FFFF'
          },
          'white': {
            'value': '#FFFFFF',
            'private': false
          }
        }
      };

      var expected_ret = {
        'color': {
          'aqua': {
            'value': '#00FFFF'
          },
          'white': {
            'value': '#FFFFFF'
          }
        }
      };

      var ret = removePrivateProperties(properties);
      expect(ret).toEqual(expected_ret);
    });
  });
});
