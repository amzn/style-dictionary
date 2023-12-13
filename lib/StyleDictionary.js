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

import combineJSON from './utils/combineJSON.js';
import deepExtend from './utils/deepExtend.js';
import resolveObject from './utils/resolveObject.js';
import getName from './utils/references/getName.js';
import createDictionary from './utils/createDictionary.js';
import GroupMessages from './utils/groupMessages.js';
import { preprocess } from './utils/preprocess.js';

import transformObject from './transform/object.js';
import transformConfig from './transform/config.js';
import performActions from './performActions.js';
import buildFiles from './buildFiles.js';
import cleanFiles from './cleanFiles.js';
import cleanDirs from './cleanDirs.js';
import cleanActions from './cleanActions.js';

/**
 * @typedef {import('../types/File.d.ts').FileHeader} FileHeader
 * @typedef {import('../types/Parser.d.ts').Parser} Parser
 * @typedef {import('../types/Preprocessor.d.ts').Preprocessor} Preprocessor
 * @typedef {import('../types/Preprocessor.d.ts').preprocessor} preprocessor
 * @typedef {import('../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../types/Filter.d.ts').Filter} Filter
 * @typedef {import('../types/Filter.d.ts').Matcher} Matcher
 * @typedef {import('../types/Format.d.ts').Format} Format
 * @typedef {import('../types/Format.d.ts').Formatter} Formatter
 * @typedef {import('../types/Action.d.ts').Action} Action
 * @typedef {import('../types/Config.d.ts').Config} Config
 */

const PROPERTY_VALUE_COLLISIONS = GroupMessages.GROUP.PropertyValueCollisions;
const PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

// TODO: add Type interface for this class

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
  static transform = transform;
  static transformGroup = transformGroup;
  static format = format;
  static action = action;
  static filter = filter;
  /** @type {Record<string, FileHeader>} */
  static fileHeader = {};
  /** @type {Parser[]} */
  static parsers = []; // we need to initialise the array, since we don't have built-in parsers
  /** @type {Record<string, preprocessor>} */
  static preprocessors = {};

  /**
   * @param {Transform} cfg
   */
  static registerTransform(cfg) {
    // this = class
    this.__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} cfg
   */
  registerTransform(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} transform
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerTransform(transform, target) {
    const transformTypes = ['name', 'value', 'attribute'];
    const { type, name, matcher, transitive, transformer } = transform;
    if (typeof type !== 'string') throw new Error('type must be a string');
    if (transformTypes.indexOf(type) < 0)
      throw new Error(type + ' type is not one of: ' + transformTypes.join(', '));
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (matcher && typeof matcher !== 'function') throw new Error('matcher must be a function');
    if (typeof transformer !== 'function') throw new Error('transformer must be a function');

    // make sure to trigger the setter
    target.transform = {
      ...target.transform,
      [name]: {
        type,
        matcher,
        transitive: !!transitive,
        transformer,
      },
    };
    return this;
  }

  get transform() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.transform, ...this._transform };
  }

  /** @param {Record<string, Omit<Transform, 'name'>>} v */
  set transform(v) {
    this._transform = v;
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  static registerTransformGroup(cfg) {
    // this = class
    this.__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  registerTransformGroup(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} transformGroup
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerTransformGroup(transformGroup, target) {
    const { name, transforms } = transformGroup;
    if (typeof name !== 'string') throw new Error('transform name must be a string');
    if (!Array.isArray(transforms))
      throw new Error('transforms must be an array of registered value transforms');

    transforms.forEach((t) => {
      if (!(t in target.transform))
        throw new Error('transforms must be an array of registered value transforms');
    });
    // make sure to trigger the setter
    target.transformGroup = {
      ...target.transformGroup,
      [name]: transforms,
    };
    return target;
  }

  get transformGroup() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.transformGroup, ...this._transformGroup };
  }

  /** @param {Record<string, string[]>} v */
  set transformGroup(v) {
    this._transformGroup = v;
  }

  /**
<<<<<<< HEAD
   *
   * @param {Object|string} [config]
   * @param {{ init: boolean }} [options]
   */
  constructor(config = {}, { init = true } = {}) {
    // dynamically add these instance methods to delegate to class methods for register<Thing>
    [
      'transform',
      'transformGroup',
      'format',
      'action',
      'filter',
      'fileHeader',
      'parser',
      'preprocessor',
    ].forEach((prop) => {
      Object.defineProperty(this, `register${prop.charAt(0).toUpperCase() + prop.slice(1)}`, {
        value: (...args) => {
          this.constructor[`register${prop.charAt(0).toUpperCase() + prop.slice(1)}`](...args);
        },
      });
=======
   * @param {Format} cfg
   */
  static registerFormat(cfg) {
    // this = class
    this.__registerFormat(cfg, this);
  }
>>>>>>> chore: type StyleDictionary register methods, make it behave consistent

  /**
   * @param {Format} cfg
   */
  registerFormat(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerFormat(cfg, this);
  }

  /**
   * @param  {Format} format
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerFormat(format, target) {
    const { name, formatter } = format;
    if (typeof name !== 'string')
      throw new Error("Can't register format; format.name must be a string");
    if (typeof formatter !== 'function')
      throw new Error("Can't register format; format.formatter must be a function");
    // make sure to trigger the setter
    target.format = {
      ...target.format,
      [name]: formatter,
    };
    return target;
  }

  get format() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.format, ...this._format };
  }

  /** @param {Record<string, Formatter>} v */
  set format(v) {
    this._format = v;
  }

  /**
   * @param {Action} cfg
   */
  static registerAction(cfg) {
    // this = class
    this.__registerAction(cfg, this);
  }

  /**
   * @param {Action} cfg
   */
  registerAction(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerAction(cfg, this);
  }

  /**
   * @param {Action} action
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerAction(action, target) {
    const { name, do: _do, undo } = action;
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (typeof _do !== 'function') throw new Error('do must be a function');
    // make sure to trigger the setter
    target.action = {
      ...target.action,
      [name]: {
        do: _do,
        undo,
      },
    };
    return target;
  }

  get action() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.action, ...this._action };
  }

  /** @param {Record<string, Omit<Action,'name'>>} v */
  set action(v) {
    this._action = v;
  }

  /**
   * @param {Filter} cfg
   */
  static registerFilter(cfg) {
    // this = class
    this.__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} cfg
   */
  registerFilter(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} filter
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerFilter(filter, target) {
    const { name, matcher } = filter;
    if (typeof name !== 'string')
      throw new Error("Can't register filter; filter.name must be a string");
    if (typeof matcher !== 'function')
      throw new Error("Can't register filter; filter.matcher must be a function");
    // make sure to trigger the setter
    target.filter = {
      ...target.filter,
      [name]: matcher,
    };
    return target;
  }

  get filter() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.filter, ...this._filter };
  }

  /** @param {Record<string, Matcher>} v */
  set filter(v) {
    this._filter = v;
  }

  /**
   * @param {Parser} cfg
   */
  static registerParser(cfg) {
    // this = class
    this.__registerParser(cfg, this);
  }

  /**
   * @param {Parser} cfg
   */
  registerParser(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerParser(cfg, this);
  }

  /**
   * @param {import('../types/Parser.d.ts').Parser} parser
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerParser(parser, target) {
    const { pattern, parse } = parser;
    if (!(pattern instanceof RegExp))
      throw new Error(`Can't register parser; parser.pattern must be a regular expression`);
    if (typeof parse !== 'function')
      throw new Error("Can't register parser; parser.parse must be a function");
    // make sure to trigger the setter
    target.parsers = [...target.parsers, parser];
    return target;
  }

  get parsers() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return [...ctor.parsers, ...(this._parsers ?? [])];
  }

  /** @param {Parser[]} v */
  set parsers(v) {
    this._parsers = v;
  }

  /**
   * @param {Preprocessor} cfg
   */
  static registerPreprocessor(cfg) {
    // this = class
    this.__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   */
  registerPreprocessor(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerPreprocessor(cfg, target) {
    const { name, preprocessor } = cfg;
    const errorPrefix = 'Cannot register preprocessor;';
    if (typeof name !== 'string')
      throw new Error(`${errorPrefix} Preprocessor.name must be a string`);
    if (!(preprocessor instanceof Function)) {
      throw new Error(`${errorPrefix} Preprocessor.preprocessor must be a function`);
    }
    // make sure to trigger the setter
    target.preprocessors = {
      ...target.preprocessors,
      [name]: preprocessor,
    };
    return target;
  }

  get preprocessors() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.preprocessors, ...this._preprocessors };
  }

  /** @param {Record<string, preprocessor>} v */
  set preprocessors(v) {
    this._preprocessors = v;
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  static registerFileHeader(cfg) {
    // this = class
    this.__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  registerFileHeader(cfg) {
    // this = instance
    /** @type {typeof StyleDictionary} */ (this.constructor).__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   * @param {typeof StyleDictionary | StyleDictionary} target
   */
  static __registerFileHeader(cfg, target) {
    const { name, fileHeader } = cfg;
    if (typeof name !== 'string')
      throw new Error("Can't register file header; options.name must be a string");
    if (typeof fileHeader !== 'function')
      throw new Error("Can't register file header; options.fileHeader must be a function");

    // make sure to trigger the setter
    target.fileHeader = {
      ...target.fileHeader,
      [name]: fileHeader,
    };
    return target;
  }

  get fileHeader() {
    const ctor = /** @type {typeof StyleDictionary} */ (this.constructor);
    return { ...ctor.fileHeader, ...this._fileHeader };
  }

  /** @param {Record<string, FileHeader>} v */
  set fileHeader(v) {
    this._fileHeader = v;
  }

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
    this.config = config;
    this.options = {};
    this.tokens = {};
    this.allTokens = {};

    this.transform = {};
    this.transformGroup = {};
    this.format = {};
    this.action = {};
    this.filter = {};
    this.fileHeader = {};
    this.parsers = []; // we need to initialise the array, since we don't have built-in parsers
    this.preprocessors = {};
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
    const unprocessedTokens = deepExtend([{}, inlineTokens, includeTokens, sourceTokens]);
    this.tokens = await preprocess(unprocessedTokens, this.preprocessors);
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
