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
import { join } from 'path-unified';
import yaml from 'yaml';
import { expectThrowsAsync } from '../__helpers.js';
import combineJSON from '../../lib/utils/combineJSON.js';

describe('utils', () => {
  describe('combineJSON', () => {
    it('should return an object with usesDtcg & tokens prop', async () => {
      const test = await combineJSON(['__tests__/__json_files/*.json']);
      expect(typeof test).to.equal('object');
      const { tokens, usesDtcg } = test;
      expect(typeof tokens).to.equal('object');
      expect(typeof usesDtcg).to.equal('boolean');
    });

    it('should handle wildcards', async () => {
      const test = await combineJSON(['__tests__/__json_files/*.json']);
      expect(typeof test).to.equal('object');
      const { tokens, usesDtcg } = test;
      expect(typeof tokens).to.equal('object');
      expect(typeof usesDtcg).to.equal('boolean');
    });

    it('should handle js modules that export objects', async () => {
      const absPath = join('__tests__', '__json_files', '*.js');
      const relativePath = '__tests__/__json_files/*.js';
      const test = await combineJSON([absPath, relativePath]);
      expect(typeof test).to.equal('object');
      const { tokens, usesDtcg } = test;
      expect(typeof tokens).to.equal('object');
      expect(typeof usesDtcg).to.equal('boolean');
    });

    it('should do a deep merge', async () => {
      const { tokens } = await combineJSON(['__tests__/__json_files/shallow/*.json'], true);
      expect(tokens).to.have.property('a', 2);
      expect(tokens.b).to.eql({ a: 1, c: 2 });
      expect(tokens).to.have.nested.property('d.e.f.g', 1);
      expect(tokens).to.have.nested.property('d.e.f.h', 2);
    });

    it('should do a shallow merge', async () => {
      const { tokens } = await combineJSON(['__tests__/__json_files/shallow/*.json']);
      expect(tokens).to.have.property('a', 2);
      expect(tokens.b).to.eql({ c: 2 });
      expect(tokens).to.have.deep.property('c', [3, 4]);
      expect(tokens).not.to.have.nested.property('d.e.f.g');
      expect(tokens).to.have.nested.property('d.e.f.h', 2);
    });

    it('should fail on invalid JSON', async () => {
      await expectThrowsAsync(
        () => combineJSON(['__tests__/__json_files/broken/*.json']),
        "Failed to load or parse JSON or JS Object: JSON5: invalid character '!' at 2:18",
      );
    });

    it('should fail if there is a collision and it is passed a collision function', async () => {
      await expectThrowsAsync(
        () =>
          combineJSON(['__tests__/__json_files/shallow/*.json'], true, function Collision(opts) {
            expect(opts).to.have.property('key', 'a');
            expect(opts.target[opts.key]).to.equal(1);
            expect(opts.copy[opts.key]).to.equal(2);
            throw new Error('test');
          }),
        'test',
      );
    });

    it('should support json5', async () => {
      const { tokens } = await combineJSON(['__tests__/__json_files/shallow/*.json5']);
      expect(tokens).to.have.property('json5A', 5);
      expect(tokens.d).to.have.property('json5e', 1);
    });

    it('should support jsonc', async () => {
      const { tokens } = await combineJSON(['__tests__/__json_files/shallow/*.jsonc']);
      expect(tokens).to.have.property('jsonCA', 5);
      expect(tokens.d).to.have.property('jsonCe', 1);
    });

    describe('custom parsers', () => {
      it('should support yaml.parse', async () => {
        const parsers = [
          {
            pattern: /\.yaml$/,
            // yaml.parse function matches the intended function signature
            parse: ({ contents }) => yaml.parse(contents),
          },
        ];
        const { tokens } = await combineJSON(
          [`__tests__/__json_files/yaml.yaml`],
          false,
          null,
          false,
          parsers,
        );
        expect(tokens).to.have.property('foo', 'bar');
        expect(tokens).to.have.property('bar', '{foo}');
      });

      it('should multiple parsers on the same file', async () => {
        const testOutput = { test: 'test' };
        const parsers = [
          {
            pattern: /.json$/,
            parse: () => {
              return { test: 'foo' };
            },
          },
          {
            pattern: /.json$/,
            parse: () => {
              return testOutput;
            },
          },
        ];
        const { tokens } = await combineJSON(
          [`__tests__/__json_files/simple.json`],
          false,
          null,
          false,
          parsers,
        );
        expect(tokens).to.have.property('test', 'test');
      });
    });
  });
});
