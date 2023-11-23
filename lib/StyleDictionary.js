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
import path from '@bundled-es-modules/path-browserify';
import { fs } from 'style-dictionary/fs';
import { deepmerge } from './utils/deepmerge.js';

import transform from './common/transforms.js';
import transformGroup from './common/transformGroups.js';
import format from './common/formats.js';
import action from './common/actions.js';
import * as formatHelpers from './common/formatHelpers/index.js';
import filter from './common/filters.js';

import registerTransform from './register/transform.js';
import registerTransformGroup from './register/transformGroup.js';
import registerFormat from './register/format.js';
import registerAction from './register/action.js';
import registerFilter from './register/filter.js';
import registerParser from './register/parser.js';
import registerFileHeader from './register/fileHeader.js';

import combineJSON from './utils/combineJSON.js';
import deepExtend from './utils/deepExtend.js';
import resolveObject from './utils/resolveObject.js';
import getName from './utils/references/getName.js';
import createDictionary from './utils/createDictionary.js';
import GroupMessages from './utils/groupMessages.js';

import transformObject from './transform/object.js';
import transformConfig from './transform/config.js';
import performActions from './performActions.js';
import buildFiles from './buildFiles.js';
import cleanFiles from './cleanFiles.js';
import cleanDirs from './cleanDirs.js';
import cleanActions from './cleanActions.js';

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

export default class StyleDictionary {
  // Placeholder is transformed on prepublish -> see scripts/inject-version.js
  // Another option might be import pkg from './package.json' with { "type": "json" } which would work in both browser and node, but support is not there yet.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
  static VERSION = '<? version placeholder ?>';
  static formatHelpers = formatHelpers;

  /**
   * Below is a ton of boilerplate. Explanation:
   *
   * You can register things on the StyleDictionary class level e.g. StyleDictionary.registerFormat()
   * You can also register these things on StyleDictionary instance (through config) or on StyleDictionary instance's platform property.
   *
   * Therefore, we have to make use of static props vs instance props and use getters and setters to merge these together.
   * In the extend() method is where we merge config props into the SD instance.
   * Platform specific options are handled and merged by exportPlatform -> transformConfig
   */
  static transform = transform;
  static transformGroup = transformGroup;
  static format = format;
  static action = action;
  static filter = filter;
  static fileHeader = {};
  static parsers = []; // we need to initialise the array, since we don't have built-in parsers

  static registerTransform(...args) {
    return registerTransform.call(this, ...args);
  }

  static registerTransformGroup(...args) {
    return registerTransformGroup.call(this, ...args);
  }

  static registerFormat(...args) {
    return registerFormat.call(this, ...args);
  }

  static registerAction(...args) {
    return registerAction.call(this, ...args);
  }

  static registerFilter(...args) {
    return registerFilter.call(this, ...args);
  }

  static registerParser(...args) {
    return registerParser.call(this, ...args);
  }

  static registerFileHeader(...args) {
    return registerFileHeader.call(this, ...args);
  }

  constructor(config = {}, { init = true } = {}) {
    // dynamically add these instance methods to delegate to class methods for register<Thing>
    ['transform', 'transformGroup', 'format', 'action', 'filter', 'fileHeader', 'parser'].forEach(
      (prop) => {
        Object.defineProperty(this, `register${prop.charAt(0).toUpperCase() + prop.slice(1)}`, {
          value: (...args) => {
            this.constructor[`register${prop.charAt(0).toUpperCase() + prop.slice(1)}`](...args);
          },
        });

        // Dynamically add getter/setter pairs so we can act as a gateway, merging
        // the SD class options with SD instance options
        const _prop = prop === 'parser' ? 'parsers' : prop;
        Object.defineProperty(this, _prop, {
          get: function () {
            if (prop === 'parser') {
              return [...this.constructor[`${_prop}`], ...this[`_${_prop}`]];
            }
            return { ...this.constructor[`${_prop}`], ...this[`_${_prop}`] };
          },
          set: function (v) {
            this[`_${_prop}`] = v;
          },
        });
      },
    );

    this.config = config;
    this.options = {};
    this.tokens = {};
    this.allTokens = {};
    this.parsers = [];
    this.hasInitialized = new Promise((resolve) => {
      this.hasInitializedResolve = resolve;
    });

    // By default, always call async extend function when constructing new SD instance
    // However, for testability and managing error handling,
    // you can call constructor with { init: false }
    // and call SDInstance.extend() manually (and catch the error).
    if (init) {
      this.init(config);
    }
  }

  async init() {
    return this.extend(undefined, true);
  }

  async extend(config = this.config, mutateOriginal = false) {
    // by default, if extend is called it means extending the current instance
    // with a new instance without mutating the original
    if (!mutateOriginal) {
      const newSD = new StyleDictionary(deepmerge(this.options, config), { init: false });
      return newSD.init();
    }

    let options;
    let inlineTokens = {};
    let includeTokens = {};
    let sourceTokens = {};
    // Overloaded method, can accept a string as a path that points to a JS or
    // JSON file or a plain object. Potentially refactor.
    if (typeof config === 'string') {
      // get ext name without leading .
      const ext = path.extname(config).replace(/^\./, '');
      if (['json', 'json5', 'jsonc'].includes(ext)) {
        options = JSON5.parse(fs.readFileSync(config, 'utf-8'));
      } else {
        // import path in Node has to be relative to cwd, in browser to root
        const fileToImport = path.resolve(typeof window === 'object' ? '' : process.cwd(), config);
        options = (await import(/* webpackIgnore: true */ fileToImport)).default;
      }
    } else {
      options = config;
    }

    // SD Config options should be passed to class instance as well
    Object.entries(options).forEach(([key, val]) => {
      this[key] = val;
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

      includeTokens = await combineJSON(this.options.include, true, null, false, this.parsers);
      this.include = null; // We don't want to carry over include references
    }

    // Update tokens with current package's source
    // These highest precedence
    if (this.options.source) {
      if (!Array.isArray(this.options.source)) throw new Error('source must be an array');
      sourceTokens = await combineJSON(
        this.options.source,
        true,
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
          console.log(warn);
        }
      }

      this.source = null; // We don't want to carry over the source references
    }

    // Merge inline, include, and source tokens
    this.tokens = deepExtend([{}, inlineTokens, includeTokens, sourceTokens]);
    this.hasInitializedResolve();

    // For chaining
    return this;
  }

  async exportPlatform(platform) {
    await this.hasInitialized;

    if (!platform || !this.options.platforms[platform]) {
      throw new Error('Please supply a valid platform');
    }

    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

    let exportableResult = this.tokens;

    // list keeping paths of props with applied value transformations
    const transformedPropRefs = [];
    // list keeping paths of props that had references in it, and therefore
    // could not (yet) have transformed
    const deferredPropValueTransforms = [];

    const transformationContext = {
      transformedPropRefs,
      deferredPropValueTransforms,
    };

    let deferredPropCount = 0;
    let finished;

    while (typeof finished === 'undefined') {
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

  async buildPlatform(platform) {
    await this.hasInitialized;

    console.log('\n' + platform);

    if (!this.options || !this.options?.platforms[platform]) {
      throw new Error(`Platform "${platform}" does not exist`);
    }

    let tokens;
    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

    // We need to transform the object before we resolve the
    // variable names because if a value contains concatenated
    // values like "1px solid {color.border.base}" we want to
    // transform the original value (color.border.base) before
    // replacing that value in the string.
    tokens = await this.exportPlatform(platform);

    // This is the dictionary object we pass to the file
    // building and action methods.
    const dictionary = createDictionary({ tokens });

    buildFiles(dictionary, platformConfig);
    performActions(dictionary, platformConfig);

    // For chaining
    return this;
  }

  async buildAllPlatforms() {
    await this.hasInitialized;
    await Promise.all(Object.keys(this.options.platforms).map((key) => this.buildPlatform(key)));

    // For chaining
    return this;
  }

  async cleanPlatform(platform) {
    await this.hasInitialized;

    console.log('\n' + platform);

    if (!this.options || !this.options?.platforms[platform]) {
      throw new Error('Platform ' + platform + " doesn't exist");
    }

    let tokens;
    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

    // We need to transform the object before we resolve the
    // variable names because if a value contains concatenated
    // values like "1px solid {color.border.base}" we want to
    // transform the original value (color.border.base) before
    // replacing that value in the string.
    tokens = await this.exportPlatform(platform);

    // This is the dictionary object we pass to the file
    // cleaning and action methods.
    const dictionary = createDictionary({ tokens });

    // We clean files first, then actions, ...and then directories?
    cleanFiles(dictionary, platformConfig);
    cleanActions(dictionary, platformConfig);
    cleanDirs(dictionary, platformConfig);

    // For chaining
    return this;
  }

  async cleanAllPlatforms() {
    await this.hasInitialized;
    await Promise.all(Object.keys(this.options.platforms).map((key) => this.cleanPlatform(key)));
    // For chaining
    return this;
  }
}
