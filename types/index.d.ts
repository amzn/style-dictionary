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

// Minimum TypeScript Version: 3.0

import {Action as _Action} from './Action';
import {Config as _Config} from './Config';
import {DesignToken as _DesignToken, DesignTokens as _DesignTokens} from './DesignToken';
import {Dictionary as _Dictionary} from './Dictionary';
import {File as _File} from './File';
import {FileHeader as _FileHeader} from './FileHeader';
import {Filter as _Filter} from './Filter';
import {Format as _Format, Formatter as _Formatter } from './Format';
import {FormatHelpers as _FormatHelpers} from './FormatHelpers';
import {Matcher as _Matcher} from './Matcher';
import {Options as _Options} from './Options';
import {Parser as _Parser} from './Parser';
import {Platform as _Platform} from './Platform';
import {Transform as _Transform} from './Transform';
import {TransformedToken as _TransformedToken, TransformedTokens as _TransformedTokens} from './TransformedToken';
import {TransformGroup as _TransformGroup} from './TransformGroup';
import {Named as _Named} from './_helpers';

// Because this library is used in Node and needs to be accessible
// as a CommonJS module, we are declaring it as a namespace so that
// autocomplete works for CommonJS files.
declare namespace StyleDictionary {
  type Action = _Action;
  type Config = _Config;
  type DesignToken = _DesignToken;
  type DesignTokens = _DesignTokens;
  type Dictionary = _Dictionary;
  type File = _File;
  type FileHeader = _FileHeader;
  type Filter = _Filter;
  type Format = _Format;
  type FormatHelpers = _FormatHelpers;
  type Formatter = _Formatter;
  type Matcher = _Matcher;
  type Options = _Options;
  type Parser = _Parser;
  type Platform = _Platform;
  type Transform = _Transform;
  type TransformedToken = _TransformedToken;
  type TransformedTokens = _TransformedTokens;
  type TransformGroup = _TransformGroup;
  type Named<T> = _Named<T>

  interface Core {
    VERSION: string;
    tokens: DesignTokens | TransformedTokens;
    allTokens: TransformedTokens[];
    properties: DesignTokens | TransformedTokens;
    allProperties: TransformedTokens[];
    options: Config;

    transform: Record<string, Transform>;
    transformGroup: Record<string, TransformGroup['transforms']>;
    format: Record<string, Formatter>;
    action: Record<string, Action>;
    filter: Record<string, Filter['matcher']>;
    fileHeader: Record<string, FileHeader>;
    parsers: Parser[];

    formatHelpers: FormatHelpers;

    /**
     * Add a custom transform to the Style Dictionary
     * Transforms can manipulate a token's name, value, or attributes
     *
     * @param {String} transform.type - Type of transform, can be: name, attribute, or value
     * @param {String} transform.name - Name of the transformer (used by transformGroup to call a list of transforms).
     * @param {Boolean} transform.transitive - If the value transform should be applied transitively, i.e. should be applied to referenced values as well as absolute values.
     * @param {Function} [transform.matcher] - Matcher function, return boolean if transform should be applied. If you omit the matcher function, it will match all tokens.
     * @param {Function} transform.transformer Modifies a design token object. The transformer function will receive the token and the platform configuration as its arguments. The transformer function should return a string for name transforms, an object for attribute transforms, and same type of value for a value transform.
     * @example
     * ```js
     * StyleDictionary.registerTransform({
     *   name: 'time/seconds',
     *   type: 'value',
     *   matcher: function(token) {
     *     return token.attributes.category === 'time';
     *   },
     *   transformer: function(token) {
     *     return (parseInt(token.original.value) / 1000).toString() + 's';
     *   }
     * });
     * ```
     */
    registerTransform(transform: Named<Transform>): this;

    /**
     * Add a custom transformGroup to the Style Dictionary, which is a
     * group of transforms.
     * @param {String} transformGroup.name - Name of the transform group that will be referenced in config.json
     * @param {String[]} transformGroup.transforms - Array of strings that reference the name of transforms to be applied in order. Transforms must be defined and match the name or there will be an error at build time.
     * @example
     * ```js
     * StyleDictionary.registerTransformGroup({
     *   name: 'Swift',
     *   transforms: [
     *     'attribute/cti',
     *     'size/pt',
     *     'name/cti'
     *   ]
     * });
     * ```
     */
    registerTransformGroup(transformGroup: Named<TransformGroup>): this;

    /**
     * Add a custom format to Style Dictionary
     * @param {String} format.name The name of the format to be added
     * @param {Formatter} format.formatter The formatter function
     * @example
     * ```js
     * StyleDictionary.registerFormat({
     *   name: 'json',
     *   formatter: function({dictionary, platform, options, file}) {
     *     return JSON.stringify(dictionary.tokens, null, 2);
     *   }
     * })
     * ```
     */
    registerFormat(format: Named<Format>): this;

    /**
     * Add a custom template to Style Dictionary
     * @deprecated registerTemplate will be removed in the future, please use registerFormat
     * @param {String} template.name - The name of your template. You will refer to this in your config.json file.
     * @param {String} template.template - Path to your lodash template
     * @example
     * ```js
     * StyleDictionary.registerTemplate({
     *   name: 'Swift/colors',
     *   template: __dirname + '/templates/swift/colors.template'
     * });
     * ```
     */
    registerTemplate(template: Named<{ template: string }>): this;

    /**
     * Add a custom filter to Style Dictionary. Filters are used to hide tokens from
     * generated files.
     * @param {String} filter.name - Name of the filter to be referenced in your config.json
     * @param {Function} filter.matcher - Matcher function, return boolean if the token should be included.
     * @example
     * ```js
     * StyleDictionary.registerFilter({
     *   name: 'isColor',
     *   matcher: function(token) {
      *     return token.attributes.category === 'color';
      *   }
    * })
    * ```
    */
    registerFilter(filter: Named<Filter>): this;

    /**
     * Add a custom file header to Style Dictionary. File headers are used to write a
     * custom messasge on top of the generated files.
     * @param {String} fileHeader.name The name of the file header to be added
     * @param {Function} fileHeader.fileHeader The file header function
     * @example
     * ```js
     * StyleDictionary.registerFileHeader({
     *   name: 'custmoHeader',
     *   fileHeader: function(defaultMessage) {
     *      return return [
     *        `hello`,
     *        ...defaultMessage
     *      ]
     *   }
     * })
     * ```
     */
     registerFileHeader(fileHeader: Named<{ fileHeader: FileHeader }>): this;

    /**
     * Adds a custom parser to parse style dictionary files. This allows you to modify
     * the design token data before it gets to Style Dictionary or write your
     * token files in a language other than JSON, JSONC, JSON5, or CommonJS modules.
     *
     * @param {Regex} parser.pattern - A file path regular expression to match which files this parser should be be used on. This is similar to how webpack loaders work. `/\.json$/` will match any file ending in '.json', for example.
     * @param {Function} parser.parse - Function to parse the file contents. Takes 1 argument, which is an object with 2 attributes: contents which is the string of the file contents and filePath. The function should return a plain Javascript object.
     * @example
     * ```js
     * StyleDictionary.registerParser({
     *   pattern: /\.json$/,
     *   parse: ({contents, filePath}) => {
     *     return JSON.parse(contents);
     *   }
     * })
     * ```
     */
    registerParser(parser: Parser): this;

    /**
     * Adds a custom action to Style Dictionary. Actions
     * are functions that can do whatever you need, such as: copying files,
     * base64'ing files, running other build scripts, etc.
     * After you register a custom action, you then use that
     * action in a platform your configuration
     *
     * You can perform operations on files generated by the style dictionary
     * as actions run after these files are generated.
     * Actions are run sequentially, if you write synchronous code then
     * it will block other actions, or if you use asynchronous code like Promises
     * it will not block.
     *
     * @param {String} action.name - The name of the action
     * @param {Function} action.do - The action in the form of a function.
     * @param {Function} [action.undo] - A function that undoes the action.
     * @example
     * ```js
     * StyleDictionary.registerAction({
     *   name: 'copy_assets',
     *   do: function(dictionary, config) {
     *     console.log('Copying assets directory');
     *     fs.copySync('assets', config.buildPath + 'assets');
     *   },
     *   undo: function(dictionary, config) {
     *     console.log('Cleaning assets directory');
     *     fs.removeSync(config.buildPath + 'assets');
     *   }
     * });
     * ```
     */
    registerAction(action: Named<Action>): this;

    /**
     * Exports a tokens object with applied
     * platform transforms.
     *
     * This is useful if you want to use a style
     * dictionary in JS build tools like webpack.
     *
     * @param {String} platform - Name of the platform to be exported. This platform name must exist on the Style Dictionary configuration.
     */
    exportPlatform(platform: string): TransformedTokens;

    /**
     * Takes a platform and performs all transforms to
     * the tokens object (non-mutative) then
     * builds all the files and performs any actions. This is useful if you only want to
     * build the artifacts of one platform to speed up the build process.
     *
     * This method is also used internally in `.buildAllPlatforms` to
     * build each platform defined in the config.
     *
     * @param {String} platform - Name of the platform you want to build. This platform name must exist on the Style Dictionary configuration.
     * @example
     * ```js
     * StyleDictionary.buildPlatform('web');
     * ```
     * ```bash
     * $ style-dictionary build --platform web
     * ```
     */
    buildPlatform(platform: string): this;

    /**
     * Will build all the platforms defined in the configuration.
     *
     * @example
     * ```js
     * const StyleDictionary = require('style-dictionary').extend('config.json');
     * StyleDictionary.buildAllPlatforms();
     * ```
    */
    buildAllPlatforms(): this;

    /**
     * Takes a platform and performs all transforms to
     * the tokens object (non-mutative) then
     * cleans all the files and performs the undo method of any actions.
     *
     * @param {String} platform
     */
    cleanPlatform(platform: string): this;

    /**
     * Does the reverse of `.buildAllPlatforms` by
     * performing a clean on each platform. This removes all the files
     * defined in the platform and calls the undo method on any actions.
     *
     * @example
     * ```js
     * StyleDictionary.cleanAllPlatforms();
     * ```
     */
    cleanAllPlatforms(): this;

    /**
     * Creates a Style Dictionary
     * @param {String | Config} config - The configuration for Style Dictionary, can either be a path to a JSON or CommonJS file or a configuration object.
     * @example
     * ```js
     * const StyleDictionary = require('style-dictionary').extend('config.json');
     *
     * const StyleDictionary = require('style-dictionary').extend({
     *   source: ['tokens/*.json'],
     *   platforms: {
     *     scss: {
     *       transformGroup: 'scss',
     *       buildPath: 'build/',
     *       files: [{
     *         destination: 'variables.scss',
     *         format: 'scss/variables'
     *       }]
     *     }
     *     // ...
     *   }
     * });
     * ```
     */
    extend(config: string | Config): Core;
  }
}

declare var StyleDictionary: StyleDictionary.Core;
export = StyleDictionary;
