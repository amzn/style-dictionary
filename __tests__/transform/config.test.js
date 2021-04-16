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

const transformConfig = require('../../lib/transform/config');
const Logger = require('../../lib/utils/logger');

const dictionary = {
  transformGroup: {
    fooTransformGroup: ['barTransform']
  },
  transform: {
    fooTransform: {
      type: 'attribute',
      transformer: function() {
        return {bar: 'foo'}
      }
    }
  }
};

beforeEach(() => {
  Logger.clear();
});

describe('transform', () => {
  describe('config', () => {
    it('Emits error when called with a transformGroup that does not exist in the dictionary', () => {
      const noTransformGroupCfg = {
        transformGroup: 'barTransformGroup'
      };

      transformConfig(noTransformGroupCfg, dictionary, 'test');
      expect(Logger.platform.missingTransformGroups.length).toBe(1);
      expect(Logger.platform.messages()).toEqual(
        expect.stringContaining(`barTransformGroup`)
      );
    });

    it('Emits errors when called with a transform that does not exist', () => {
      const noTransformCfg = {
        transforms: ['fooTransform', 'barTransform', 'bazTransform']
      };

      transformConfig(noTransformCfg, dictionary, 'test');
      expect(Logger.platform.missingTransforms.length).toBe(2);
      expect(Logger.platform.messages()).toEqual(
        expect.stringContaining(`barTransform`)
      );
    });
  });
});
