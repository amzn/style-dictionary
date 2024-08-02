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
import StyleDictionary from 'style-dictionary';
import { buildPath } from '../__integration__/_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

/**
 * Utility to programmatically generate large sets of tokens
 *
 * Example:
 * generateTokens({ key: 'fw', amount: 3000, value: 'Regular', type: 'fontWeight', refDepth: 3 });
 *
 * Result:
 *
 * {
 *   fw-ref0: { // base, minimum
 *     fw0: {
 *       value: 'Regular',
 *       type: 'fontWeight'
 *     },
 *     fw1: {
 *       value: 'Regular',
 *       type: 'fontWeight'
 *     },
 *     ...
 *   },
 *   fw-ref1: { // refs the previous sibling, if refDepth > 1
 *     fw0: {
 *       value: '{fw-ref0.fw0}',
 *       type: 'fontWeight'
 *     },
 *     fw1: {
 *       value: '{fw-ref0.fw1}',
 *       type: 'fontWeight'
 *     },
 *     ... (repeat, depends on `amount`)
 *   },
 *   ... (repeat, depends on `refDepth`)
 * }
 *
 * @param {*} param0
 * @returns
 */
const generateTokens = ({ key, type, value, amount, refDepth = 1 }) => {
  const result = {};
  Array(refDepth)
    .fill(null)
    .forEach((_, refIndex) => {
      result[`${key}-ref${refIndex}`] = Object.fromEntries(
        Array(amount)
          .fill(null)
          .map((_, index) => [
            `${key}${index}`,
            { value: refIndex > 0 ? `{${key}-ref${refIndex - 1}.${key}${index}}` : value, type },
          ]),
      );
    });

  return result;
};

describe('cliBuildWithJsConfig', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should run basic Style Dictionary within 70ms', async () => {
    const start = performance.now();
    const sd = new StyleDictionary({
      tokens: {
        color: {
          black: {
            value: '#000',
            type: 'color',
          },
        },
      },
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables',
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();
    const end = performance.now();
    expect(end - start).to.be.below(70);
  });

  // TODO: aim for <1000ms
  it('should run tons of refs within 2500ms', async () => {
    // 9000 tokens, 6000 refs
    // (first layer is raw values, other 2 layers are refs to previous layer)
    const fontWeightTokens = generateTokens({
      key: 'fw',
      amount: 3000,
      value: 'Regular',
      type: 'fontWeight',
      refDepth: 3,
    });

    const start = performance.now();
    const sd = new StyleDictionary({
      tokens: {
        ...fontWeightTokens,
      },
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [
            {
              destination: 'variables.css',
              format: 'css/variables',
            },
          ],
        },
      },
    });
    await sd.hasInitialized;
    await sd.buildPlatform('css');
    const end = performance.now();
    expect(end - start).to.be.below(2500);
  }).timeout(10000);
});
