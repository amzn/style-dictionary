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

import JSON5 from 'json5';
import { extname } from 'path-unified';
import { fs } from 'style-dictionary/fs';
import { resolve } from './resolve.js';
import { deepmerge } from './utils/deepmerge.js';
import { Register } from './Register.js';

import * as formatHelpers from './common/formatHelpers/index.js';

import combineJSON from './utils/combineJSON.js';
import deepExtend from './utils/deepExtend.js';
import resolveObject from './utils/resolveObject.js';
import getName from './utils/references/getName.js';
import GroupMessages from './utils/groupMessages.js';
import { preprocess } from './utils/preprocess.js';

import transformObject from './transform/object.js';
import transformConfig from './transform/config.js';
import performActions from './performActions.js';
import buildFiles from './buildFiles.js';
import cleanFiles from './cleanFiles.js';
import cleanDirs from './cleanDirs.js';
import cleanActions from './cleanActions.js';
import flattenTokens from './utils/flattenTokens.js';

/**
 * @typedef {import('../types/Config.d.ts').Config} Config
 * @typedef {import('../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../types/DesignToken.d.ts').DesignToken} Token
 * @typedef {import('../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../types/DesignToken.d.ts').DesignTokens} Tokens
 * @typedef {import('../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../types/DesignToken.d.ts').Dictionary} Dictionary
 */

const PROPERTY_VALUE_COLLISIONS = GroupMessages.GROUP.PropertyValueCollisions;
const PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

/**
 * Style Dictionary module
 *
 * @module style-dictionary
 * @typicalname StyleDictionary
 * @example
 * ```js
 * import StyleDictionary from 'style-dictionary';
 * new StyleDictionary.extend('config.json').buildAllPlatforms();
 * ```
 */

export default class StyleDictionary extends Register {
  // Placeholder is transformed on prepublish -> see scripts/inject-version.js
  // Another option might be import pkg from './package.json' with { "type": "json" } which would work in both browser and node, but support is not there yet.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
  static VERSION = '<? version placeholder ?>';
  static formatHelpers = formatHelpers;

  /** @returns {Config} */
  get options() {
    // merge locally registered things with options
    // so that when we extend, we include registered things
    const opts = deepmerge(
      {
        transform: this.transform,
        transformGroup: this.transformGroup,
        format: this.format,
        action: this.action,
        filter: this.filter,
        fileHeader: this.fileHeader,
        parsers: this.parsers,
        preprocessors: this.preprocessors,
      },
      this._options ?? {},
    );
    return opts;
  }
  /** @param {Config} v */
  set options(v) {
    this._options = v;
  }

  constructor(config = {}, { init = true } = {}) {
    super();
    /** @type {'warn'|'error'} */
    this.log = 'warn';
    this.config = config;
    this.options = {};
    /** @type {Tokens|TransformedTokens} */
    this.tokens = {};
    /** @type {TransformedToken[]} */
    this.allTokens = [];
    /**
     * Gets set after transform because filter happens on format level,
     * so we know they are transformed by then.
     * @type {TransformedTokens}
     */
    this.unfilteredTokens = {};

    this.hasInitialized = new Promise((resolve) => {
      this.hasInitializedResolve = resolve;
    });

    // By default, always call async extend function when constructing new SD instance
    // However, for testability and managing error handling,
    // you can call constructor with { init: false }
    // and call SDInstance.extend() manually (and catch the error).
    if (init) {
      this.init();
    }
  }

  async init() {
    return this.extend(undefined, true);
  }

  /**
   * @param {Config} [config]
   * @param {boolean} [mutateOriginal]
   * @returns {Promise<StyleDictionary>}
   */
  async extend(config = this.config, mutateOriginal = false) {
    // by default, if extend is called it means extending the current instance
    // with a new instance without mutating the original
    if (!mutateOriginal) {
      const newSD = new StyleDictionary(deepmerge(this.options, config), { init: false });
      return newSD.init();
    }

    /** @type {Config} */
    let options;
    /** @type {Tokens} */
    let inlineTokens = {};
    /** @type {Tokens} */
    let includeTokens = {};
    /** @type {Tokens} */
    let sourceTokens = {};
    // Overloaded method, can accept a string as a path that points to a JS or
    // JSON file or a plain object. Potentially refactor.
    if (typeof config === 'string') {
      // get ext name without leading .
      const ext = extname(config).replace(/^\./, '');
      // import path in Node has to be relative to cwd, in browser to root
      const cfgFilePath = resolve(config);
      if (['json', 'json5', 'jsonc'].includes(ext)) {
        options = JSON5.parse(/** @type {string} */ (fs.readFileSync(cfgFilePath, 'utf-8')));
      } else {
        let _filePath = cfgFilePath;
        if (typeof window !== 'object' && process?.platform === 'win32') {
          // Windows FS compatibility. If in browser, we use an FS shim which doesn't require this Windows workaround
          _filePath = new URL(`file:///${_filePath}`).href;
        }
        options = (await import(/* webpackIgnore: true */ _filePath)).default;
      }
    } else {
      options = config;
    }

    // SD Config options should be passed to class instance as well
    Object.entries(options).forEach(([key, val]) => {
      // Bit of a type hack, making the assumption that any property in options can be set as a prop on StyleDictonary instance
      const _key = /** @type {keyof StyleDictionary} */ (key);
      this[_key] = val;
    });
    this.options = options;

    // Creating a new object and copying over the options
    // Also keeping an options object in case

    // grab the inline tokens, ones either defined in the configuration object
    // or that already exist from extending another style dictionary instance
    // with `tokens` keys
    inlineTokens = deepExtend([{}, this.tokens || {}]);

    // Update tokens with includes from dependencies
    if (this.options.include) {
      if (!Array.isArray(this.options.include)) throw new Error('include must be an array');

      includeTokens = await combineJSON(this.options.include, true, undefined, false, this.parsers);
    }

    // Update tokens with current package's source
    // These highest precedence
    if (this.options.source) {
      if (!Array.isArray(this.options.source)) throw new Error('source must be an array');
      sourceTokens = await combineJSON(
        this.options.source,
        true,
        /** @param {Token} prop */
        function Collision(prop) {
          GroupMessages.add(
            PROPERTY_VALUE_COLLISIONS,
            `Collision detected at: ${prop.path.join('.')}! Original value: ${
              prop.target[prop.key]
            }, New value: ${prop.copy[prop.key]}`,
          );
        },
        true,
        this.parsers,
      );

      if (GroupMessages.count(PROPERTY_VALUE_COLLISIONS) > 0) {
        const collisions = GroupMessages.flush(PROPERTY_VALUE_COLLISIONS).join('\n');
        const warn = `\n${PROPERTY_VALUE_COLLISIONS}:\n${collisions}\n\n`;
        if (options.log === 'error') {
          throw new Error(warn);
        } else {
          // eslint-disable-next-line no-console
          console.log(warn);
        }
      }
    }

    // Merge inline, include, and source tokens
    const unprocessedTokens = deepExtend([{}, inlineTokens, includeTokens, sourceTokens]);
    this.tokens = await preprocess(unprocessedTokens, this.preprocessors);
    this.hasInitializedResolve(null);

    // For chaining
    return this;
  }

  /**
   * @param {string} platform
   * @returns {Promise<TransformedTokens>}
   */
  async exportPlatform(platform) {
    await this.hasInitialized;

    if (!platform || !this.options?.platforms?.[platform]) {
      throw new Error('Please supply a valid platform');
    }

    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

    let exportableResult = this.tokens;

    /**
     * @type {string[]}
     * list keeping paths of props with applied value transformations
     */
    const transformedPropRefs = [];
    /**
     * @type {string[]}
     * list keeping paths of props that had references in it, and therefore
     * could not (yet) have transformed
     */
    const deferredPropValueTransforms = [];

    const transformationContext = {
      transformedPropRefs,
      deferredPropValueTransforms,
    };

    let deferredPropCount = 0;
    let finished = false;

    while (!finished) {
      // We keep up transforming and resolving until all props are resolved
      // and every defined transformation was executed. Remember: transformations
      // can only be executed, if the value to be transformed, has no references
      // in it. So resolving may lead to enable further transformations, and sub
      // sequent resolving may enable even more transformations - and so on.
      // So we keep this loop running until sub sequent transformations are ineffective.
      //
      // Take the following example:
      //
      // color.brand = {
      //   value: "{color.base.green}"
      // }
      //
      // color.background.button.primary.base = {
      //   value: "{color.brand.value}",
      //   color: {
      //     desaturate: 0.5
      //   }
      // }
      //
      // color.background.button.primary.hover = {
      //   value: "{color.background.button.primary.base}",
      //   color: {
      //     darken: 0.2
      //   }
      // }
      //
      // As you can see 'color.background.button.primary.hover' is a variation
      // of 'color.background.button.primary.base' which is a variation of
      // 'color.base.green'. These transitive references are solved by running
      // this loop until all tokens are transformed and resolved.

      // We need to transform the object before we resolve the
      // variable names because if a value contains concatenated
      // values like "1px solid {color.border.base}" we want to
      // transform the original value (color.border.base) before
      // replacing that value in the string.
      const transformed = transformObject(exportableResult, platformConfig, transformationContext);

      // referenced values, that have not (yet) been transformed should be excluded from resolving
      const ignorePathsToResolve = deferredPropValueTransforms.map((p) => getName([p, 'value']));
      exportableResult = resolveObject(transformed, {
        ignorePaths: ignorePathsToResolve,
      });

      const newDeferredPropCount = deferredPropValueTransforms.length;

      // nothing left to transform -> ready
      if (newDeferredPropCount === 0) {
        finished = true;
        // or deferred count doesn't go down, that means there
        // is a circular reference -> ready (but errored)
      } else if (deferredPropCount === newDeferredPropCount) {
        // if we didn't resolve any deferred references then we have a circular reference
        // the resolveObject method will find the circular references
        // we do this in case there are multiple circular references
        resolveObject(transformed);
        finished = true;
      } else {
        // neither of these things, keep going.
        deferredPropCount = newDeferredPropCount;
      }
    }

    if (GroupMessages.count(PROPERTY_REFERENCE_WARNINGS) > 0) {
      const warnings = GroupMessages.flush(PROPERTY_REFERENCE_WARNINGS).join('\n');
      throw new Error(
        `\n${PROPERTY_REFERENCE_WARNINGS}:\n${warnings}\n\nProblems were found when trying to resolve property references`,
      );
    }

    return exportableResult;
  }

  /**
   * @param {string} platform
   * @returns
   */
  async getPlatform(platform) {
    await this.hasInitialized;
    // eslint-disable-next-line no-console
    console.log('\n' + platform);

    if (!this.options?.platforms?.[platform]) {
      throw new Error(`Platform "${platform}" does not exist`);
    }

    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

    // We need to transform the object before we resolve the
    // variable names because if a value contains concatenated
    // values like "1px solid {color.border.base}" we want to
    // transform the original value (color.border.base) before
    // replacing that value in the string.
    const tokens = await this.exportPlatform(platform);
    this.allTokens = /** @type {TransformedToken[]} */ (flattenTokens(tokens));
    // This is the dictionary object we pass to the file
    // building and action methods.
    return { dictionary: { tokens, allTokens: this.allTokens }, platformConfig };
  }

  /**
   * @param {string} platform
   * @returns
   */
  async buildPlatform(platform) {
    const { dictionary, platformConfig } = await this.getPlatform(platform);
    buildFiles(dictionary, platformConfig);
    performActions(dictionary, platformConfig);
    // For chaining
    return this;
  }

  async buildAllPlatforms() {
    await this.hasInitialized;
    if (this.options?.platforms) {
      await Promise.all(Object.keys(this.options.platforms).map((key) => this.buildPlatform(key)));
    }
    // For chaining
    return this;
  }

  /**
   * @param {string} platform
   * @returns
   */
  async cleanPlatform(platform) {
    const { dictionary, platformConfig } = await this.getPlatform(platform);
    // We clean files first, then actions, ...and then directories?
    cleanFiles(platformConfig);
    cleanActions(dictionary, platformConfig);
    cleanDirs(platformConfig);
    // For chaining
    return this;
  }

  async cleanAllPlatforms() {
    await this.hasInitialized;
    if (this.options?.platforms) {
      await Promise.all(Object.keys(this.options.platforms).map((key) => this.cleanPlatform(key)));
    }
    // For chaining
    return this;
  }
}
