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
import { expect } from 'chai';
import { restore, stubMethod } from 'hanbi';
import transformConfig from '../../lib/transform/config.js';
import chalk from 'chalk';

const dictionary = {
  hooks: {
    transforms: {
      fooTransform: {
        type: 'attribute',
        transform: function () {
          return { bar: 'foo' };
        },
      },
    },
    transformGroups: {
      fooTransformGroup: ['barTransform'],
    },
  },
};

describe('transform', () => {
  describe('config', () => {
    it('Emits error when called with a transformGroup that does not exist in the dictionary', () => {
      const noTransformGroupCfg = {
        transformGroup: 'barTransformGroup',
      };

      let err = `
Unknown transformGroup "barTransformGroup" found in platform "test":
"barTransformGroup" does not match the name of a registered transformGroup.
`;

      expect(transformConfig.bind(null, noTransformGroupCfg, dictionary, 'test')).to.throw(err);
    });

    it('Emits errors when called with a transform that does not exist', () => {
      const noTransformCfg = {
        transforms: ['fooTransform', 'barTransform', 'bazTransform'],
      };

      let err = `
Unknown transforms "barTransform", "bazTransform" found in platform "test":
None of "barTransform", "bazTransform" match the name of a registered transform.
`;

      expect(transformConfig.bind(null, noTransformCfg, dictionary, 'test')).to.throw(err);
    });

    it('allows combining transformGroup with transforms', () => {
      const cfg = {
        hooks: {
          transforms: {
            fooTransform: {
              name: 'fooTransform',
              type: 'attribute',
              transform: function () {
                return { foo: 'foo' };
              },
            },
            barTransform: {
              name: 'barTransform',
              type: 'attribute',
              transform: function () {
                return { bar: 'bar' };
              },
            },
            quxTransform: {
              name: 'quxTransform',
              type: 'attribute',
              transform: function () {
                return { qux: 'qux' };
              },
            },
          },
          transformGroups: {
            foobarTransformGroup: ['fooTransform', 'barTransform'],
          },
        },
      };

      const platformCfg = {
        transformGroup: 'foobarTransformGroup',
        transforms: ['quxTransform'],
      };
      const transformedCfg = transformConfig(platformCfg, cfg, 'test');
      expect(transformedCfg.transforms.map((t) => t.name)).to.eql([
        'fooTransform',
        'barTransform',
        'quxTransform',
      ]);
    });

    it('warns the user if an action is used without a clean function', () => {
      const cfg = {
        hooks: {
          actions: {
            foo: {},
          },
        },
      };
      const platformCfg = {
        actions: ['foo'],
      };

      const logStub = stubMethod(console, 'log');
      transformConfig(platformCfg, cfg, 'test');
      restore();
      expect(logStub.callCount).to.equal(1);
      expect(Array.from(logStub.calls)[0].args[0]).to.equal(
        chalk.rgb(255, 140, 0).bold('foo action does not have a clean function!'),
      );
    });

    it('throws if an action is used without a clean function with log.warnings set to error', () => {
      const cfg = {
        log: { warnings: 'error' },
        hooks: {
          actions: {
            foo: {},
          },
        },
      };
      const platformCfg = {
        actions: ['foo'],
      };

      expect(() => transformConfig(platformCfg, cfg, 'test')).to.throw(
        'foo action does not have a clean function!',
      );
    });

    it('does not warn user at all when log.verbosity silent is used', () => {
      const cfg = {
        log: { verbosity: 'silent' },
        hooks: {
          actions: {
            foo: {},
          },
        },
      };
      const platformCfg = {
        actions: ['foo'],
      };

      const logStub = stubMethod(console, 'log');
      transformConfig(platformCfg, cfg, 'test');
      restore();
      expect(logStub.callCount).to.equal(0);
    });
  });
});
