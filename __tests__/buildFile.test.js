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
import { stubMethod, restore } from 'hanbi';
import chalk from 'chalk';
import { fs } from 'style-dictionary/fs';
import buildFile from '../lib/buildFile.js';
import { clearOutput, fileExists } from './__helpers.js';
import GroupMessages from '../lib/utils/groupMessages.js';
import flattenTokens from '../lib/utils/flattenTokens.js';
import formats from '../lib/common/formats.js';

function format() {
  return 'hi';
}

function nestedFormat() {
  return 'hi';
}

nestedFormat.nested = true;

describe('buildFile', () => {
  beforeEach(() => {
    clearOutput();
    restore();
  });

  afterEach(() => {
    clearOutput();
    restore();
  });

  it('should error if format doesnt exist or isnt a function', async () => {
    await expect(
      buildFile({ destination: '__tests__output/test.txt' }, {}, {}, {}),
    ).to.eventually.rejectedWith('Please enter a valid file format');
    await expect(
      buildFile({ destination: '__tests__output/test.txt', format: {} }, {}, {}, {}),
    ).to.eventually.rejectedWith('Please enter a valid file format');
    await expect(
      buildFile({ destination: '__tests__/__output/test.txt', format: [] }, {}, {}, {}),
    ).to.eventually.rejectedWith('Please enter a valid file format');
  });

  it('should error if destination doesnt exist or isnt a string', async () => {
    await expect(buildFile({ format }, {}, {}, {})).to.eventually.rejectedWith(
      'Please enter a valid destination',
    );
    await expect(buildFile({ format, destination: [] }, {}, {}, {})).to.eventually.rejectedWith(
      'Please enter a valid destination',
    );
    await expect(buildFile({ format, destination: {} }, {}, {}, {})).to.eventually.rejectedWith(
      'Please enter a valid destination',
    );
  });

  describe('name collisions', () => {
    const destination = '__tests__/__output/test.collisions';
    const PROPERTY_NAME_COLLISION_WARNINGS = `${GroupMessages.GROUP.PropertyNameCollisionWarnings}:${destination}`;
    const name = 'someName';
    const dictionary = {
      allTokens: [
        {
          name: name,
          path: ['some', 'name', 'path1'],
          value: 'value1',
        },
        {
          name: name,
          path: ['some', 'name', 'path2'],
          value: 'value2',
        },
      ],
    };

    it('should generate warning messages for output name collisions', async () => {
      GroupMessages.clear(PROPERTY_NAME_COLLISION_WARNINGS);
      await buildFile({ destination, format }, {}, dictionary, {});

      const collisions = dictionary.allTokens
        .map(
          (tokens) =>
            `${chalk.rgb(255, 69, 0)(tokens.path.join('.'))}   ${chalk.rgb(
              255,
              140,
              0,
            )(tokens.value)}`,
        )
        .join('\n        ');

      const output = `Output name ${chalk
        .rgb(255, 69, 0)
        .bold(name)} was generated by:\n        ${collisions}`;
      const expectJSON = JSON.stringify([output]);

      expect(GroupMessages.count(PROPERTY_NAME_COLLISION_WARNINGS)).to.equal(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_NAME_COLLISION_WARNINGS))).to.eql(
        expectJSON,
      );
    });

    it('should not warn users if the format is a nested format', async () => {
      const consoleStub = stubMethod(console, 'log');
      await buildFile({ destination, format: nestedFormat }, {}, dictionary, {});
      expect(consoleStub.calledWith(chalk.bold.green(`✔︎ ${destination}`))).to.be.true;
    });
  });

  const destEmptyTokens = '__tests__/__output/test.emptyTokens';
  it('should warn when a file is not created because of empty tokens', async () => {
    const dictionary = {
      allTokens: [
        {
          name: 'someName',
          attributes: { category: 'category1' },
          path: ['some', 'name', 'path1'],
          value: 'value1',
        },
      ],
    };

    const filter = function (prop) {
      return prop.attributes.category === 'category2';
    };

    await buildFile(
      {
        destination: destEmptyTokens,
        format,
        filter,
      },
      {},
      dictionary,
      {},
    );
    expect(fileExists('__tests__/__output/test.emptyTokens')).to.be.false;
  });

  it('should warn when a file is not created because of empty tokens using async filters', async () => {
    const dictionary = {
      allTokens: [
        {
          name: 'someName',
          attributes: { category: 'category1' },
          path: ['some', 'name', 'path1'],
          value: 'value1',
        },
      ],
    };

    const filter = async (prop) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return prop.attributes.category === 'category2';
    };

    await buildFile(
      {
        destination: destEmptyTokens,
        format,
        filter,
      },
      {},
      dictionary,
      {},
    );
    expect(fileExists('__tests__/__output/test.emptyTokens')).to.be.false;
  });

  it('should write to a file properly', async () => {
    await buildFile(
      {
        destination: 'test.txt',
        format,
      },
      {
        buildPath: '__tests__/__output/',
      },
      {},
      {},
    );
    expect(fileExists('__tests__/__output/test.txt')).to.be.true;
  });

  it('should support asynchronous formats', async () => {
    const tokens = {
      size: {
        font: {
          small: {
            value: '12rem',
            original: {
              value: '12px',
            },
            name: 'size-font-small',
            attributes: {
              category: 'size',
              type: 'font',
              item: 'small',
            },
            path: ['size', 'font', 'small'],
          },
          large: {
            value: '18rem',
            original: {
              value: '18px',
            },
            name: 'size-font-large',
            attributes: {
              category: 'size',
              type: 'font',
              item: 'large',
            },
            path: ['size', 'font', 'large'],
          },
        },
      },
      color: {
        base: {
          red: {
            value: '#ff0000',
            comment: 'comment',
            original: {
              value: '#FF0000',
              comment: 'comment',
            },
            name: 'color-base-red',
            attributes: {
              category: 'color',
              type: 'base',
              item: 'red',
            },
            path: ['color', 'base', 'red'],
          },
        },
        white: {
          value: '#ffffff',
          original: {
            value: '#ffffff',
          },
          name: 'color-white',
          attributes: {
            category: 'color',
            type: 'white',
          },
          path: ['color', 'white'],
        },
      },
    };

    const customCSSFormat = ({ dictionary }) => {
      return `:root {
${dictionary.allTokens.map((tok) => `  ${tok.name}: "${tok.value}";`).join('\n')}
}\n`;
    };

    await buildFile(
      {
        destination: 'test.css',
        format: customCSSFormat,
      },
      {
        buildPath: '__tests__/__output/',
      },
      {
        tokens: tokens,
        allTokens: flattenTokens(tokens),
      },
      {},
    );
    const content = await fs.promises.readFile('__tests__/__output/test.css', 'utf-8');
    await expect(content).to.matchSnapshot();
  });

  it('should support asynchronous fileHeader', async () => {
    const dictionary = {
      allTokens: [
        {
          name: 'someName',
          attributes: { category: 'category1' },
          path: ['some', 'name', 'path1'],
          value: 'value1',
        },
      ],
    };

    await buildFile(
      {
        destination: 'test.css',
        format: formats['css/variables'],
        options: {
          fileHeader: async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return ['foo', 'bar'];
          },
        },
      },
      {
        buildPath: '__tests__/__output/',
      },
      dictionary,
      {},
    );
    const content = await fs.promises.readFile('__tests__/__output/test.css', 'utf-8');
    await expect(content).to.matchSnapshot();
  });
});
