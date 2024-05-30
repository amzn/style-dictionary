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
import chalk from 'chalk';
import { dirname } from 'path-unified';

import combineJSON from './utils/combineJSON.js';
import deepExtend from './utils/deepExtend.js';
import resolveObject from './utils/resolveObject.js';
import getName from './utils/references/getName.js';
import GroupMessages, { verbosityInfo } from './utils/groupMessages.js';
import flattenTokens from './utils/flattenTokens.js';
import { detectDtcgSyntax } from './utils/detectDtcgSyntax.js';
import { preprocess } from './utils/preprocess.js';
import { typeDtcgDelegate } from './utils/typeDtcgDelegate.js';
import createFormatArgs from './utils/createFormatArgs.js';
import { deepmerge } from './utils/deepmerge.js';
import { expandTokens } from './utils/expandObjectTokens.js';

import { resolve } from './resolve.js';
import { Register } from './Register.js';
import transformObject from './transform/object.js';
import transformConfig from './transform/config.js';
import performActions from './performActions.js';
import filterTokens from './filterTokens.js';
import cleanFiles from './cleanFiles.js';
import cleanDirs from './cleanDirs.js';
import cleanActions from './cleanActions.js';

/**
 * @typedef {import('../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../types/Config.d.ts').Config} Config
 * @typedef {import('../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../types/Config.d.ts').LogConfig} LogConfig
 * @typedef {import('../types/Config.d.ts').Expand} Expand
 * @typedef {import('../types/Config.d.ts').ExpandConfig} ExpandConfig
 * @typedef {import('../types/File.d.ts').File} File
 * @typedef {import('../types/Filter.d.ts').Filter} Filter
 * @typedef {import('../types/DesignToken.d.ts').DesignToken} Token
 * @typedef {import('../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../types/DesignToken.d.ts').DesignTokens} Tokens
 * @typedef {import('../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../types/DesignToken.d.ts').Dictionary} Dictionary
 */

const PROPERTY_VALUE_COLLISIONS = GroupMessages.GROUP.PropertyValueCollisions;
const PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;
const UNKNOWN_CSS_FONT_PROPS_WARNINGS = GroupMessages.GROUP.UnknownCSSFontProperties;

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

  /** @returns {Config} */
  get options() {
    // merge locally registered things with options
    // so that when we extend, we include registered things
    const opts = deepmerge(
      {
        hooks: this.hooks,
      },
      this._options ?? {},
    );
    return opts;
  }
  /** @param {Config} v */
  set options(v) {
    this._options = v;
  }

  /**
   * @param {Config | string} config
   * @param {{
   *   init?: boolean,
   *   verbosity?: LogConfig['verbosity'],
   *   warnings?: LogConfig['warnings'],
   *   volume?: Volume
   * }} ctorOpts
   */
  constructor(config = {}, { init = true, verbosity, warnings, volume } = {}) {
    super();
    this.config = config;
    this.options = {};
    /** @type {Tokens|TransformedTokens} */
    this.tokens = {};
    /** @type {TransformedToken[]} */
    this.allTokens = [];
    /** @type {boolean | undefined} */
    this.usesDtcg = undefined;
    /** @type {LogConfig} */
    this.log = {
      warnings: 'warn',
      verbosity: 'default',
    };
    /** @type {string[]} */
    this.source = [];
    /** @type {string[]} */
    this.include = [];
    /** @type {ExpandConfig|undefined} */
    this.expand = undefined;
    /** @type {Record<string, PlatformConfig>} */
    this.platforms = {};
    /** @type {string[]} */
    this.parsers = [];
    /** @type {string[]} */
    this.preprocessors = [];
    if (volume) {
      // when a user sets a custom FS shim, mark it for later reference
      volume.__custom_fs__ = true;
    }
    /** @type {Volume} */
    this.volume = volume ?? fs;

    /**
     * Gets set after transform because filter happens on format level,
     * so we know they are transformed by then.
     * @type {TransformedTokens}
     */
    this.unfilteredTokens = {};
    /** @type {TransformedToken[]} */
    this.unfilteredAllTokens = [];

    this.hasInitialized = new Promise((resolve) => {
      this.hasInitializedResolve = resolve;
    });

    // By default, always call async extend function when constructing new SD instance
    // However, for testability and managing error handling,
    // you can call constructor with { init: false }
    // and call SDInstance.extend() manually (and catch the error).
    if (init) {
      this.init({ verbosity, warnings });
    }
  }

  /**
   * @param {{verbosity?: LogConfig['verbosity'], warnings?: LogConfig['warnings']}} [opts]
   * @returns
   */
  async init(opts) {
    return this.extend(undefined, { ...opts, mutateOriginal: true });
  }

  /**
   * @param {Config | string} [config]
   * @param {{
   *   mutateOriginal?: boolean,
   *   verbosity?: LogConfig['verbosity'],
   *   warnings?: LogConfig['warnings'],
   *   volume?: Volume
   * }} [opts]
   * @returns {Promise<StyleDictionary>}
   */
  async extend(config = this.config, opts = {}) {
    // by default, if extend is called it means extending the current instance
    // with a new instance without mutating the original
    if (!opts.mutateOriginal) {
      const newSD = new StyleDictionary(deepmerge(this.options, config), {
        init: false,
        verbosity: opts.verbosity,
        warnings: opts.warnings,
        volume: opts.volume,
      });
      return newSD.init(opts);
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
      const cfgFilePath = resolve(config, this.volume.__custom_fs__);
      if (['json', 'json5', 'jsonc'].includes(ext)) {
        options = JSON5.parse(
          /** @type {string} */ (this.volume.readFileSync(cfgFilePath, 'utf-8')),
        );
      } else {
        let _filePath = cfgFilePath;
        if (typeof window !== 'object' && process?.platform === 'win32') {
          // Windows FS compatibility. If in browser, we use an FS shim which doesn't require this Windows workaround
          _filePath = new URL(`file:///${_filePath}`).href;
        }
        options = (await import(/* @vite-ignore */ /* webpackIgnore: true */ _filePath)).default;
      }
    } else {
      options = config;
    }

    this.log = {
      // our defaults
      ...this.log,
      // user log options override the defaults
      ...options.log,
      // verbosity/warnings is a bit more complex
      // can be passed imperatively by constructor (e.g. when using CLI --verbose / --silent / --no-warn)
      // otherwise verbosity in user config or fallback to default
      verbosity: opts.verbosity ?? options.log?.verbosity ?? this.log.verbosity,
      warnings: opts.warnings ?? options.log?.warnings ?? this.log.warnings,
    };
    this.options = {
      ...options,
      log: this.log,
    };

    // SD Config options should be passed to class instance as well
    Object.entries(this.options).forEach(([key, val]) => {
      // Bit of a type hack, making the assumption that any property in options can be set as a prop on StyleDictonary instance
      const _key = /** @type {keyof StyleDictionary} */ (key);
      this[_key] = val;
    });

    // Try to detect DTCG if not specified by user in options and tokens is passed imperatively
    if (Object.entries(this.tokens).length > 0 && this.usesDtcg === undefined) {
      this.usesDtcg = detectDtcgSyntax(this.tokens);
    }

    const appliedParsers = Object.fromEntries(
      Object.entries(this.hooks.parsers ?? {}).filter(([key]) => this.parsers.includes(key)),
    );

    // grab the inline tokens, ones either defined in the configuration object
    // or that already exist from extending another style dictionary instance
    // with `tokens` keys
    inlineTokens = deepExtend([{}, this.tokens || {}]);

    // Update tokens with includes from dependencies
    if (this.include) {
      if (!Array.isArray(this.include)) throw new Error('include must be an array');
      const result = await combineJSON(
        this.include,
        true,
        undefined,
        false,
        appliedParsers,
        this.usesDtcg,
        this.volume,
      );

      includeTokens = result.tokens;
      // If it wasn't known yet whether DTCG is used, combineJSON util will have auto-detected it by now
      if (this.usesDtcg === undefined) {
        this.usesDtcg = result.usesDtcg;
      }
    }

    // Update tokens with current package's source
    // These highest precedence
    if (this.source) {
      if (!Array.isArray(this.source)) throw new Error('source must be an array');

      const result = await combineJSON(
        this.source,
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
        appliedParsers,
        this.usesDtcg,
        this.volume,
      );

      sourceTokens = result.tokens;
      // If it wasn't known yet whether DTCG is used, combineJSON util will have auto-detected it
      if (this.usesDtcg === undefined) {
        this.usesDtcg = result.usesDtcg;
      }

      const propValCollisionCount = GroupMessages.count(PROPERTY_VALUE_COLLISIONS);
      if (propValCollisionCount > 0) {
        const collisions = GroupMessages.flush(PROPERTY_VALUE_COLLISIONS).join('\n');
        let warn = `\nToken collisions detected (${propValCollisionCount}):\n`;
        if (this.log.verbosity === 'verbose') {
          warn += `\n${collisions}\n\n`;
        } else {
          warn += verbosityInfo;
        }
        if (this.log?.warnings === 'error') {
          throw new Error(warn);
        } else if (this.log?.verbosity !== 'silent' && this.log.warnings !== 'disabled') {
          // eslint-disable-next-line no-console
          console.log(chalk.rgb(255, 140, 0).bold(warn));
        }
      }
    }

    // Merge inline, include, and source tokens
    let tokens = deepExtend([{}, inlineTokens, includeTokens, sourceTokens]);
    if (this.usesDtcg) {
      tokens = typeDtcgDelegate(tokens);
    }
    if (this.shouldRunExpansion(this.expand)) {
      tokens = expandTokens(tokens, this.options);
    }
    this.options = { ...this.options, usesDtcg: this.usesDtcg };
    this.tokens = await preprocess(
      tokens,
      this.preprocessors,
      this.hooks.preprocessors,
      this.options,
    );
    this.hasInitializedResolve(null);

    // For chaining
    return this;
  }

  /**
   * @param {ExpandConfig} [expandCfg]
   * @returns
   */
  shouldRunExpansion(expandCfg) {
    if (expandCfg !== undefined) {
      if (
        // run tokens expansion if the config is not false or if it's an object
        // and not every prop of this object is false
        !(
          (typeof expandCfg === 'boolean' && expandCfg === false) ||
          (typeof expandCfg === 'object' && Object.values(expandCfg).every((exp) => exp === false))
        )
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {string} platform
   * @returns {Promise<TransformedTokens>}
   */
  async exportPlatform(platform) {
    await this.hasInitialized;

    if (!platform || !this.platforms?.[platform]) {
      throw new Error('Please supply a valid platform');
    }

    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.platforms[platform], this, platform);

    let platformProcessedTokens = this.tokens;
    if (this.shouldRunExpansion(platformConfig.expand)) {
      platformProcessedTokens = expandTokens(platformProcessedTokens, this.options, platformConfig);
    }
    platformProcessedTokens = await preprocess(
      platformProcessedTokens,
      platformConfig.preprocessors,
      this.hooks.preprocessors,
    );

    let exportableResult = platformProcessedTokens;

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
      const transformed = await transformObject(
        exportableResult,
        platformConfig,
        this.options,
        transformationContext,
        [],
        {},
        this.volume,
      );

      // referenced values, that have not (yet) been transformed should be excluded from resolving
      const ignorePathsToResolve = deferredPropValueTransforms.map((p) =>
        getName([p, this.usesDtcg ? '$value' : 'value']),
      );
      exportableResult = resolveObject(transformed, {
        ignorePaths: ignorePathsToResolve,
        usesDtcg: this.usesDtcg,
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
        resolveObject(transformed, {
          usesDtcg: this.usesDtcg,
        });
        finished = true;
      } else {
        // neither of these things, keep going.
        deferredPropCount = newDeferredPropCount;
      }
    }

    const refWarningCount = GroupMessages.count(PROPERTY_REFERENCE_WARNINGS);
    if (refWarningCount > 0) {
      const warnings = GroupMessages.flush(PROPERTY_REFERENCE_WARNINGS).join('\n');
      let err = `\nReference Errors:\nSome token references (${refWarningCount}) could not be found.\n`;

      if (this.log.verbosity === 'verbose') {
        err += `\n${warnings}\n`;
      } else {
        err += `${verbosityInfo}\n`;
      }

      throw new Error(err);
    }

    const unknownPropsWarningCount = GroupMessages.count(UNKNOWN_CSS_FONT_PROPS_WARNINGS);
    if (unknownPropsWarningCount > 0) {
      const warnings = GroupMessages.flush(UNKNOWN_CSS_FONT_PROPS_WARNINGS).join('\n');
      let err = `\nUnknown CSS Font Shorthand properties found for ${unknownPropsWarningCount} tokens, CSS output for Font values will be missing some typography token properties as a result:\n`;

      if (this.log.verbosity === 'verbose') {
        err += `\n${warnings}\n`;
      } else {
        err += `${verbosityInfo}\n`;
      }

      if (this.log.warnings === 'error') {
        throw new Error(err);
      } else if (this.log.warnings !== 'disabled' && this.log.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log(chalk.rgb(255, 140, 0).bold(err));
      }
    }

    return exportableResult;
  }

  /**
   * This will get the dictionary / platformConfig for specified platform name
   * Runs transforms, reference resolutions
   * @param {string} platform
   * @returns
   */
  async getPlatform(platform) {
    await this.hasInitialized;
    if (!this.platforms?.[platform]) {
      throw new Error(`Platform "${platform}" does not exist`);
    }

    // We don't want to mutate the original object
    const platformConfig = transformConfig(this.platforms[platform], this, platform);

    // We need to transform the object before we resolve the
    // variable names because if a value contains concatenated
    // values like "1px solid {color.border.base}" we want to
    // transform the original value (color.border.base) before
    // replacing that value in the string.
    const tokens = await this.exportPlatform(platform);
    this.allTokens = /** @type {TransformedToken[]} */ (flattenTokens(tokens, this.usesDtcg));
    // This is the dictionary object we pass to the file
    // building and action methods.
    return { dictionary: { tokens, allTokens: this.allTokens }, platformConfig };
  }

  /**
   * Runs the format step and collects logs
   * This step may also return no output if all has been filtered out
   * Or return no destination if no destination was given,
   * this can happen if user wants to get the output in JS memory,
   * rather than outputted as a file on the filesystem
   *
   * @param {File} file
   * @param {PlatformConfig} platform
   * @param {Dictionary} dictionary
   * @returns {Promise<{
   *   logs: Record<"warning" | "success", string[]>
   *   destination?: string
   *   output?: unknown
   * }>}
   */
  async formatFile(file, platform, dictionary) {
    await this.hasInitialized;
    /** @type {Record<'warning'|'success', string[]>} */
    const logs = {
      warning: [],
      success: [],
    };
    const { destination } = file || {};
    const filter = /** @type {Filter['filter']|undefined} */ (file.filter);
    let { format } = file || {};

    if (typeof format !== 'function') throw new Error('Please enter a valid file format');
    if (destination !== undefined && typeof destination !== 'string')
      throw new Error('Please enter a valid destination');

    // get if the format is nested, this needs to be done before
    // the function is bound
    const nested = format.nested;
    // to maintain backwards compatibility we bind the format to the file object
    format = format.bind(file);
    let fullDestination = destination;

    // if there is a build path, prepend the full destination with it
    if (platform.buildPath) {
      fullDestination = platform.buildPath + fullDestination;
    }

    const filteredTokens = await filterTokens(dictionary, filter, this.options);
    const filteredDictionary = {
      ...dictionary,
      tokens: filteredTokens.tokens,
      allTokens: filteredTokens.allTokens,
      // keep the unfiltered tokens object for reference resolution
      unfilteredTokens: dictionary.tokens,
      unfilteredAllTokens: flattenTokens(dictionary.tokens, this.usesDtcg),
    };

    // if tokens object is empty, return without creating a file
    if (
      Object.hasOwn(filteredTokens, 'tokens') &&
      Object.keys(filteredTokens.tokens).length === 0 &&
      filteredTokens.tokens.constructor === Object
    ) {
      let warnNoFile = `No tokens for ${destination}. File not created.`;
      if (platform.log?.warnings === 'error') {
        throw new Error(warnNoFile);
      } else if (platform.log?.verbosity !== 'silent' && platform.log?.warnings !== 'disabled') {
        logs.warning.push(chalk.rgb(255, 140, 0)(warnNoFile));
      }
      return { logs, destination: fullDestination, output: undefined };
    }

    /**
     * Check for token name Collisions
     * @type {Record<string, TransformedToken[]>}
     */
    const nameCollisionObj = {};
    filteredTokens.allTokens &&
      filteredTokens.allTokens.forEach((tokenData) => {
        let tokenName = tokenData.name;
        if (!nameCollisionObj[tokenName]) {
          nameCollisionObj[tokenName] = [];
        }
        nameCollisionObj[tokenName].push(tokenData);
      });

    const PROPERTY_NAME_COLLISION_WARNINGS =
      GroupMessages.GROUP.PropertyNameCollisionWarnings + ':' + destination;
    GroupMessages.clear(PROPERTY_NAME_COLLISION_WARNINGS);
    Object.keys(nameCollisionObj).forEach((tokenName) => {
      if (nameCollisionObj[tokenName].length > 1) {
        let collisions = nameCollisionObj[tokenName]
          .map((token) => {
            let tokenPathText = chalk.rgb(255, 69, 0)(token.path.join('.'));
            let valueText = chalk.rgb(255, 140, 0)(this.usesDtcg ? token.$value : token.value);
            return tokenPathText + '   ' + valueText;
          })
          .join('\n        ');
        GroupMessages.add(
          PROPERTY_NAME_COLLISION_WARNINGS,
          `Output name ${chalk
            .rgb(255, 69, 0)
            .bold(tokenName)} was generated by:\n        ${collisions}`,
        );
      }
    });

    const tokenNamesCollisionCount = GroupMessages.count(PROPERTY_NAME_COLLISION_WARNINGS);

    const formattedContent = await format(
      createFormatArgs({
        dictionary: filteredDictionary,
        platform,
        options: this.options,
        file,
      }),
    );

    const filteredReferencesCount = GroupMessages.count(
      GroupMessages.GROUP.FilteredOutputReferences,
    );

    // don't show name collision warnings for nested type formats
    // because they are not relevant.
    if (
      (nested || tokenNamesCollisionCount === 0) &&
      filteredReferencesCount === 0 &&
      platform.log?.verbosity !== 'silent'
    ) {
      logs.success.push(chalk.bold.green(`✔︎ ${fullDestination}`));
    } else {
      const warnHeader = `⚠️ ${fullDestination}`;
      if (tokenNamesCollisionCount > 0) {
        const tokenNamesCollisionWarnings = GroupMessages.fetchMessages(
          PROPERTY_NAME_COLLISION_WARNINGS,
        ).join('\n    ');
        const title = `While building ${chalk
          .rgb(255, 69, 0)
          .bold(
            destination,
          )}, token collisions were found; output may be unexpected. Ignore this warning if intentional.`;
        const help = chalk.rgb(
          255,
          165,
          0,
        )(
          [
            'This many-to-one issue is usually caused by some combination of:',
            '* conflicting or similar paths/names in token definitions',
            '* platform transforms/transformGroups affecting names, especially when removing specificity',
            '* overly inclusive file filters',
          ].join('\n    '),
        );
        const warn =
          platform.log?.verbosity === 'verbose'
            ? `${warnHeader}\n${title}\n    ${tokenNamesCollisionWarnings}\n${help}`
            : `${warnHeader}\n${title}\n\n${verbosityInfo}`;
        if (platform?.log?.warnings === 'error') {
          throw new Error(warn);
        } else if (platform.log?.verbosity !== 'silent' && platform.log?.warnings !== 'disabled') {
          logs.warning.push(chalk.rgb(255, 140, 0).bold(warn));
        }
      }

      if (filteredReferencesCount > 0) {
        const filteredReferencesWarnings = GroupMessages.flush(
          GroupMessages.GROUP.FilteredOutputReferences,
        ).join('\n    ');
        const title = `While building ${chalk
          .rgb(255, 69, 0)
          .bold(
            destination,
          )}, filtered out token references were found; output may be unexpected. Ignore this warning if intentional.`;
        const help = chalk.rgb(
          255,
          165,
          0,
        )(['This is caused when combining a filter and `outputReferences`.'].join('\n    '));
        const warn =
          platform.log?.verbosity === 'verbose'
            ? `${warnHeader}\n${title}\nHere are the references that are used but not defined in the file:\n    ${filteredReferencesWarnings}\n${help}`
            : `${warnHeader}\n${title}\n\n${verbosityInfo}`;
        if (platform?.log?.warnings === 'error') {
          throw new Error(warn);
        } else if (platform.log?.verbosity !== 'silent' && platform.log?.warnings !== 'disabled') {
          logs.warning.push(chalk.rgb(255, 140, 0).bold(warn));
        }
      }
    }
    return { logs, output: formattedContent, destination: fullDestination };
  }

  /**
   * @param {string} platform
   */
  async formatPlatform(platform) {
    await this.hasInitialized;
    const { dictionary, platformConfig } = await this.getPlatform(platform);
    if (
      platformConfig.buildPath &&
      platformConfig.buildPath.slice(-1) !== '/' &&
      platformConfig.buildPath.slice(-1) !== '\\'
    ) {
      throw new Error('Build path must end in a trailing slash or you will get weird file names.');
    }

    if (!platformConfig.files) {
      throw new Error(`Cannot format platform ${platform} due to missing "files" property`);
    }

    const formattedFiles = await Promise.all(
      platformConfig.files.map((file) => {
        if (file.format) {
          return this.formatFile(file, platformConfig, dictionary);
        } else {
          throw new Error('Please supply a format');
        }
      }),
    );

    const logs = formattedFiles.map((formattedFile) => formattedFile.logs);
    if (logs) {
      if (this.log?.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log('\n' + platform);
      }
      for (let logObj of logs) {
        logObj.success.forEach((success) => {
          // eslint-disable-next-line no-console
          console.log(success);
        });
        logObj.warning.forEach((warning) => {
          // eslint-disable-next-line no-console
          console.log(warning);
        });
      }
    }

    return formattedFiles.map(({ output, destination }) => ({ output, destination }));
  }

  async formatAllPlatforms() {
    await this.hasInitialized;
    if (!this.platforms) {
      throw new Error('Cannot format platforms due to missing property "platforms" on config');
    }

    /**
     * @param {string} platformKey
     */
    const getOutputsForPlatform = async (platformKey) => {
      const outputs = await this.formatPlatform(platformKey);
      return { platform: platformKey, outputs };
    };

    const platformOutputs = await Promise.all(
      Object.keys(this.platforms).map(getOutputsForPlatform),
    );

    /**
     * Reduce platform outputs array into a keyed object, easier to consume this
     *
     * @type {Record<string, Array<{output: unknown; destination: string | undefined;}>>}
     */
    return platformOutputs.reduce((acc, curr) => ({ ...acc, [curr.platform]: curr.outputs }), {});
  }

  /**
   * @param {string} platform
   * @returns
   */
  async buildPlatform(platform) {
    await this.hasInitialized;
    const { dictionary, platformConfig } = await this.getPlatform(platform);

    /**
     * @param {string} destination
     * @param {string} output
     */
    const writeFile = async (destination, output) => {
      const dir = dirname(destination);
      try {
        await this.volume.promises.access(dir);
      } catch (e) {
        await this.volume.promises.mkdir(dir, { recursive: true });
      }
      return this.volume.promises.writeFile(destination, output);
    };

    const files = await this.formatPlatform(platform);
    if (files) {
      await Promise.all(
        files.map(({ destination, output }) => {
          if (output && destination) {
            if (typeof output !== 'string') {
              if (this.log.verbosity !== 'silent' && this.log.warnings !== 'disabled') {
                const warn = `Content type of ${destination} is not a string, so no file was created.`;
                if (this.log.warnings === 'error') {
                  throw new Error(warn);
                }
                // eslint-disable-next-line no-console
                console.log(chalk.rgb(255, 140, 0).bold(warn));
              }
              return;
            }
            return writeFile(destination, output);
          }
        }),
      );
    }
    await performActions(dictionary, platformConfig, this.options, this.volume);
    // For chaining
    return this;
  }

  async buildAllPlatforms() {
    await this.hasInitialized;
    if (this.platforms) {
      await Promise.all(Object.keys(this.platforms).map((key) => this.buildPlatform(key)));
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
    // collect logs, cleanFiles happens in parallel but we want to log in sequence
    const logs = await cleanFiles(platformConfig, this.volume);
    if (logs) {
      if (this.log?.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log('\n' + platform);
      }
      for (let logObj of logs) {
        for (let success of logObj.success) {
          // eslint-disable-next-line no-console
          console.log(success);
        }
        for (let warning of logObj.warning) {
          // eslint-disable-next-line no-console
          console.log(warning);
        }
      }
    }
    await cleanActions(dictionary, platformConfig, this.options, this.volume);
    await cleanDirs(platformConfig, this.volume);
    // For chaining
    return this;
  }

  async cleanAllPlatforms() {
    await this.hasInitialized;
    if (this.platforms) {
      await Promise.all(Object.keys(this.platforms).map((key) => this.cleanPlatform(key)));
    }
    // For chaining
    return this;
  }
}
